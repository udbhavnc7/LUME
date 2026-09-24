# LUME (Land-Acquisition Uncertainty Intervention-Management Engine)

<div align="center">

<img src="./public/logo-dark.png" alt="LUME Logo" width="280" />

### **Statutory Land Acquisition Foresight & Intervention Decision Engine**
*Turning government records into early bottleneck foresight, foresight into prioritized executive action, and completed acquisitions into institutional memory.*

[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb.svg?logo=react)](https://reactjs.org/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg?logo=next.js)](https://nextjs.org/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-008080.svg?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Status](https://img.shields.io/badge/Status-Pilot_ready_prototype-yellow.svg)](#)

</div>

---

## 📌 Table of Contents
- [Executive Overview](#-executive-overview)
- [The Core Challenge](#-the-core-challenge)
- [The LUME Solution](#-the-lume-solution)
- [System Architecture](#-system-architecture)
- [Key Innovations & Modules](#-key-innovations--modules)
  - [1. Portfolio Command Center & IPI Scorer](#1-portfolio-command-center--intervention-priority-index-ipi)
  - [2. Project Intelligence Room](#2-project-intelligence-room)
  - [3. Counterfactual Scenario Lab](#3-counterfactual-scenario-lab)
  - [4. Institutional Precedent Matching Engine](#4-institutional-precedent-matching-engine)
  - [5. Jan-Seva Citizen Transparency Portal](#5-jan-seva-citizen-transparency-portal)
  - [6. Model Governance, Calibration & Abstention](#6-model-governance-calibration--abstention)
- [Statutory & Legal Grounding](#-statutory--legal-grounding)
- [Technology Stack](#-technology-stack)
- [Quick Start & Local Setup](#-quick-start--local-setup)
- [Production Deployment](#-production-deployment)
- [Project Directory Structure](#-project-directory-structure)
- [Data & Provenance](#-data--provenance)
- [Responsible AI & Data Protection](#-responsible-ai--data-protection)

---

## 🏛 Executive Overview

Major infrastructure corridors in India across highways (NHAI), railways, power transmission, and industrial corridors routinely experience costly multi-year delays during statutory land acquisition. 

Government departments record massive operational data across fragmented registries (**NGDRS, PARIVESH, LACRRIS, e-Courts/NJDG, PM GatiShakti, Bhoomi Rashi**). However, **recording the current status is fundamentally different from forecasting where the next statutory bottleneck will occur.**

**LUME** bridges this critical gap as an intelligent predictive decision layer that operates above existing systems:
1. **Forecasts the next milestone bottleneck** (e.g., Sec 19 declaration, Sec 26 market valuation, Sec 38 compensation disbursement) with delay horizons (30/60/90 days) and explicit abstention when evidence is insufficient.
2. **Explains the drivers** using evidence-based explainability across multi-source statutory evidence.
3. **Matches historical precedents** from reconstructed case files across districts, agro-climatic zones, and legal routes.
4. **Prioritizes executive interventions** via the **Intervention Priority Index (IPI)**.
5. **Protects affected citizens** through bilingual, low-bandwidth transparency (RFCTLARR Sec 10 multi-crop protection, compensation breakdowns, voice assistance).

---

## ⚠️ The Core Challenge

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Traditional State of Affairs                       │
│                                                                         │
│  "Project NH-48 is in Stage: Section 26 Valuation"                     │
│  ✗ No lead warning that Section 19 12-month declaration clock is lapsing│
│  ✗ No lead warning that Section 25 2-year award clock is lapsing        │
│  ✗ Valuation gap between stamp rates & sale deeds not surfaced         │
│  ✗ Forest clearance delays with no downstream alert                     │
│  ✗ Result: statutory lapse risk; acquisition must restart!              │
└─────────────────────────────────────────────────────────────────────────┘
```

When projects slip past statutory deadlines, proceedings lapse by law and cause capital lock-up and prolonged dispute for landowners. The key RFCTLARR clocks are separate and must not be conflated:

- **Sec 19(7) declaration clock:** the Sec 19 declaration must be made within **12 months** of the Sec 11 preliminary notification, or that notification lapses.
- **Sec 25 award clock:** the award must be made within **2 years** of the Sec 19 declaration, or the proceedings lapse.

The NH Act 1956 route has its own clocks (Sec 3D declaration within 1 year of Sec 3A publication). Separately, NHAI maintains a **336-day time-bound acquisition schedule** as a policy benchmark (primary circular pending verification) — it is not a statutory lapse provision.

---

## 💡 The LUME Solution

LUME converts passive reporting into **proactive decision velocity**:

```
 ┌──────────────────────┐
 │ Multi-Tier Data Feeds│ (NGDRS, PARIVESH, LACRRIS, e-Courts, Sentinel-2)
 └──────────┬───────────┘
            │
            ▼
┌──────────────────────┐
│ Rules & Evidence     │ (Deterministic statutory clocks + models with n, intervals)
└──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │     Explainability   │ (Top risk drivers: valuation gap, environmental stay, etc.)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │  IPI Prioritization  │ (Urgency × Criticality × Actionability × Evidence Quality)
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │ Concrete Executive   │ (CALA review, registrar deed harmonisation, lok adalat)
 │     Intervention     │
 └──────────┬───────────┘
            │
            ▼
 ┌──────────────────────┐
 │  Institutional Loop  │ (Decisions logged to IndexedDB, training future models)
 └──────────────────────┘
```

---

## ⚡ Key Innovations & Modules

### 1. Portfolio Command Center & Intervention Priority Index (IPI)
Rather than alphabetized project lists, LUME computes a dynamically ranked **Action Queue** driven by the rigorous **IPI Formula**:

$$\text{IPI} = w_1 \cdot \text{RiskMovement} + w_2 \cdot \text{Urgency} + w_3 \cdot \text{Criticality} + w_4 \cdot \text{Actionability}$$

- **Urgency**: Proximity to statutory deadline (e.g., $d \le 60$ days to Sec 19 lapse).
- **Criticality**: Project capital exposure (Cr), corridor strategic weight, affected families.
- **Actionability**: Feasibility of administrative intervention (e.g., intra-district CALA order vs Supreme Court stay).
- **Evidence Weighting**: Green (fully verified), Amber (partial registry sync), Red (stale data).
- **Full Directory Access**: Immediate one-click entry into any project workspace with live search and filter.

### 2. Project Intelligence Room
A dedicated deep-dive command center for District Magistrates, Land Acquisition Officers, and NHAI CALAs:
- **Statutory Clock Monitor**: Visualizes elapsed days against statutory maximums with hazard thresholds.
- **Evidence Integrity Dossier**: Cross-registry telemetry check (land mutation, deed variance, clearance tokens).
- **Executive Review Packet**: 1-click generation of PDF/printable briefs for collectorate meetings.
- **Document Verification Module**: Document OCR audit with SHA-256 tamper checks, anomaly tagging, and digital verification trails.

### 3. Scenario Lab
Enables administrators to test operational interventions with exact, statutory math:
- **Compensation calculator**: exact computation from sourced market value, state-notified multiplication factor, asset value, and 100% solatium (Sec 30) — no estimated multipliers; outputs ABSENT when a notified factor or rate is unavailable.
- **Delay effects**: drawn only from historical evidence with reference set and *n* shown, otherwise "no evidence yet".
- **Objection and clearance scenarios**: outcomes shown only when backed by documented precedent.

### 4. Institutional Precedent Matching Engine
Backtest and precedent search over **reconstructed case files** (registry starts empty until primary-source reconstruction; count is live from the registry):
- Each case file requires source URL and SHA-256 per timeline event.
- Displays outcome, duration, and interventions only when SOURCED.

### 5. Jan-Seva Citizen Transparency Portal
Designed for all citizens—including rural landowners, elders, and legal heirs:
- **Bilingual Interface**: Seamless 1-click toggle between English and Hindi (हिन्दी).
- **Visual Land Parcel Cards**: Clear breakdown of circle rate, market multiplier, solatium (100%), and R&R entitlement under First/Second Schedules.
- **Section 10 Multi-Crop Safeguard**: Satellite NDVI screening to flag candidate multi-crop areas for review — never a legal determination of multi-crop status.
- **Voice & Accessibility**: Integrated screen reader, font scaler, high-contrast modes, and audio narration.
- **Offline PWA**: Full offline caching via Workbox and IndexedDB for low-connectivity tehsil offices.

### 6. Model Governance, Calibration & Abstention
Unlike black-box models, LUME enforces **strict responsible AI principles**:
- **Explicit Abstention Protocol**: Automatically abstains from making predictions when evidence coverage is below a configured threshold, flagging "INSUFFICIENT_DATA" rather than hallucinating.
- **Temporal Split Validation**: Prevents data leakage by training only on pre-event snapshots and testing on post-event timelines.
- **Probability Clamping & Determinism**: All hazard scores runtime-clamped to $[0, 1]$ with deterministic fallbacks.

---

## ⚖️ Statutory & Legal Grounding

LUME is engineered around India's statutory land acquisition frameworks:

| Statute / Policy | Statutory Clocks & Provisions Monitored |
|---|---|
| **RFCTLARR Act 2013** | **Sec 4** (SIA appraisal), **Sec 11** (Preliminary notification), **Sec 15** (Objections hearing within 60 days of Sec 11), **Sec 19(7)** (Declaration within 12 months of Sec 11 — preliminary notification lapses if missed), **Sec 25** (Award within 2 years of Sec 19 — proceedings lapse if missed; separate clock from Sec 19), **Sec 26** (Market value determination), **Sec 30** (100% solatium), **Sec 38** (Compensation payment before possession) |
| **National Highways Act 1956** | **Sec 3A** (Intention notice), **Sec 3C** (Hearing of objections), **Sec 3D** (Declaration of acquisition within 1 year of 3A), **Sec 3G** (CALA valuation award), **Sec 3H** (Deposit and payment) |
| **NHAI time-bound acquisition schedule** | 336-day policy benchmark for corridor acquisition (not a statutory lapse provision; primary circular pending verification) |
| **RFCTLARR Section 10** | Food security mandate: multi-crop irrigated land acquisition restrictions |

---

## 🛠 Technology Stack

```
Frontend Architecture       : Next.js App Router • React 19 • TypeScript 5.8 (Strict Mode)
Build & Export              : Next static export (`out/`) • Vite retained as legacy local fallback
Styling & Design System     : Native CSS design system • Tailwind compatibility layer • Lucide React Icons
3D Visualization            : Three.js signal field • Recharts • HTML5 Canvas • SVG GIS overlays
Offline Engine & Storage    : PWA service worker • IndexedDB • localStorage
Security & Export           : DOMPurify • JSPDF • HTML2Canvas • Formula Sanitization
Deployment Runtime          : Render Static Site (Edge CDN) / Static Node host
```

---

## 🚀 Quick Start & Local Setup

### Prerequisites
- Node.js `20.x` or `22.x`
- npm `10.x`+

### Installation & Execution
```bash
# 1. Clone repository
git clone https://github.com/udbhavnc7/LUME.git
cd LUME

# 2. Install dependencies
npm install

# 3. Typecheck (Strict TypeScript verification)
npm run typecheck

# 4. Start local development server
npm run dev
# Running on http://localhost:3000 (or custom port)

# 5. Build production bundle
npm run build

# 6. Preview production build locally
npm run preview -- --port 3005
# Access live production preview at http://localhost:3005

# 7. Phase 1 API (optional): PostGIS + FastAPI
docker compose up -d
# API health: http://localhost:8000/health
```

---

## 🌐 Production Deployment

### Live site (GitHub Pages)
**https://udbhavnc7.github.io/LUME/**

Deploys automatically on every push to `main` via `.github/workflows/pages.yml`
(`next build` with `NEXT_PUBLIC_BASE_PATH=/LUME`, then `actions/deploy-pages`).
Pages must stay enabled with source **GitHub Actions**
(https://github.com/udbhavnc7/LUME/settings/pages).

### 1-Click Render Deployment
Click the badge below to deploy to Render as an edge-cached static site with automated HTTPS and PR previews:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/udbhavnc7/LUME)

### Blueprint Specification ([render.yaml](./render.yaml))
LUME includes an infrastructure-as-code blueprint pre-configured with:
- **Build Command**: `npm run build`
- **Publish Directory**: `./out`
- **Static Export**: `output: 'export'` in `next.config.mjs`
- **Security Headers**: `X-Frame-Options: SAMEORIGIN`, `X-Content-Type-Options: nosniff`

---

## 📂 Project Directory Structure

```
LUME/
├── public/                     # Static assets, PWA icons, official LUME logos
│   ├── logo-dark.png           # Transparent crisp white logo (dark mode)
│   ├── logo-light.png          # Transparent dark slate logo (light mode)
│   ├── logo.png                # Master source logo asset
│   └── manifest.webmanifest   # PWA manifest
├── src/
│   ├── assets/                 # Processed image assets
│   ├── components/             # Reusable UI modules
│   │   ├── Header.tsx          # Persona switcher, theme toggle, brand header
│   │   ├── PortfolioCommandCenter.tsx # IPI action queue & all projects directory
│   │   ├── ProjectIntelligenceRoom.tsx# Detailed statutory project workspace
│   │   ├── GISIntelligenceView.tsx    # Spatial corridor intelligence & land mapping
│   │   ├── CitizenTransparencyPortal.tsx # Bilingual citizen Jan-Seva portal
│   │   ├── CaseFileBacktestView.tsx   # Reconstructed case-file backtest (empty until SOURCED)
│   │   ├── ActionWorkflow.tsx         # Playbook actions (DRAFT pending expert review)
│   │   ├── FreshnessBadge.tsx         # Per-screen data freshness / source link
│   │   ├── SplashScreen.tsx    # Animated executive loading sequence
│   │   ├── DataImportWizard.tsx# Hardened CSV/JSON dataset ingestion wizard
│   │   └── DocumentVerificationModule.tsx # OCR & document tamper auditor
│   ├── data/
│   │   ├── seedData.ts         # Demo seed baselines (DEMO mode only)
│   │   └── demoData.ts         # Re-exports seed data for DEMO mode
│   ├── services/
│   │   ├── statutoryClockEngine.ts    # Deterministic clocks (empty verified registry)
│   │   ├── compensationCalculator.ts  # Exact formula (empty verified registry)
│   │   ├── caseFileService.ts         # Case-file schema + empty registry
│   │   ├── survivalService.ts         # Kaplan–Meier with n-threshold abstention
│   │   ├── dataPipeline.ts     # IPI computation, data passports, health metrics
│   │   ├── actionQueueV8.ts    # Evidence-weighted queue sorting & explanations
│   │   ├── datasetService.ts   # Sanitized CSV parser & schema normalizer
│   │   └── modelEvaluationService.ts # Calibration curves, abstention & temporal split
│   ├── utils/
│   │   ├── indexedDBStorage.ts # Persistent client-side data store
│   │   └── offlineStatutoryCache.ts # Local statutory cache helpers
│   ├── types.ts                # Strict domain types & interfaces
│   ├── App.tsx                 # Main application controller & state machine
│   ├── index.css               # GovTech design system, theme contrast & tokens
│   └── main.tsx                # React entrypoint (legacy Vite entry)
├── server/                     # Phase 1 FastAPI + PostgreSQL scaffold
│   ├── app/main.py             # Auth, facts, predictions (fail-closed), audit
│   ├── schema.sql              # sources/documents/facts/events/predictions/actions/audit_log
│   └── requirements.txt
├── docker-compose.yml          # PostGIS + API local stack
├── COMPLIANCE.md               # Honest maturity / DPDP / security status
├── DEPLOYMENT.md               # Detailed deployment & ops manual
├── render.yaml                 # Render Infrastructure-as-Code blueprint
└── tsconfig.json               # Strict TypeScript configuration
```

---

## 🔍 Data & Provenance

Every value shown in LUME is exactly one of **SOURCED**, **COMPUTED**, or **ABSENT** (the Real-Data Contract):

| Class | Meaning | Required metadata |
|---|---|---|
| **SOURCED** | Extracted or copied from a real document or dataset | source, URL, fetched-at, SHA-256 of the document, extraction method, confidence |
| **COMPUTED** | Deterministic or statistical output derived from SOURCED inputs | list of input fact IDs, formula/model version, sample size where statistical |
| **ABSENT** | Not available | the UI shows an explicit empty or "insufficient data" state |

Enforcement:

- **CI lint rule** fails the build if `src/` imports `faker`, uses `Math.random()` for displayed values (ID generation exempt), or imports any file matching `*mock*`.
- **Runtime rule**: UI components render facts via a `<Fact>` wrapper; a fact without confirmed provenance renders as **ABSENT**.
- **Freshness badge** ("Data as of…" or "Freshness ABSENT") appears on the main shell; Fact rows add source links when provenance is confirmed.
- LLMs may be used to *extract* fields from real documents, but each extracted field carries the source document, the exact source span, and a confidence. Low-confidence extractions go to a human-review queue and are not displayed as facts until confirmed.
- Test fixtures live only under `/tests/`, are derived from real documents, and are never imported by production code.

Statutory clocks (Section 6 rule table) are computed deterministically and labeled **STATUTORY**, kept separate from probabilistic outputs. Sec 19(7) 12-month and Sec 25 2-year clocks are modeled as separate rules. Every rule row is verified against the bare Act before it is added to the production registry (currently empty → UI shows `ABSENT / RULE_NOT_VERIFIED`).

---

## 🛡 Responsible AI & Data Protection

- **Human-in-the-Loop**: LUME is an advisory and foresight engine. It never makes autonomous legal, financial, or land takeover decisions.
- **Explainability First**: Risk outputs ship only with contributing factors, evidence quality, and reference-set size — or abstain as `INSUFFICIENT_DATA`.
- **DPDP Act 2023**: Designed for DPDP compliance; review pending (see [COMPLIANCE.md](./COMPLIANCE.md)). No Aadhaar or personal biometric citizen data is stored; parcel identifiers use ULPIN / survey numbers.
- **Formula Injection Guard**: All uploaded CSV/JSON datasets are sanitized against spreadsheet formula injection attacks (`=`, `+`, `-`, `@`, `\t`).

---

<div align="center">
  <sub>LUME — From records to foresight. From foresight to action.</sub><br/>
  <sub>Built for the Smart India Hackathon (SIH 2026) • Ministry of Rural Development problem statement — covering both RFCTLARR Act 2013 and NH Act 1956, multi-sector (highways, railways, power, industrial corridors)</sub>
</div>
