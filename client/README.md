# Client — Study AI

This folder contains the React + Vite frontend for the Study AI app.

Quick start

```powershell
cd client
npm install
Copy-Item -Path .env.example -Destination .env -Force
notepad .\env   # set VITE_API_URL if needed
npm run dev
```

Notes
- The client stores JWT in `localStorage` for persistence in this MVP.
- UI features: register/login, create tasks, view saved outputs, generate AI outputs, report inaccuracies.
# Study AI — Client

React + Vite frontend for Study AI.

Setup

1. Copy `.env.example` to `.env` if you want to set `VITE_API_URL`.
2. Install: `npm install` inside `client`.
3. Start: `npm run dev`.
