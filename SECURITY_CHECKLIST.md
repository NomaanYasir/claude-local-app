# Security Checklist

For each item below, the status is indicated with a short proof reference (file or setting).

- Env / secrets handling — Implemented
  - Proof: `.gitignore` contains `.env` and `server/.env` entries; server reads `.env` via `require('dotenv').config()` in `server/src/index.js`.

- Never send secrets to client — Implemented
  - Proof: server does not expose `process.env` to clients; centralized error handler in `server/src/app.js` prevents leaking env values.

- Authentication / JWT handling — Implemented (production-guard)
  - Proof: JWTs issued in `server/src/controllers/authController.js` and verified in `server/src/middleware/auth.js`. `server/src/index.js` fails fast in production if `JWT_SECRET` is missing.

- Password hashing — Implemented
  - Proof: `bcrypt.hash` on register and `bcrypt.compare` on login in `server/src/controllers/authController.js`.

- Route protection — Implemented
  - Proof: Protected routes use `auth` middleware (e.g., `server/src/routes/tasks.js`, `server/src/routes/ai.js`, `server/src/routes/outputs.js`). Ownership check added in `server/src/controllers/tasksController.js` for outputs.

- Input validation — Implemented
  - Proof: `server/src/middleware/validate.js` and its application in route files: `server/src/routes/auth.js`, `server/src/routes/tasks.js`, `server/src/routes/ai.js`, `server/src/routes/outputs.js`.

- Rate limiting — Implemented (basic)
  - Proof: `express-rate-limit` configured in `server/src/app.js` for `/auth` and `/api/ai`. Internal per-user limiter present in `server/src/controllers/aiController.js`.
  - Note: For production, recommend Redis-backed rate limiter to preserve limits across instances.

- CORS — Partially Implemented / Configurable
  - Proof: `server/src/app.js` reads `CORS_ORIGIN` env var to allow specific origins in production. Default dev behavior allows all for convenience. Set `CORS_ORIGIN` in production to lock origins.

- Helmet / security headers — Implemented
  - Proof: `helmet()` added in `server/src/app.js`.

- Error handling / sanitized responses — Implemented
  - Proof: Centralized error handler in `server/src/app.js` returns generic messages in production and includes details only when `NODE_ENV === 'development'`. Controllers updated to avoid returning internal `err.message` to clients.

- Dependency audit — Partially Implemented
  - Proof: `server/package.json` includes `"audit": "npm audit --audit-level=moderate"` script. Run `cd server && npm run audit` to view current vulnerability report.

Recommendations (next steps)
- Run `npm audit` in `server` and apply fixes (`npm audit fix` / dependency upgrades) and re-test.
- Use a Redis-backed rate limiter for production deployments (e.g., `rate-limit-redis`) and enable consistent limits across instances.
- Consider moving JWT to HttpOnly Secure cookies to mitigate XSS token theft if higher security is desired.
- Configure a strict `CORS_ORIGIN` value for production and tighten `helmet` CSP settings if serving from known domains.
