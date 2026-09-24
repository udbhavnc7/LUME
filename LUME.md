# LUME v10: Real-Data Roadmap & Build Spec

*Statutory Land Acquisition Foresight & Intervention Decision Engine*
*Repo: github.com/udbhavnc7/LUME · Stack: React 18, TypeScript (strict), Vite, Tailwind v4, Recharts, PWA*

---

## 0. How to use this document

This is the single source of truth for taking LUME from a mock-data prototype to a credible, real-data product. It is written for both the human team and any AI coding assistant.

- **Section 2 (the Real-Data Contract) overrides everything else.** If a task conflicts with it, the contract wins.
- Anything marked **VERIFY** must be checked against a primary source (bare Act text, official notification, portal terms) before it is coded or shown to a user. This document is not legal advice.
- Anything marked **HYPOTHESIS** is a business assumption to validate, not a fact.

---

## 1. Vision and positioning

**One-line pitch:** LUME tells land-acquisition officers *where the next statutory bottleneck will occur, how sure we are, and what legally valid action to take about it*, and tells affected citizens where they stand and what their rights are.

**Positioning decisions**

1. **Cover both statutes.** RFCTLARR Act 2013 and the National Highways Act 1956. SIH26017 is a Ministry of Rural Development problem statement (RFCTLARR is administered through its land resources side), while the current README footer pitches only MoRTH/NHAI. National highways are the *data-rich starting corridor*, not the whole product.
2. **Decision layer, not a registry.** LUME sits above existing systems (Bhoomi Rashi, PARIVESH, e-Courts, state land records). It does not replace them.
3. **Advisory only.** No autonomous legal, financial, or takeover decisions. Human in the loop, always.
4. **Two-sided.** Officers get foresight and action queues. Citizens get transparency and rights information. The citizen side must stay neutral and rights-first.

**Why the problem is real (refresh these numbers from the latest report before publishing):** MoSPI's Infrastructure and Project Monitoring Division tracks central-sector projects costing ₹150 crore and above using data agencies enter in the OCMS. A February 2024 report showed 443 of 1,902 monitored projects with cost overruns totalling about ₹4.92 lakh crore (roughly 18% of original cost), 764 projects delayed, and an average time overrun of about 36 months. Land acquisition is among the recurring reasons agencies cite.

---

## 2. The Real-Data Contract (non-negotiable)

Every value shown anywhere in the app must be exactly one of:

| Class | Meaning | Required metadata |
|---|---|---|
| **SOURCED** | Extracted or copied from a real document or dataset | source, URL, fetched-at, SHA-256 of the document, extraction method, confidence |
| **COMPUTED** | Deterministic or statistical output derived from SOURCED inputs | list of input fact IDs, formula/model version, sample size where statistical |
| **ABSENT** | Not available | the UI shows an explicit empty or "insufficient data" state |

**Rules**

1. No mock, dummy, placeholder, randomly generated, or LLM-invented data in anything shipped. Delete `src/data/mockData.ts` and `src/data/mockDataV7.ts` from the production build path.
2. No statistic, count, or coverage claim in the README, UI, or pitch that is not traceable to SOURCED or COMPUTED data. (Remove "4.2M precedent base", "28 states and 700+ districts", and "SHAP-inspired" unless and until they are true.)
3. **Test fixtures** are allowed only under `/tests/`, must be derived from real documents (redacted where needed), and must never be imported by production code.
4. **Enforcement**
   - CI lint rule: fail the build if `src/` (excluding `tests/`) imports `faker`, uses `Math.random()` to produce displayed values, or imports any file matching `*mock*`.
   - Runtime rule: UI components render facts only via a `<Fact>` wrapper that requires a `provenance` prop; a fact without provenance renders as ABSENT.
   - Every screen shows a freshness badge ("Data as of…") and a source link on hover or tap.
5. LLMs may be used to *extract* fields from real documents, but each extracted field must carry the source document, the exact source span, and a confidence. Low-confidence extractions go to a human-review queue and are not displayed as facts until confirmed.
6. Respect each portal's terms of use and robots.txt, rate-limit all fetchers, and prefer official APIs, downloads, RTI responses, or MoUs over scraping.

---

## 3. What changes from v9

