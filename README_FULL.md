# Study AI — Fullstack (Client + Server)

This repository contains a minimal MVP for Study AI — an education startup tool that converts student notes into study summaries, flashcards, quizzes, and study plans using OpenAI.

Structure

- `/client` — React + Vite frontend
- `/server` — Node + Express backend with Prisma + SQLite

Quick setup

1. Server
   - cd server
   - npm install
   - copy `.env.example` to `.env` and set `OPENAI_API_KEY` and `JWT_SECRET` (and `DATABASE_URL` if desired)
   - npx prisma generate
   - npx prisma migrate dev --name init
   - npm run dev

2. Client
   - cd client
   - npm install
   - optionally set `VITE_API_URL` in `.env`
   - npm run dev

Notes

- The server stores outputs in SQLite via Prisma. AI calls use `OPENAI_API_KEY` in server env.
- Endpoints return JSON and have basic error handling.
- Frontend stores JWT in `localStorage` for the session.
