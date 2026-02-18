### Study AI Server

Backend for the Study AI app. Uses Express + Prisma + SQLite and OpenAI.

Full setup and common commands

```powershell
cd server
npm install
Copy-Item -Path .env.example -Destination .env -Force
notepad .\env  # set OPENAI_API_KEY and JWT_SECRET

npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Health check: `GET /` returns `{ ok: true, message: 'Study AI server' }`.

Key endpoints

- `POST /auth/register` — register { email, password, name }
- `POST /auth/login` — login { email, password } → returns `{ token, user }`
- Protected routes (use `Authorization: Bearer <token>`):
  - `POST /tasks` — create task
  - `GET /tasks` — list tasks for user
  - `GET /tasks/:id` — task detail
  - `POST /tasks/:id/generate` — legacy generate endpoint (kept for compatibility)
  - `GET /tasks/:id/outputs` — list saved AI outputs
  - AI endpoints under `/api/ai/*`:
    - `POST /api/ai/summary`
    - `POST /api/ai/flashcards`
    - `POST /api/ai/quiz`
    - `POST /api/ai/study-plan`
     - `POST /api/ai/summary`\
     - `POST /api/ai/summarize` (alias)
     - `POST /api/ai/flashcards`\
     - `POST /api/ai/quiz`\
     - `POST /api/ai/study-plan`
     - New helper endpoints (accept ad-hoc notes, require auth):
       - `POST /api/ai/summarize-notes` { notes } -> { summary }
       - `POST /api/ai/quiz-questions` { notes } -> { questions: [...] }
  - Report feedback: `POST /outputs/:id/report`

Troubleshooting
- If `npx prisma migrate dev` fails because a migration exists, use `npx prisma migrate reset` to reset the DB (warning: deletes data).
- If AI calls return 502, confirm `OPENAI_API_KEY` is set and valid in `server/.env`.
- For rate-limit issues during dev, the server uses an in-memory limiter — restart clears it.

Production notes
- Replace SQLite with Postgres or managed DB for production.
- Use a Redis-backed rate limiter and secure secrets via environment/secret manager.