| v9 claim / feature | Problem | v10 change |
|---|---|---|
| "4.2M precedent base", "28 states and 700+ districts" | Not backed by real data | Replace with the count of real, reconstructed case files, shown live from the database |
| "Calibrated ML engine", "SHAP-inspired" drivers | No real training data | Survival analysis on real timelines, with sample sizes, confidence intervals, and a calibration page |
| Counterfactual sliders with invented multipliers | Fake precision | Compensation math is exact and statutory; delay effects come only from historical evidence, else "no evidence yet" |
| Client-only PWA with IndexedDB | Cannot serve multiple users, roles, or audit needs | Backend with roles, audit log, and scheduled ingestion; PWA stays as the offline shell |
| "Release v9.0 Production" badge | Overclaims | Use an honest status such as "Pilot-ready prototype" |
| "DPDP Act 2023 Compliant" | Unreviewed claim | "Designed for DPDP compliance; review pending" until a review is done |
| Footer: MoRTH/NHAI only | Weakens problem fit | Multi-statute, multi-sector framing (Section 1) |
| Statutory clock text conflates Sec 19 lapse and Sec 25 lapse | Legal inaccuracy | Model them as separate clocks (Section 6) |

---

## 4. Data sources and acquisition plan

Access status below reflects what could be confirmed at time of writing. **VERIFY** terms and access for each before building.

| Source | What it provides | Access | Use in LUME |
|---|---|---|---|
| **MoSPI IPMD flash reports** | Monthly status of central-sector projects ≥ ₹150 crore: delay months, cost overrun, stated reasons | Public reports (PDF/Excel) | Project-level delay labels, sector base rates, market sizing |
| **e-Gazette (egazette.gov.in) and state gazettes** | 3A, 3D, 3G and RFCTLARR notifications with dates, villages, areas | Public documents | Core source: build real timelines via OCR/NLP extraction |
| **Bhoomi Rashi (MoRTH)** | The platform where NH acquisition notifications are processed end to end; integrated with PFMS for compensation payments; public project-status search | Public search page; no public API confirmed | Project status cross-check. VERIFY terms before any automated access |
| **NHAI time-bound acquisition schedule** | Step-wise timeline, optimum 336 days to mutation; Bhoomi Rashi use mandated; weekly and fortnightly monitoring | Public policy summary; get the primary circular | Benchmark clock and escalation logic. VERIFY against the NHAI circular |
| **CAG audit reports** | Documented causes of land-acquisition delay in real projects | Public PDFs | Text corpus for precedents and cause taxonomy, with citations |
| **Parliament Q&A (sansad.in)** | State-wise land acquisition statistics from ministries | Public | Authoritative context statistics |
| **PARIVESH** | Forest/environment clearance proposal status | Public views; VERIFY terms | Clearance-stage signals |
| **e-Courts / NJDG; High Court and Supreme Court judgments** | Case status and judgment text | Public views; bulk access limited. VERIFY | Litigation signals; text-mine judgments for grounds of challenge |
| **State land records and circle rates** | Ownership records, guideline values | Varies by state | Compensation inputs. VERIFY per state |
| **Sentinel-2 (Copernicus)** | Free multispectral imagery | Open | NDVI screening only. Multi-crop status needs multi-season imagery and ground verification; never present as a legal determination |
| **RTI and pilot MoUs** | District milestone logs, sale-deed data (not openly available) | Formal request | The path to data that public sources do not offer |

**Honest limit:** no public source provides milestone-level (Sec 19 / 26 / 38) histories at scale. Do not simulate them. Build them from gazettes, and obtain more through a pilot.

---

## 5. Data architecture and provenance schema

### Recommended stack (change only with good reason)

- **Frontend:** existing React + TypeScript (strict) + Vite + Tailwind v4 PWA.
- **API and ingestion:** Python FastAPI service.
- **Database:** PostgreSQL + PostGIS.
- **Jobs:** a scheduler for fetch, extract, validate, and model jobs.
- **Modeling:** `lifelines` or `scikit-survival`.
- **Storage:** object store for raw documents (immutable, hashed).
- **Hosting:** India-resident. VERIFY empanelment requirements for any government deployment.

### Core tables (minimum viable)

```sql
sources     (id, name, publisher, base_url, terms_note, access_method, verified_at)
documents   (id, source_id, url, fetched_at, sha256, content_type, storage_path)
projects    (id, name, agency, statute_route, corridor_type, state, district_codes[])
facts       (id, project_id, field, value_json, document_id, source_span,
             extraction_method, confidence, review_status, extracted_at)
events      (id, project_id, event_type, event_date, fact_id)      -- 3A, 3D, 11, 19, award, etc.
predictions (id, project_id, model_version, horizon_days, p_delay, ci_low, ci_high,
             n_reference, input_fact_ids[], created_at, abstained, abstain_reason)
actions     (id, project_id, playbook_id, owner_role, due_date, status, outcome, closed_at)
audit_log   (id, actor, action, entity, before, after, at)
```

