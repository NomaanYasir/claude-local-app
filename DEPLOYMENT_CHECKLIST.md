# Deployment Checklist — GitHub Actions → AWS App Runner (no terminal)

Follow these exact, console-only steps. Do not run terminal commands.

PREP: confirm you have an AWS account and a GitHub account, and you can sign in to both.

1) Commit & push code using VS Code (no terminal)
- Open VS Code Source Control (left sidebar icon with branches).
- Review changes under "Changes".
- Enter a commit message in the message box (example: "Prepare App Runner deployment") and click the checkmark ✓ to commit.
- Click the "..." menu in the Source Control panel and choose "Push" (or click the sync icon in the status bar) to push to `origin/main`.

2) Add GitHub repository secrets (exact names)
- Open GitHub → your repository → Settings → Secrets and variables → Actions → New repository secret.
- Add the following secrets (exact names):
  - `AWS_ACCESS_KEY_ID`
  - `AWS_SECRET_ACCESS_KEY`
  - `AWS_REGION` (example: `us-east-1`)
  - `DATABASE_URL` (production DB connection string; if using SQLite for demo, note it's ephemeral)
  - `JWT_SECRET`
  - `OPENAI_API_KEY` (optional)
  - `CORS_ORIGIN` (optional; frontend origin like `https://<frontend-id>.awsapprunner.com` — can be updated post-deploy)

3) Watch the GitHub Actions workflow run
- After you push to `main`, open GitHub → Actions → click the workflow named **Build and Deploy to AWS App Runner via ECR**.
- Click the latest run and watch steps and logs. The workflow does:
  - build and push `server` image to ECR
  - create/update backend App Runner service (studybuddy-backend) and set runtime envs from the secrets you added
  - wait until backend is RUNNING and read its Service URL
  - build and push `client` image with `VITE_API_URL` set to the backend URL
  - create/update frontend App Runner service (studybuddy-frontend)
- Look for a step output or final log showing **Backend URL** and **Frontend URL**.

4) Verify App Runner services in AWS Console
- Open AWS Console → App Runner → Services.
- You should see two services: `studybuddy-backend` and `studybuddy-frontend`.
- Click each service → Overview panel → copy the **Service URL** (format: `https://<id>.awsapprunner.com`).

5) Exact App Runner settings (if you need to view or manually edit)
- Backend service (the workflow creates this):
  - Port: 4000
  - Health check path: `/health`
  - Runtime environment variables (entered via workflow using your GitHub secrets):
    - `DATABASE_URL`
    - `JWT_SECRET`
    - `OPENAI_API_KEY`
    - `CORS_ORIGIN`
    - `NODE_ENV` = `production`
- Frontend service (the workflow creates this):
  - Port: 80
  - Health check path: `/`
  - Build-time variable (inserted into built image by the workflow):
    - `VITE_API_URL` = `https://<backend-id>.awsapprunner.com` (the workflow sets this automatically)

6) Health check recommendations
- Backend: `/health` (returns HTTP 200). Confirm in browser: `https://<backend-id>.awsapprunner.com/health` should return 200.
- Frontend: `/` (root). Open frontend Service URL in browser to load the UI.

7) How to debug common failures (quick links)
- GitHub Actions step failed: click the failing step → open logs → read error lines.
- App Runner build or start failed: App Runner Console → Service → Logs → check build & service logs.
- CORS errors: set `CORS_ORIGIN` secret to the frontend Service URL and re-run workflow (push a dummy commit to trigger workflow). For quick test you may set `CORS_ORIGIN` = `*` (not for production).
- Frontend still points to old backend: rebuild frontend (push any non-code change or re-run workflow) — Vite inlines `VITE_API_URL` at build time.

8) Important notes
- SQLite is ephemeral inside App Runner; use `DATABASE_URL` pointing to a managed DB (RDS) for persistence.
- Do not commit secrets or `.env` to git; `.gitignore` excludes `.env`.
- The workflow uses these service names (do not rename unless you update the workflow): `studybuddy-backend`, `studybuddy-frontend`.

---

NEXT STEPS (click order)
1. Commit changes in VS Code Source Control and Push to `main`.
2. Add GitHub Secrets listed above (Settings → Secrets → Actions).
3. Open GitHub Actions and watch the **Build and Deploy to AWS App Runner via ECR** workflow run.
4. After workflow completes, open AWS Console → App Runner → Services and copy the Service URLs.
5. If needed, update `CORS_ORIGIN` secret to the frontend URL and push to trigger a redeploy.

Files changed by the automation in this repo (these are the files I created/updated):
- server/src/app.js — added `/health` endpoint
- server/Dockerfile — adjusted to install full deps so Prisma CLI is available
- server/.dockerignore — included migrations by removing `prisma/migrations` from ignore
- client/src/api.js — removed hardcoded localhost fallback; uses `import.meta.env.VITE_API_URL` or `window.location.origin`
- .github/workflows/deploy-app-runner.yml — GitHub Actions workflow to build/push images and create/update App Runner services
- README_DEPLOY_APP_RUNNER.md — App Runner Console step-by-step guide
- README_DEPLOY_APP_RUNNER_AUTOMATION.md — notes about the automation and required secrets
- DEPLOYMENT_CHECKLIST.md — this file (created just now)

If you want, I can also:
- add a small GitHub Actions “manual_dispatch” workflow step to let you re-run the deployment from the Actions UI without pushing, or
- add a short VS Code-friendly screenshot-free visual checklist file.

Ready — follow the NEXT STEPS above and tell me if any workflow run errors appear; paste the failing step logs and I will fix them.**