# Automated App Runner deployment via GitHub Actions

This file explains how the included GitHub Actions workflow (`.github/workflows/deploy-app-runner.yml`) automates building Docker images, pushing to ECR, and creating/updating AWS App Runner services for `server/` and `client/`.

IMPORTANT: I cannot run GitHub or AWS operations from here — this workflow automates the deployment when you push to GitHub and configure a few required secrets in the repository settings.

## What the workflow does
- On push to `main`, it:
  - Configures AWS credentials from GitHub secrets
  - Builds and pushes `server` and `client` Docker images to ECR
  - Creates or updates two App Runner services (`studybuddy-backend` and `studybuddy-frontend`) using those ECR images

## Required GitHub repository secrets
Add these in your GitHub repo Settings → Secrets and variables → Actions → New repository secret.
- `AWS_ACCESS_KEY_ID` — IAM user access key with permissions: `ecr:*`, `apprunner:*`, `iam:PassRole` (if required), `sts:AssumeRole`, `logs:*`.
- `AWS_SECRET_ACCESS_KEY` — corresponding secret key.
- `AWS_REGION` — e.g., `us-east-1`.
- `BACKEND_URL` — (temporary) if you want the client image to be built with the backend URL; this is used for the first client build. After services exist you can update the workflow to fetch the backend URL.

Optional secrets you may want to provide (or configure as App Runner runtime envs manually later):
- `JWT_SECRET`
- `OPENAI_API_KEY`
- `DATABASE_URL` (prefer using RDS URL for production)

## How to use
1. Push your repo to GitHub (branch `main`).
2. Add the required GitHub secrets listed above.
3. The workflow will run on push to `main` and attempt to create ECR repos and App Runner services.
4. Open AWS Console → App Runner → Services to view `studybuddy-backend` and `studybuddy-frontend`. The **Service URL** is shown on each service's Overview page.

## Important notes & next steps
- The workflow uses the GitHub-provided AWS credentials. Ensure the IAM user has adequate permissions.
- The workflow expects the `server/Dockerfile` and `client/Dockerfile` to exist in the repository.
- The workflow currently uses a `BACKEND_URL` secret for the first `client` build so the client can be built with a correct `VITE_API_URL`. After the backend is available you can set `BACKEND_URL` or update the workflow to query App Runner for the backend URL and then rebuild the client.
- For production, prefer storing secrets (JWT secret, API keys, DB credentials) in AWS Secrets Manager and reference them securely.
- The workflow creates App Runner services from ECR image URIs. It does not yet configure VPC connectors, autoscaling policies, or custom domains.

If you'd like, I can update the workflow to:
- fetch the backend service URL from App Runner after backend creation and use it to rebuild the client automatically (requires AWS CLI queries and can be added),
- or create an interactive README that guides you step-by-step to set the required GitHub secrets and IAM policy.