Rules: `documents` and `facts` are append-only. UI reads only `facts` with `review_status = 'confirmed'` or the machine-confidence threshold defined in config. Every `predictions` row lists its `input_fact_ids`.

---

## 6. Statutory rules engine (deterministic layer)

Statutory clocks are law, not prediction. Compute them exactly, label them **STATUTORY**, and keep them separate from probabilistic outputs.

### Rule table: VERIFY every row against the bare Act and current amendments before coding

| Route | Clock / rule | Trigger → Deadline | Consequence |
|---|---|---|---|
| RFCTLARR Sec 15 | Objections window | Sec 11 publication → 60 days | Hearing of objections |
| RFCTLARR Sec 19(7) | Declaration deadline | Sec 11 publication → 12 months | Preliminary notification lapses |
| RFCTLARR Sec 25 | Award deadline | Sec 19 declaration → 2 years | Proceedings lapse |
| RFCTLARR Sec 30 | Solatium | Applied to compensation | 100% solatium |
| RFCTLARR Sec 38 | Payment before possession | Award → possession | Possession only after payment |
| RFCTLARR Sec 10 | Food-security safeguard | Multi-crop irrigated land | Acquisition restrictions |
| NH Act Sec 3A/3C/3D | Notification, objections, declaration | 3A publication → objections window (VERIFY days) → 3D within 1 year | 3A lapses if 3D is not made in time |
| NH Act Sec 3G / 3H / 3E | Compensation determination, deposit, possession | After 3D | Possession follows deposit |
| NHAI schedule | Optimum 336 days from start to mutation | Per policy steps | Escalation to headquarters (VERIFY primary circular) |

Model **each clock separately** (e.g. the 12-month declaration clock and the 2-year award clock are different). Each clock outputs: start event and date (with fact ID), deadline date, days remaining, status, and legal reference.

### Compensation calculator (exact, no ML)

Structure (VERIFY against the Act's First Schedule and each state's notified rules):

```
market value (Sec 26 basis: per state rules, including circle rate / sale-deed comparison)
  × multiplication factor (First Schedule, state-notified for rural areas)
  + value of assets attached to land / building
  + solatium 100% (Sec 30)
  = total compensation
```

Every input must be user-entered or SOURCED, with the formula version shown. If the state's notified factor or rate is unavailable, output ABSENT, not a guess.

---

## 7. Prediction layer

**Targets (start with what real data supports):**
- Days from Sec 11 → Sec 19 (RFCTLARR route)
- Days from 3A → 3D, and 3D → possession (NH route)
- Project-level delay months (IPMD)

**Method**
1. Kaplan–Meier survival curves per stratum (state, corridor type, statute route). Always show *n* and confidence intervals.
2. Fit Cox proportional hazards only when data per predictor supports it (rule of thumb: at least ~10 events per predictor; keep the number of predictors small).
3. **Abstention:** if the reference-set size *n* is below a configured minimum (tunable; start conservatively) or evidence coverage is below threshold, output `INSUFFICIENT_DATA` with the reason. Coverage = share of required fields that have confirmed provenance.
4. **Validation:** temporal split (train on earlier projects, test on later), concordance index, Brier score, calibration curve. Publish results on a "Model Governance" page, including when the model is *bad*.
5. **Explainability:** show the stratum definition, reference cases (linked), and the fields used. Do not label anything "SHAP" unless a SHAP-compatible model is actually shipped.

**Intervention Priority Index (IPI):** keep the four components, but define each from real fields.

| Component | Definition |
|---|---|
| Urgency | Days remaining on the nearest STATUTORY clock |
| Risk movement | Change in predicted delay probability since last run (only if not abstained) |
| Criticality | Project cost (from IPMD or tender documents), affected landowners and area (from 3A/3D), corridor priority |
| Actionability | From the playbook library (below) |

Weights are **policy parameters**: documented, configurable, and reviewed by a domain expert. They are not "learned" and must not be described as such.

**Playbook library:** each bottleneck maps to a legally valid action with statute reference, responsible role, and expected effect *only if backed by evidence*. Mark every playbook `DRAFT: pending expert review` until a serving officer or lawyer signs off.

---

## 8. Reconstructed case files (the real backtest set)

Goal: 10 to 20 real projects, fully reconstructed, as LUME's first genuine precedent base and its demo.

**Selection:** completed or well-documented projects with public notification dates, ideally across at least two states and both statutes, including at least some that were delayed and some that were not.

**Case file template**

```
project, agency, corridor, statute route, state/districts
timeline: [event, date, source URL, document hash]
delay reasons: [cause, source, quote-free paraphrase]
interventions taken (if documented): [action, source]
outcome: [final status, total days, source]
extraction notes + reviewer
```

