from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone
from typing import Annotated, Literal
from uuid import uuid4

from fastapi import Depends, FastAPI, Header, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import Boolean, Column, DateTime, Integer, String, Text, create_engine, text
from sqlalchemy.dialects.postgresql import JSONB, UUID
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

DATABASE_URL = os.environ.get("LUME_DATABASE_URL", "postgresql+psycopg://lume:lume@localhost:5432/lume")
JWT_SECRET = os.environ.get("LUME_JWT_SECRET", "")
ALGORITHM = "HS256"
TOKEN_TTL_MINUTES = int(os.environ.get("LUME_TOKEN_TTL_MINUTES", "60"))

engine = create_engine(DATABASE_URL, pool_pre_ping=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)

app = FastAPI(title="LUME API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.environ.get("LUME_CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class Base(DeclarativeBase):
    pass


class AuditLog(Base):
    __tablename__ = "audit_log"
    id = Column(Integer, primary_key=True)
    actor = Column(Text, nullable=False)
    action = Column(Text, nullable=False)
    entity = Column(Text, nullable=False)
    before = Column(JSONB)
    after = Column(JSONB)
    at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))


class HealthOut(BaseModel):
    status: Literal["ok"] = "ok"
    time: datetime


class LoginIn(BaseModel):
    email: str
    password: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str


class FactIn(BaseModel):
    project_id: str
    field: str
    value_json: dict
    document_id: str | None = None
    source_span: str | None = None
    extraction_method: str
    confidence: float | None = Field(default=None, ge=0, le=1)
    review_status: Literal["pending", "confirmed", "rejected"] = "pending"


class PredictionIn(BaseModel):
    project_id: str
    model_version: str
    horizon_days: int
    n_reference: int
    input_fact_ids: list[str] = []
    p_delay: float | None = None
    abstained: bool = True
    abstain_reason: str | None = "INSUFFICIENT_DATA"


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def write_audit(db: Session, actor: str, action: str, entity: str, before: dict | None, after: dict | None) -> None:
    db.add(AuditLog(actor=actor, action=action, entity=entity, before=before, after=after))
    db.flush()


def require_auth(authorization: Annotated[str | None, Header()] = None) -> dict:
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    if not JWT_SECRET:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth not configured")
    try:
        from jose import jwt
        payload = jwt.decode(token, JWT_SECRET, algorithms=[ALGORITHM])
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc
    return {"sub": payload.get("sub", ""), "role": payload.get("role", "CITIZEN")}


@app.get("/health", response_model=HealthOut)
def health() -> HealthOut:
    return HealthOut(time=datetime.now(timezone.utc))


@app.post("/auth/login", response_model=TokenOut)
def login(body: LoginIn, db: Annotated[Session, Depends(get_db)]) -> TokenOut:
    if not JWT_SECRET:
        raise HTTPException(status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail="Auth not configured")
    from jose import jwt
    from passlib.context import CryptContext
    pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
    row = db.execute(
        text("SELECT id, password_hash, role FROM users WHERE email = :email"),
        {"email": body.email},
    ).first()
    if not row or not pwd.verify(body.password, row.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    now = datetime.now(timezone.utc)
    exp = now + timedelta(minutes=TOKEN_TTL_MINUTES)
    token = jwt.encode({"sub": str(row.id), "role": row.role, "exp": exp}, JWT_SECRET, algorithm=ALGORITHM)
    write_audit(db, str(row.id), "LOGIN", "users", None, {"email": body.email})
    db.commit()
    return TokenOut(access_token=token, role=row.role)


@app.post("/facts")
def create_fact(body: FactIn, db: Annotated[Session, Depends(get_db)], user: Annotated[dict, Depends(require_auth)]) -> dict:
    fact_id = str(uuid4())
    db.execute(
        text(
            """
            INSERT INTO facts (id, project_id, field, value_json, document_id, source_span,
                               extraction_method, confidence, review_status)
            VALUES (:id, :project_id, :field, CAST(:value_json AS jsonb), :document_id, :source_span,
                    :extraction_method, :confidence, :review_status)
            """
        ),
        {
            "id": fact_id,
            "project_id": body.project_id,
            "field": body.field,
            "value_json": __import__("json").dumps(body.value_json),
            "document_id": body.document_id,
            "source_span": body.source_span,
            "extraction_method": body.extraction_method,
            "confidence": body.confidence,
            "review_status": body.review_status,
        },
    )
    write_audit(db, user["sub"], "CREATE", "facts", None, body.model_dump())
    db.commit()
    return {"id": fact_id, "review_status": body.review_status}


@app.post("/predictions")
def create_prediction(body: PredictionIn, db: Annotated[Session, Depends(get_db)], user: Annotated[dict, Depends(require_auth)]) -> dict:
    if body.n_reference < 5 or body.abstained:
        body.p_delay = None
        body.abstained = True
        body.abstain_reason = body.abstain_reason or "INSUFFICIENT_DATA"
    pred_id = str(uuid4())
    db.execute(
        text(
            """
            INSERT INTO predictions (id, project_id, model_version, horizon_days, p_delay,
                                     n_reference, input_fact_ids, abstained, abstain_reason)
            VALUES (:id, :project_id, :model_version, :horizon_days, :p_delay,
                    :n_reference, CAST(:input_fact_ids AS uuid[]), :abstained, :abstain_reason)
            """
        ),
        {
            "id": pred_id,
            "project_id": body.project_id,
            "model_version": body.model_version,
            "horizon_days": body.horizon_days,
            "p_delay": body.p_delay,
            "n_reference": body.n_reference,
            "input_fact_ids": "{" + ",".join(body.input_fact_ids) + "}" if body.input_fact_ids else "{}",
            "abstained": body.abstained,
            "abstain_reason": body.abstain_reason,
        },
    )
    write_audit(db, user["sub"], "CREATE", "predictions", None, body.model_dump())
    db.commit()
    return {"id": pred_id, "abstained": body.abstained, "abstain_reason": body.abstain_reason}


@app.get("/audit")
def list_audit(db: Annotated[Session, Depends(get_db)], user: Annotated[dict, Depends(require_auth)], limit: int = 50) -> list[dict]:
    rows = db.execute(
        text("SELECT id, actor, action, entity, before, after, at FROM audit_log ORDER BY id DESC LIMIT :limit"),
        {"limit": min(limit, 200)},
    ).mappings().all()
    return [dict(r) for r in rows]
