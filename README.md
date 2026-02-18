# Study AI — Fullstack MVP

This repository contains a minimal, production-minded MVP for Study AI: a tool that helps students convert unstructured notes into study summaries, flashcards, quizzes, and 7-day study plans using an AI service.

Overview
- Client: React + Vite app at `client/`
- Server: Node + Express API at `server/` with Prisma + SQLite for persistence
- AI: Calls OpenAI (key stored in `server/.env`)

Quick repository layout

- client/
  - src/ — React source
  - package.json — client scripts
  - .env.example — example environment variables for the client
- server/
  - src/ — Express app, controllers, routes
  - prisma/schema.prisma — database schema
  - prisma/seed.js — seed script
  - package.json — server scripts
  - .env.example — example environment variables for the server
- README.md — this file
- .gitignore

Prerequisites
- Node.js 18+ (LTS recommended)
- npm

1) Server — install, migrate, seed, run

Open PowerShell and run:

```powershell
cd C:\Users\AME\claude-local-app\server
npm install
Copy-Item -Path .env.example -Destination .env -Force
# Edit server\.env and set:
# OPENAI_API_KEY=your_openai_key
# JWT_SECRET=some_strong_secret
# PORT=4000
notepad .\env

# Generate Prisma client
npx prisma generate

# Create and apply migration to SQLite
npx prisma migrate dev --name init

# Seed sample data (creates seed user and two tasks)
npm run seed

# Start dev server
npm run dev
```

Health check:

```powershell
Invoke-RestMethod -Method Get -Uri http://localhost:4000
```
Expect: `{ "ok": true, "message": "Study AI server" }`.

2) Client — install and run

Open a second terminal:

```powershell
cd C:\Users\AME\claude-local-app\client
npm install
Copy-Item -Path .env.example -Destination .env -Force
notepad .\env    # optionally set VITE_API_URL
npm run dev
```

Open the Vite URL (usually `http://localhost:5173`).

Environment variables
- `server/.env` (copy from `server/.env.example`) contains:
  - `DATABASE_URL` (default: `file:./dev.db`)
  - `JWT_SECRET` (required)
  - `OPENAI_API_KEY` (required for AI features)
  - `PORT` (default 4000)
- `client/.env` (copy from `client/.env.example`) contains:
  - `VITE_API_URL` (e.g. `http://localhost:4000`)

Database & Prisma
- Schema: `server/prisma/schema.prisma` defines `User`, `Task`, `AIOutput`, and `Feedback`.
- To inspect DB: run `npx prisma studio` inside `server/` to open a browser UI.

API & Auth
- Register/Login endpoints: `POST /auth/register`, `POST /auth/login` (returns JWT)
- Protected routes require `Authorization: Bearer <token>` header.

Responsible AI
- Server instructs the model not to provide full assignment answers — outputs include a disclaimer in the UI. Users can report inaccurate outputs; feedback is stored in the `Feedback` table.

Troubleshooting
- `prisma migrate dev` fails with existing DB: use `npx prisma migrate reset` to drop & recreate (this will erase data).
- OpenAI errors: ensure `OPENAI_API_KEY` is set and valid in `server/.env`; check server logs for details.
- Network errors: client shows a global banner for connectivity issues. Ensure server is running and `VITE_API_URL` points to the correct server.

Security & production notes
- Do not commit `.env` files to source control. Add strong `JWT_SECRET` in production and use HTTPS.
- For production readiness: use a persistent DB (Postgres), secure secrets (Vault, environment), and a real rate limiter (Redis-backed).

Contact
- For help running these instructions locally, reply in the chat and I can provide exact commands or run migrations for you.
 
**Deploy to AWS App Runner**

- Overview: This repo contains `client/` (React + Vite) and `server/` (Node + Express + Prisma + SQLite). The recommended production setup is to run the backend in App Runner (or ECS/Fargate) with a managed database (RDS). The frontend can be an App Runner service or S3+CloudFront.

Files added for App Runner deployment:
- `server/Dockerfile`, `server/.dockerignore`
- `client/Dockerfile`, `client/.dockerignore`, `client/.env.production`, `client/.env.example`

Backend container notes
- The server listens on `process.env.PORT` (App Runner provides `PORT`). The server runs `npx prisma generate` and `npx prisma migrate deploy` on startup (see `server/src/index.js`).
- SQLite is file-based. App Runner provides ephemeral per-instance storage — a SQLite DB inside the container is not suitable for production (it will not be shared between instances and may be lost on redeploy). Use Amazon RDS/Postgres for production and set `DATABASE_URL` accordingly.

Client build & env
- Vite inlines `VITE_` env variables at build time. You must set `VITE_API_URL` during the client build to the backend URL returned by App Runner.
- Example env files are in `client/.env.example` and `client/.env.production`.

Quick Docker build (local)
```powershell
cd server
docker build -t studybuddy-server:latest .

cd ../client
docker build --build-arg VITE_API_URL=https://your-backend-url -t studybuddy-client:latest .
```

App Runner deployment steps (summary)

1. Choose how App Runner will obtain your service image:
   - Connect App Runner directly to GitHub (recommended) and configure a build for the `server/` and `client/` folders, or
   - Build Docker images locally or in CI, push to ECR, and connect App Runner to ECR.

2. Backend App Runner configuration:
   - Build command (if using source): use Dockerfile in `server/` or custom build to image.
   - Start command: leave blank if using Dockerfile `CMD` (`node src/index.js`).
   - Runtime port: App Runner provides `PORT` as an env var — the container should listen on `process.env.PORT`.
   - Environment variables (set in App Runner service settings):
     - `DATABASE_URL` (use RDS in production; `file:./prisma/dev.db` is only for local/testing)
     - `JWT_SECRET` (required in production)
     - `OPENAI_API_KEY` (optional)
     - `CORS_ORIGIN` (frontend origin)
     - `NODE_ENV=production`
   - Health check: path `/` or `/health` (ensure it returns 200). Set port to the container port (App Runner default).

3. After backend deployment App Runner gives you a URL like `https://<id>.awsapprunner.com`. Use that URL for the client's `VITE_API_URL`.

4. Frontend build & deploy:
   - If using App Runner builds from source, set the build-time env var `VITE_API_URL` to the backend URL in the App Runner build configuration. Rebuild the client so Vite inlines the correct URL.
   - If using Docker/ECR, build with `--build-arg VITE_API_URL=https://your-backend-url` and push the image.

Troubleshooting
- Prisma migration errors:
  - `migrate deploy` expects migrations in `prisma/migrations`. If errors occur, inspect migrations and `DATABASE_URL`. For ephemeral SQLite, migrations may create a local file that is not persisted — prefer RDS for production.
- PORT binding issues:
  - Ensure the app listens on `process.env.PORT`. App Runner sets `PORT`; do not hardcode `4000` for production.
- CORS issues:
  - Set `CORS_ORIGIN` on the backend to the frontend origin and confirm the backend returns proper CORS headers for OPTIONS and other methods.
- Vite environment issues:
  - `VITE_` variables are embedded at build time. Updating runtime env vars will not change a built static bundle — rebuild the client with the correct `VITE_API_URL`.

If you'd like, I can generate a `docker-compose.yml` for local testing or produce App Runner GitHub build configuration examples for both services.
# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