**Backtest procedure:** for each case, replay the timeline to a chosen "as-of" date, run LUME using only information available then, and record whether the flagged bottleneck and horizon matched what happened. Report hits, misses, and abstentions honestly.

---

## 9. Modules: keep / change / add

| Module | Change | Acceptance criteria |
|---|---|---|
| **Portfolio Command Center** | Action queue driven by STATUTORY clocks + IPI; show abstentions distinctly; filters by agency, state, statute | Every row links to its clock inputs and sources; no row without provenance |
| **Project Intelligence Room** | Clock monitor per statute; evidence dossier with document viewer; executive review packet (printable) | Packet lists every fact with its source and date |
| **Scenario Lab** | Exact compensation calculator; evidence-based delay effects only | Any delay estimate shows its reference set and *n*, or "no evidence yet" |
| **Precedent Engine** | Search over real case files and CAG/judgment excerpts | Each precedent links to source; similarity criteria are visible |
| **Document Verification** | Real OCR pipeline with hash trail; extraction review UI | Reviewer can confirm, edit, or reject each extracted field |
| **Action Workflow (new)** | Assign playbook actions with owner, due date, escalation, outcome logging | Outcomes feed the case base |
| **Model Governance (new)** | Calibration, backtest, abstention rate, data freshness | Public within the app for every model version |
| **Data Import Wizard** | Keep (bring-your-own-data), require source metadata on import | Import rejected if source/provenance is missing |

---

## 10. Citizen layer (Jan-Seva)

- Bilingual (English/Hindi) now; architecture ready for regional languages (Kannada etc.).
- **Deterministic compensation explainer** using the Section 6 calculator. Parcel details are user-entered or sourced, never simulated.
- **Deadline and objection-window alerts** derived from real notification dates (STATUTORY clocks).
- **Grievance tracker**, with categories and status.
- **Channels:** SMS/WhatsApp/IVR in addition to the PWA, for low-connectivity areas.
- **Legal aid pathways:** point to District Legal Services Authorities and Lok Adalats.
- **Guardrails:** no ranking of villages or individuals; no delay predictions shown to citizens in a way that pressures them to settle; plain-language disclaimers that LUME is informational and not legal advice.
- **Data protection:** no Aadhaar or biometric data; use ULPIN and survey/Gut numbers; minimize and encrypt personal data; define retention.

---

## 11. Architecture, security, compliance

- Role-based access: DM, CALA, LAO, agency project director, analyst, citizen.
- Immutable audit log; encryption in transit and at rest; least-privilege API keys.
- Sanitization of all uploads (CSV formula-injection guard already exists; keep it) and malware scanning for documents.
- Accessibility: WCAG-aligned and GIGW guidelines for government sites. VERIFY current GIGW version.
- Privacy: design for the DPDP Act 2023 and its rules. VERIFY current rules status; get a review before claiming compliance.
- Observability: ingestion success/failure dashboards, freshness alerts per source.

---

## 12. Business model

**Customer segments**

| Segment | Pain | Willingness to pay | Sales motion |
|---|---|---|---|
| EPC contractors and concessionaires | Late land handover causes idle capital, claims, disputes | HYPOTHESIS: highest and fastest | Direct sales; pre-bid "land-readiness risk" reports |
| Lenders, InvITs, infra funds | Land availability is a credit and due-diligence risk | HYPOTHESIS: high | Per-project diligence reports, portfolio monitoring |
| NHAI/NHIDCL project units, state PWDs, industrial development corporations, rail/power utilities | Delay tracking, escalations, review meetings | Budget exists, slow procurement | Free pilots → licences, tenders, MoUs |
| District administrations | Collectorate review packets, citizen queries | Low direct budget | Pilot via state or agency sponsor |

**Revenue lines (HYPOTHESES to validate through customer interviews; do not invent price points):**
1. SaaS subscription per project or corridor.
2. Land-readiness audits and risk reports (consulting-plus-product).
3. Data and API licensing of the structured timeline dataset.
4. Custom integrations for large agencies.

**Go-to-market sequence:** free district/agency pilot → documented days-saved and lapses-avoided case study → private-sector land-readiness product (funds growth while government cycles run) → state-level rollouts.

**Moat:** proprietary structured timelines extracted from unstructured public documents; closed-loop intervention outcomes; embedded review workflows that raise switching costs.

**Success metrics:** days saved per milestone, statutory lapses avoided, time to compensation, objections resolved before hearing, forecast calibration error, data freshness, active officers per district.

---

## 13. Roadmap and acceptance criteria

