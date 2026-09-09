# LUME - Land-Acquisition Uncertainty Intervention-Management Engine

Land-Acquisition statutory offline portal and decision-support engine for CALA verification officers and revenue surveyors under RFCTLARR 2013 and NHAI Section 3.

## Development Setup

> **Note**: This application is strictly configured to run on port **8000**. Never run on port 3000.

### Installation

```bash
npm install
```

### Running Locally

```bash
npm run dev
```

The application will be accessible at:
- **Local**: `http://localhost:8000/`
- **Network**: `http://0.0.0.0:8000/`

### Build & Typecheck

```bash
# Typecheck
npm run lint

# Production Build
npm run build

# Preview Production Build (Port 8000)
npm run preview
```
