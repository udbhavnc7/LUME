-- LUME Phase 1 core schema (PostgreSQL + PostGIS)
-- Documents and facts are append-only.

CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS sources (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  publisher TEXT NOT NULL,
  base_url TEXT NOT NULL,
  terms_note TEXT,
  access_method TEXT NOT NULL,
  verified_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY,
  source_id UUID NOT NULL REFERENCES sources(id),
  url TEXT NOT NULL,
  fetched_at TIMESTAMPTZ NOT NULL,
  sha256 TEXT NOT NULL CHECK (sha256 ~ '^[a-f0-9]{64}$'),
  content_type TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  agency TEXT NOT NULL,
  statute_route TEXT NOT NULL,
  corridor_type TEXT NOT NULL,
  state TEXT NOT NULL,
  district_codes TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS facts (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  field TEXT NOT NULL,
  value_json JSONB NOT NULL,
  document_id UUID REFERENCES documents(id),
  source_span TEXT,
  extraction_method TEXT NOT NULL,
  confidence NUMERIC(4,3) CHECK (confidence >= 0 AND confidence <= 1),
  review_status TEXT NOT NULL CHECK (review_status IN ('pending', 'confirmed', 'rejected')),
  extracted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  event_type TEXT NOT NULL,
  event_date DATE NOT NULL,
  fact_id UUID REFERENCES facts(id)
);

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  model_version TEXT NOT NULL,
  horizon_days INT NOT NULL,
  p_delay NUMERIC(5,4),
  ci_low NUMERIC(5,4),
  ci_high NUMERIC(5,4),
  n_reference INT NOT NULL DEFAULT 0,
  input_fact_ids UUID[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  abstained BOOLEAN NOT NULL DEFAULT false,
  abstain_reason TEXT
);

CREATE TABLE IF NOT EXISTS actions (
  id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES projects(id),
  playbook_id TEXT NOT NULL,
  owner_role TEXT NOT NULL,
  due_date DATE,
  status TEXT NOT NULL DEFAULT 'DRAFT',
  outcome TEXT,
  closed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS audit_log (
  id BIGSERIAL PRIMARY KEY,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  entity TEXT NOT NULL,
  before JSONB,
  after JSONB,
  at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN (
    'DISTRICT_OFFICER','SENIOR_DEPARTMENTAL','PMU_EXECUTION',
    'LEGAL_GRIEVANCE','DATA_ADMIN','POLICY_ANALYST','CITIZEN'
  )),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_facts_project ON facts(project_id);
CREATE INDEX IF NOT EXISTS idx_events_project ON events(project_id);
CREATE INDEX IF NOT EXISTS idx_predictions_project ON predictions(project_id);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity);
