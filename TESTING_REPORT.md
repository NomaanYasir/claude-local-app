# Testing Report

## Summary of features tested
- Auth: Registration, Login, token persistence, Logout. (`client/src/pages/Register.jsx`, `client/src/pages/Login.jsx`, `server/src/controllers/authController.js`)
- Tasks CRUD: Create task, list tasks, view task details, mark complete. (`client/src/pages/Dashboard.jsx`, `server/src/controllers/tasksController.js`)
- AI helper endpoints: per-task generation and ad-hoc Study Helper routes (`/api/ai/*`) — summary, flashcards, quiz, study-plan, summarize-notes, quiz-questions. (`server/src/routes/ai.js`, `server/src/controllers/aiController.js`, `client/src/components/AIHelper.jsx`)
- UI navigation & UX: Topbar navigation, task list, outputs view, toasts, empty states, global error/loading behavior. (`client/src/App.jsx`, `client/src/components/Toast.jsx`, `client/src/components/ErrorBanner.jsx`)

## Test cases executed

### Normal flows
- Register → Login → Create task (title + notes >= 20 chars) → Select task → Generate summary → View saved output.
- AI Helper: paste notes >= 30 chars → Summarize; >= 50 chars → Generate quiz questions.

### Edge / weird inputs
- Empty fields for register/login/create task → server returns 400; UI shows inline error.
- Invalid email format on register/login → 400 via server validation.
- Short notes (<20) when creating task → client and server validation reject.
- Extremely long notes payloads → server may return error; UI remains responsive (no crash).
- Special characters / Unicode in name/email/notes → accepted; token returned.
- Duplicate registration → 400 "User already exists".
- Invalid date strings → client validation rejects; server validates type.
- Rapid repeated AI calls to trigger rate limit → server returns 429.
- Missing OpenAI key → server returns 502 with sanitized error (no stack trace).
- Unauthorized access attempts (IDOR) when listing outputs → 404 (ownership enforced).

## Bugs found and fixes
- IDOR: `GET /tasks/:id/outputs` previously did not verify task ownership.
  - Fix: added ownership check in `server/src/controllers/tasksController.js` to ensure only the task owner can list outputs.
- Missing server-side validation: some routes accepted invalid payloads.
  - Fix: added `server/src/middleware/validate.js` and applied `validateBody(...)` to `server/src/routes/auth.js`, `server/src/routes/tasks.js`, `server/src/routes/ai.js`, and `server/src/routes/outputs.js`.
- Blank pages on uncaught client runtime errors.
  - Fix: added `client/src/components/ErrorBoundary.jsx` and `client/src/components/GlobalHandlers.jsx`, wrapped the app in `client/src/App.jsx` to show friendly UI instead of blank screen.
- Error responses leaked internal details.
  - Fix: centralized error handler in `server/src/app.js` now sanitizes responses; controllers were updated to avoid returning `err.message` in production.
- Double-submit risk and lack of global loading indicator.
  - Fix: added `client/src/lib/loading.js` and `client/src/components/LoadingIndicator.jsx`; wired `client/src/api.js` to track loading and disabled form submits while requests run.

## Screens tested
- Desktop (1280px): Register/Login, Dashboard two-column layout, task list, task detail, AIHelper, Saved Outputs.
- Tablet (768px): stacked layout; verified usability and controls.
- Mobile (375–360px): left/right stack vertically; AIHelper textarea reduced; buttons stacked and tappable. (`client/src/styles.css` controls responsive behavior)

## Result: pass / fail summary
- Auth flows: PASS (validation and JWT checks in place)
- Tasks CRUD: PASS (ownership checks and validation)
- AI helper endpoints: PASS (rate limiting, sanitized errors, validation)
- UI navigation & UX: PASS (ErrorBoundary and GlobalHandlers prevent blank pages; loading indicator implemented)
- Regression: PASS when run against a running server using `server/tests/regression.js` (run `npm run test:regress` in `server`)

Overall status: PASS — fixes applied and basic regression protection added. Recommended next steps: run `npm audit` in `server` and address any dependency findings, and consider Redis-backed rate limiting for production.
