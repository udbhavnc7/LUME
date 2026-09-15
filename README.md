# LUME (Land-Acquisition Uncertainty Intervention-Management Engine)

<div align="center">

<img src="./public/logo-dark.png" alt="LUME Logo" width="280" />

### **Statutory Land Acquisition Foresight & Intervention Decision Engine**
*Turning government records into early bottleneck foresight, foresight into prioritized executive action, and completed acquisitions into institutional memory.*

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/udbhavnc7/LUME)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8_Strict-blue.svg?logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.4-646CFF.svg?logo=vite)](https://vitejs.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Offline_First-008080.svg?logo=pwa)](https://web.dev/progressive-web-apps/)
[![Status](https://img.shields.io/badge/Release-v9.0_Production-success.svg)](#)

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
- [Responsible AI & Data Protection](#-responsible-ai--data-protection)

---

## 🏛 Executive Overview

Major infrastructure corridors in India across highways (NHAI), railways, power transmission, and industrial corridors routinely experience costly multi-year delays during statutory land acquisition. 

Government departments record massive operational data across fragmented registries (**NGDRS, PARIVESH, LACRRIS, e-Courts/NJDG, PM GatiShakti, Bhoomi Rashi**). However, **recording the current status is fundamentally different from forecasting where the next statutory bottleneck will occur.**

**LUME** bridges this critical gap as an intelligent predictive decision layer that operates above existing systems:
1. **Forecasts the exact milestone bottleneck** (e.g., Sec 19 declaration, Sec 26 market valuation, Sec 38 compensation disbursement) with a calibrated delay horizon (30/60/90 days).
2. **Explains the drivers** using SHAP-inspired explainability across multi-source statutory evidence.
3. **Matches historical precedents** from identical districts, agro-climatic zones, and legal routes.
4. **Prioritizes executive interventions** via the **Intervention Priority Index (IPI)**.
5. **Protects affected citizens** through bilingual, low-bandwidth, multi-generational transparency (RFCTLARR Sec 10 multi-crop protection, compensation breakdowns, voice assistance).

---

## ⚠️ The Core Challenge

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      Traditional State of Affairs                       │
│                                                                         │
│  "Project NH-48 is in Stage: Section 26 Valuation"                     │
│  ✗ No lead warning that Section 19 12-month statutory clock is lapsing   │
│  ✗ Unknown 38% valuation gap between stamp rates & sale deed top-50%   │
│  ✗ Forest Stage-1 clearance pending 82 days with zero downstream alert  │
│  ✗ Result: Project enters Section 25 lapse; acquisition must restart!   │
└─────────────────────────────────────────────────────────────────────────┘
```

When projects slip past statutory deadlines (e.g., 12 months between Sec 11 preliminary notification and Sec 19 declaration under RFCTLARR 2013, or 336 days under NHAI guidelines), **the entire acquisition proceedings lapse by law**, causing billions in capital lock-up and prolonged dispute for landowners.

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
 │ Calibrated ML Engine │ (Statutory clock hazard models, 4.2M precedent base)
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

### 3. Counterfactual Scenario Lab
Enables administrators to test policy and operational interventions before committing administrative resources:
- *What if compensation is raised to 1.35× circle rate?*
- *What if Lok Adalat mediation resolves 60% of Section 15 objections?*
- *What if fast-track environment bench clears RoW diversion in 30 days?*
- Instant recalculation of delay probability, predicted milestone date, and fiscal impact.

### 4. Institutional Precedent Matching Engine
Queries historical cases across 28 states and 700+ districts with similarity scoring:
- Matches by terrain, corridor type, process route (RFCTLARR vs NH Act), and grievance pattern.
- Displays actual outcome, resolution lead time, and effective administrative orders used in the precedent.

### 5. Jan-Seva Citizen Transparency Portal
Designed for all citizens—including rural landowners, elders, and legal heirs:
- **Bilingual Interface**: Seamless 1-click toggle between English and Hindi (हिन्दी).
- **Visual Land Parcel Cards**: Clear breakdown of circle rate, market multiplier, solatium (100%), and R&R entitlement under First/Second Schedules.
- **Section 10 Multi-Crop Safeguard**: Satellite NDVI tracking alerts when multi-crop agricultural land threshold is approached.
- **Voice & Accessibility**: Integrated screen reader, font scaler, high-contrast modes, and audio narration.
- **Offline PWA**: Full offline caching via Workbox and IndexedDB for low-connectivity tehsil offices.

### 6. Model Governance, Calibration & Abstention
Unlike black-box models, LUME enforces **strict responsible AI principles**:
- **Explicit Abstention Protocol**: Automatically abstains from making predictions when evidence coverage is below threshold ($<65\%$), flagging "INSUFFICIENT_DATA" rather than hallucinating.
- **Temporal Split Validation**: Prevents data leakage by training only on pre-event snapshots and testing on post-event timelines.
- **Probability Clamping & Determinism**: All hazard scores runtime-clamped to $[0, 1]$ with deterministic fallbacks.

---

## ⚖️ Statutory & Legal Grounding

LUME is engineered around India's statutory land acquisition frameworks:

| Statute / Policy | Statutory Clocks & Provisions Monitored |
|---|---|
| **RFCTLARR Act 2013** | **Sec 4** (SIA appraisal), **Sec 11** (Preliminary notification), **Sec 15** (Objections hearing within 60 days), **Sec 19** (Declaration within 12 months), **Sec 26** (Market value determination), **Sec 30** (100% solatium), **Sec 38** (Compensation payment before possession) |
| **National Highways Act 1956** | **Sec 3A** (Intention notice), **Sec 3C** (Hearing of objections), **Sec 3D** (Declaration of acquisition within 1 year), **Sec 3G** (CALA valuation award), **Sec 3H** (Deposit and payment) |
| **NHAI April 2025 Standard** | 336-day accelerated corridor acquisition clock |
| **RFCTLARR Section 10** | Food security mandate: multi-crop irrigated land acquisition caps |

---

## 🛠 Technology Stack

```
Frontend Architecture       : React 18.3 • TypeScript 5.8 (Strict Mode)
Build Tool & Bundler        : Vite 6.4 (Custom Rollup Vendor Splitting)
Styling & Design System     : TailwindCSS v4 • Lucide React Icons
Data Visualization          : Recharts • HTML5 Canvas • SVG GIS overlays
Offline Engine & Storage    : Vite PWA Plugin (Workbox SW) • IndexedDB • localStorage
Security & Export           : DOMPurify • JSPDF • HTML2Canvas • Formula Sanitization
Deployment Runtime          : Render Static Site (Edge CDN) / Containerized Node
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
```

---

## 🌐 Production Deployment

### 1-Click Render Deployment
Click the badge below to deploy to Render as an edge-cached static site with automated HTTPS and PR previews:

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/udbhavnc7/LUME)

### Blueprint Specification ([render.yaml](file:///c:/Users/LENOVO/LUME/LUME/render.yaml))
LUME includes an infrastructure-as-code blueprint pre-configured with:
- **Build Command**: `npm run build`
- **Publish Directory**: `./dist`
- **SPA Rewrites**: `/*` $\rightarrow$ `/index.html`
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
│   │   ├── ScenarioLab.tsx     # Counterfactual simulation engine
│   │   ├── SplashScreen.tsx    # Animated executive loading sequence
│   │   ├── DataImportWizard.tsx# Hardened CSV/JSON dataset ingestion wizard
│   │   └── DocumentVerificationModule.tsx # OCR & document tamper auditor
│   ├── data/
│   │   ├── mockData.ts         # Statutory project baselines & citizen parcels
│   │   └── mockDataV7.ts       # Precedents, court records & tour sequences
│   ├── services/
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
│   └── main.tsx                # React entrypoint
├── DEPLOYMENT.md               # Detailed deployment & ops manual
├── render.yaml                 # Render Infrastructure-as-Code blueprint
├── tsconfig.json               # Strict TypeScript configuration
└── vite.config.ts              # Vite config with manual chunk splitting & PWA
```

---

## 🛡 Responsible AI & Data Protection

- **Human-in-the-Loop**: LUME is an advisory and foresight engine. It never makes autonomous legal, financial, or land takeover decisions.
- **Explainability First**: Every risk percentage is accompanied by contributing factors, evidence quality scores, and comparison with empirical baselines.
- **DPDP Act 2023 Compliant**: No Aadhaar or personal biometric citizen data is stored; parcel identifiers leverage statutory ULPIN and Gut numbers.
- **Formula Injection Guard**: All uploaded CSV/JSON datasets are sanitized against spreadsheet formula injection attacks (`=`, `+`, `-`, `@`, `\t`).

---

<div align="center">
  <sub>LUME — From records to foresight. From foresight to action.</sub><br/>
  <sub>Built for the Smart India Hackathon (SIH 2026) • Ministry of Road Transport & Highways / NHAI</sub>
</div>
