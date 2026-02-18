# Deploy StudyBuddy (App Runner) — Console-only, step-by-step

This document walks you through deploying the `server/` (backend) and `client/` (frontend) to AWS App Runner using the GitHub repository as the source. Follow each Console click/field precisely—no terminal required.

Prerequisites
- Your project is pushed to GitHub and contains `server/` and `client/` folders with `Dockerfile`s.
- You have an AWS account and Console access with permissions to create App Runner services and (optionally) ECR.
- Prepare the environment variable values you will enter in the Console (JWT secret, DB connection string, OpenAI key if used).

Overview
1. Create backend App Runner service from `server/` (first)
2. Copy backend Service URL
3. Create frontend App Runner service from `client/` and set `VITE_API_URL` to the backend Service URL
4. Verify both services and fix common failures

---

A. Push repo to GitHub (use GitHub website or Desktop)
- Confirm the repo contains these paths:
  - `server/Dockerfile`
  - `client/Dockerfile`
  - `server/src/index.js` (listens on `process.env.PORT || 4000`)
  - `server/src/app.js` (contains `/health` endpoint)
  - `client/src/api.js` (reads `import.meta.env.VITE_API_URL`)

B. Create Backend App Runner service (Console click-by-click)
1. AWS Console → Services → App Runner
2. Click **Create service**
3. Under **Source and deployment** → **Source code repository** → **GitHub** → Click **Connect** (authorize GitHub if prompted)
   - In the GitHub dialog, sign in to the account that owns the repo and grant the requested repo access.
4. Back in App Runner, choose:
   - Repository: `<your-username>/<your-repo>`
   - Branch: `main` (or your branch)
   - Repository root / Path: `server/`
5. **Build configuration**:
   - Runtime: **Dockerfile** (should be auto-detected)
   - Dockerfile path: `Dockerfile`
   - Build environment variables: *optional* (you can set `NODE_ENV=production` here)
6. Click **Next** → **Service settings**
   - Service name: `studybuddy-backend` (or choose your name)
   - Instance role: leave default (unless you need AWS permissions)
   - Port: `4000` (matches `server/Dockerfile` EXPOSE and local default)
   - Health check configuration:
     - Protocol: **HTTP**
     - Path: `/health`
     - Use default interval/timeouts
7. Runtime environment variables (scroll to Environment variables): add keys only — you will enter values here:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `OPENAI_API_KEY` (optional)
   - `CORS_ORIGIN` (set later to frontend origin)
   - `NODE_ENV` = `production`
8. Click **Next** → Review → **Create & deploy**
9. Monitor the build and deployment logs on the service page. Wait until **Service status: Running**.

Where to find backend URL
- Open the backend service page (App Runner → Services → `studybuddy-backend`). The **Service URL** is shown in the Overview panel (format: `https://<id>.awsapprunner.com`). Copy this URL.

C. Create Frontend App Runner service (Console click-by-click)
1. AWS Console → App Runner → Create service
2. **Source and deployment** → **Source code repository** → **GitHub** → select same repo/branch
   - Repository root / Path: `client/`
3. **Build configuration**:
   - Runtime: **Dockerfile**
   - Dockerfile path: `Dockerfile`
   - Build environment variables: **add** `VITE_API_URL` and set its value to the backend Service URL you copied (exact `https://...awsapprunner.com`)
     - Note: Vite inlines `VITE_` vars at build time; setting `VITE_API_URL` here ensures the built static files point to the deployed backend.
4. Click **Next** → **Service settings**
   - Service name: `studybuddy-frontend`
   - Port: `80` (nginx serves static files on port 80 in the Dockerfile)
   - Health check path: `/`
5. Runtime environment variables: typically none (Vite `VITE_` vars must be build-time)
6. Click **Next** → Review → **Create & deploy**
7. Wait until **Service status: Running**. Copy the frontend Service URL from the Overview panel.

D. Post-deploy verification (browser checks)
1. Backend quick check:
   - Visit `https://<backend-id>.awsapprunner.com/health` → should return HTTP 200 with `{"ok":true}`.
   - App Runner logs: App Runner → Services → `studybuddy-backend` → Logs; check for `Server running on port X` or Prisma startup messages.
2. Frontend checks:
   - Visit frontend Service URL → UI should load (not blank).
   - Open DevTools Network tab → trigger an API action (login, create task) → confirm requests go to the backend Service URL and return expected responses.

E. Exact environment variable names (keys only)
- Backend runtime (add these in App Runner backend service envs):
  - `DATABASE_URL`
  - `JWT_SECRET`
  - `OPENAI_API_KEY`
  - `CORS_ORIGIN`
  - `NODE_ENV`
- Frontend build-time (add this in App Runner frontend build config):
  - `VITE_API_URL`

F. Common failure causes and fixes (student-friendly)
- Port mismatch / Health check fails:
  - Cause: App Runner health check targets a different port than container listens.
  - Fix: Ensure `server` binds to `process.env.PORT || 4000`. In App Runner service settings set Port to `4000` (to match container). Use `/health` path that returns 200.
- CORS errors in browser:
  - Cause: backend not allowing frontend origin.
  - Fix: Set backend `CORS_ORIGIN` to the frontend Service URL (exact origin) in backend App Runner envs and redeploy backend.
- Frontend still calls old API URL:
  - Cause: Vite inlines `VITE_` envs at build-time; runtime changes don't update built JS.
  - Fix: Update `VITE_API_URL` in frontend App Runner build settings and redeploy frontend.
- Prisma / DB errors during startup:
  - Cause: `DATABASE_URL` incorrect or DB unreachable (RDS in VPC not accessible).
  - Fix: If using RDS, configure App Runner VPC connector and ensure security groups allow connections; confirm `DATABASE_URL` credentials.

G. Debugging checklist if UI is blank
1. Open browser DevTools Console → look for JS errors or missing files.
2. Network tab → ensure `index.html` and JS bundles return 200.
3. Search bundles for `VITE_API_URL` to confirm the inlined backend URL. If wrong, rebuild frontend with correct `VITE_API_URL`.
4. Check App Runner frontend logs for build/runtime errors.

H. Notes about SQLite
- SQLite is file-based and App Runner instances have ephemeral storage. Do not use SQLite for production; instead use a managed DB and set `DATABASE_URL` accordingly (Postgres/RDS). If you leave SQLite in `DATABASE_URL`, understand data will not persist across redeploys or scaling.

I. If you want automation (one-click on push)
- The repo includes a GitHub Actions workflow `.github/workflows/deploy-app-runner.yml` that can build/push images to ECR and create App Runner services when you push to `main`.
- To enable it, add GitHub secrets (in repo Settings → Secrets) for `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and optionally `BACKEND_URL` for the first frontend build.

---

If you want, I can now:
- add a short visual checklist file to paste into your AWS Console notes, or
- update the GitHub Actions workflow to automatically fetch the backend App Runner URL and trigger a frontend rebuild.

Which would you like? (visual checklist or automatic backend-to-frontend wiring)