*Prioritized against SIH judging order: problem fit → innovation → working prototype → technical depth → practicality → impact → presentation.*

### Phase 0: credibility reset (before the next demo)
- [ ] Remove mock data from the production path; add CI lint rule and the `<Fact>` provenance wrapper.
- [ ] Rewrite README and pitch claims per Section 3.
- [ ] Ship the deterministic clock engine (Section 6) and compensation calculator, each showing its legal reference.
- [ ] Build 5 to 10 reconstructed case files (Section 8) and a working replay/backtest view.
- [ ] Freshness badges, source links, and honest `INSUFFICIENT_DATA` states everywhere.
- **Done when:** every visible number can be traced to a source or a formula, and a reviewer can click through to prove it.

### Phase 1: real pipeline
- [ ] Backend, database, auth, audit log.
- [ ] Gazette fetch → OCR → field extraction → review queue.
- [ ] IPMD ingestion.
- [ ] Kaplan–Meier strata with *n*/CI; Model Governance page.
- **Done when:** new gazette notifications appear as reviewed events without manual data entry beyond review.

### Phase 2: pilot
- [ ] One district or agency pilot via MoU/RTI; playbook workflow with outcome logging.
- [ ] Expert review of playbooks.
- [ ] Citizen channels (SMS/WhatsApp) and regional language.
- **Done when:** at least one officer team runs a real review meeting from LUME's packet.

### Phase 3: commercialize
- [ ] Private-sector land-readiness product; pricing validated with customer interviews.
- [ ] Security/DPDP review; hosting compliance for government customers.

---

## 14. Risks and ethics guardrails

| Risk | Mitigation |
|---|---|
| Data access limited or terms restrict automated access | Prefer official downloads, RTI, MoUs; log terms review per source |
| Extraction errors from OCR/NLP | Confidence thresholds, human review queue, source-span display |
| Small sample sizes | Show *n* and intervals; abstain; never round up confidence |
| Misuse against landowners or officers | Advisory framing; system-level (not person-level) insights; no village/officer rankings |
| Legal inaccuracy | Expert legal review of the rule table and playbooks; version every rule with its source |
| Long government sales cycles | Private-sector revenue line; free pilots with measurable outcomes |
| Overclaiming | The Real-Data Contract and README checklist |

---

## 15. README corrections checklist

- [ ] Remove or substantiate: "4.2M precedent base", "28 states and 700+ districts", "SHAP-inspired", "calibrated" (until calibration results exist).
- [ ] Replace "Release v9.0 Production" with an honest maturity label.
- [ ] Separate the Sec 19(7) 12-month declaration lapse from the Sec 25 two-year award lapse in all diagrams and text.
- [ ] Reframe the footer for multi-statute, multi-sector use under the problem statement's ministry.
- [ ] Change "DPDP Act 2023 Compliant" to "designed for DPDP compliance" until reviewed.
- [ ] Add a "Data & Provenance" section describing the contract in Section 2.

---

## 16. Verification checklist (do before relying on any of the above)

- [ ] Bare Act text for RFCTLARR 2013 and NH Act 1956 (including current amendments) matches the rule table.
- [ ] State-notified multiplication factors and valuation rules for pilot states.
- [ ] NHAI primary circular for the acquisition timeline.
- [ ] Terms of use and robots.txt for e-Gazette, Bhoomi Rashi, PARIVESH, e-Courts, state land record portals.
- [ ] Latest MoSPI IPMD report figures (replace the February 2024 numbers).
- [ ] Current DPDP rules status and GIGW version.
- [ ] Hosting/empanelment requirements for government customers.

---

## 17. References (from research; re-check for currency)

- MoSPI IPMD report coverage (Feb 2024 figures): https://businessworld.in/index.php/article/over-rs-492-lakh-crore-cost-overrun-plagues-443-infrastructure-projects-mospi-report-515349
- IPMD mandate (projects ≥ ₹150 crore, OCMS-based): https://www.outlookbusiness.com/news/road-transport-and-highways-sector-has-maximum-number-of-delayed-projects-government-report-news-257641
- Bhoomi Rashi overview: https://vikaspedia.in/e-governance/online-citizen-services/government-to-citizen-services-g2c/business-related-services/bhoomi-rashi-portal
- NHAI time-bound acquisition schedule (secondary summary): https://foxmandal.in/News/nhai-publishes-timeline-to-streamlines-land-acquisition-activities/
- CAG audit example (Karnataka project, land acquisition delay): https://cag.gov.in/uploads/download_audit_report/2025/7.-Chapter-III---Project-Implementation-069c3d2da1a5d49.98550752.pdf