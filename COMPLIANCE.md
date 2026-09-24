# LUME Compliance & Status (Honest Labels)

## Maturity

| Item | Status |
|---|---|
| Product maturity | **Pilot-ready prototype** (not production-certified) |
| DPDP Act 2023 | **Designed for DPDP compliance; review pending** |
| GIGW / accessibility | WCAG-aligned goals; formal GIGW version **VERIFY pending** |
| Hosting empanelment (govt) | **Not assessed** — India-resident hosting required before govt deployment |
| Security review | **Not completed** |

## What LUME ships today

- Deterministic statutory-clock **engine** with empty verified rule registry (rules appear only after VERIFY against bare Act text).
- Compensation calculator with empty verified formula registry.
- Reconstructed case-file **format + empty registry + backtest UI** (INSUFFICIENT_DATA until real gazette reconstructions exist).
- Freshness badge + Fact provenance wrapper (ABSENT when unconfirmed).
- Survival/Kaplan–Meier service that **abstains** when n &lt; 5.
- Playbook action workflow UI marked **DRAFT: pending expert review**.
- FastAPI + PostgreSQL schema scaffold under `server/` (roles, audit_log, fail-closed predictions).
- CI: typecheck, data-contract lint, tests, build.

## What LUME does not claim

- No fixed accuracy, Brier, or “4.2M / 1,467 / SHAP / calibrated” marketing metrics.
- No live government registry connectors without credentials and terms review.
- No autonomous legal, financial, or takeover decisions.
- No DPDP “compliant” badge until review completes.

## Required before Phase 2 pilot

1. Primary-source VERIFY of RFCTLARR / NH Act rule table (Section 6).
2. 5–10 reconstructed case files with URL + SHA-256 per timeline event.
3. Expert sign-off on playbooks.
4. MoU/RTI pilot with one district or agency.
5. Terms of use + robots.txt review for every automated source.

## Required before Phase 3 commercialization

1. Security/DPDP review and remediation.
2. India-resident hosting and any empanelment requirements.
3. Customer interview–validated pricing (currently HYPOTHESIS only).
