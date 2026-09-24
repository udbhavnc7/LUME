# LUME Production Deployment Guide

## 1. System Overview
**LUME (Land Utility & Monitoring Engine)** is a statutory land acquisition risk monitoring and intelligence platform designed for major infrastructure projects under the **RFCTLARR Act 2013** and **National Highways Act 1956**.

LUME is architected as a static-exported Next.js application with a client-side command center, PWA capabilities, service-worker precaching, and IndexedDB persistence.

---

## 2. Deployment Architecture

### Target Platform: Render Static Site (Recommended)
Because LUME runs as a static Next.js export with self-contained deterministic ML inference engines and IndexedDB storage, deploying as a **Render Static Site** provides:
- Instant CDN distribution across global edges
- Zero server management overhead
- Automatic HTTPS with Let's Encrypt certificates
- Automatic branch previews and atomic rollbacks

```
┌─────────────────┐       ┌─────────────────┐       ┌───────────────────┐
│ Git Repository  ├──────►│  Render Build   ├──────►│ Render Global CDN │
│ (GitHub/GitLab) │       │ `npm run build` │       │ `out/` directory  │
└─────────────────┘       └─────────────────┘       └───────────────────┘
```

---

## 3. Render Deployment Setup (Step-by-Step)

### Option A: Via Render Dashboard (Static Site)
1. **Log in** to [Render Dashboard](https://dashboard.render.com/).
2. Click **New +** and select **Static Site**.
3. Connect your Git repository (`udbhavnc7/LUME`).
4. Fill in the following build parameters:
   - **Name**: `lume` (or your preferred slug)
   - **Branch**: `main`
   - **Root Directory**: Leave blank (root of repository)
   - **Build Command**: `npm run build`
   - **Publish Directory**: `out`
5. Click **Create Static Site**.
6. Render will automatically build the site and deploy to a `*.onrender.com` subdomain.

### Option B: Render Web Service (Node.js Server)
If your deployment requirements dictate a Node.js container with an active HTTP listener:
- **Environment**: `Node`
- **Build Command**: `npm run build`
   - **Start Command**: `npm start` (runs `npx serve -s out -l $PORT`)
- **Port**: Render automatically provisions `$PORT`.

---

## 4. Environment Variables

Configure these in the Render Dashboard under **Environment**:

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_VERSION` | Recommended | `20.x` or `22.x` | Node runtime version for build |
| `VITE_APP_MODE` | Optional | `production` | Deployment mode flag |
| `VITE_APP_VERSION` | Optional | `1.0.0` | Build release identifier |
| `PORT` | Optional | `3000` | Port for preview / serve mode |

---

## 5. Build & Validation Commands

Run these locally before pushing to production:

```bash
# 1. Strict TypeScript compilation check (zero error tolerance)
npm run typecheck
# or
npx tsc --noEmit

# 2. Production Next static export
 npm run build

 # 3. Local preview test of production out directory
 npm run preview
```

---

## 6. Single-Page Application (SPA) Routing & Rewrite Rules

In static hosting environments, all client-side paths must route to `index.html`.

### Render Redirect / Rewrite Rules
In Render dashboard: **Settings > Redirects/Rewrites**:
- **Source**: `/*`
- **Destination**: `/index.html`
- **Action**: `Rewrite`

---

## 7. Security Headers Configuration

For production deployments, enforce the following HTTP headers via your CDN or host:

| Header | Recommended Value | Purpose |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | Prevents MIME type sniffing |
| `X-Frame-Options` | `SAMEORIGIN` | Mitigates clickjacking attacks |
| `X-XSS-Protection` | `1; mode=block` | Cross-site scripting filter |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Protects referral metadata |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(self)` | Restricts browser device access |

---

## 8. Rollback & Disaster Recovery

1. **Instant Rollback**: In Render Dashboard, open the **Deploys** tab, select the previous stable deploy commit, and click **Rollback**.
2. **Cache Clearance**: If clients hold stale PWA service worker caches, bumping `VITE_APP_VERSION` in the new deploy triggers the service worker update prompt.
3. **Data Protection**: Local user settings and decision logs in IndexedDB/localStorage remain intact across site updates.

---

## 9. Troubleshooting

| Issue | Root Cause | Resolution |
|---|---|---|
| Build fails on `tsc` | Strict mode typing violation | Run `npx tsc --noEmit` locally to locate and fix diagnostic errors. |
| 404 on page refresh | Missing SPA rewrite rule | Add Rewrite rule in Render: `/*` -> `/index.html`. |
| PWA not updating | Service worker active cache | Reload browser with Shift+F5 or use the "Update Available" notification bar in LUME. |
