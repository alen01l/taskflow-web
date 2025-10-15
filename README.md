# TaskFlow Web

A simple task manager frontend built with React, TypeScript, Vite, and Tailwind CSS.
It connects to the TaskFlow API for authentication and task management.

Backend repo: https://github.com/alen01l/TaskFlow.Api

## Run locally

1) Clone the repo:
   git clone https://github.com/alen01l/taskflow-web.git
   cd taskflow-web

2) Install dependencies:
   npm install

3) Configure the API URL (create a .env file in the project root):
   VITE_API_BASE=https://localhost:7160/api
   (Change the port to match your API’s HTTPS port shown in Swagger.)

4) Start the dev server:
   npm run dev

The app runs at http://localhost:5173/

## Roadmap / Progress

- [x] Scaffold frontend (Vite + React + TypeScript + Tailwind)
- [x] API connection verified (CORS + cookie test → 401 before login)
- [x] Login with TaskFlow API user
- [x] Create new tasks via API
- [ ] View, update, and delete tasks
- [ ] UI polish (priority colors, status labels)
- [ ] React Router for login/tasks pages
- [ ] Deployment to Vercel + Azure

## Notes / Issues

- **CORS:** API must allow credentials from http://localhost:5173 and set cookie SameSite=None + Secure.
- **Authentication:** Uses cookie-based Identity. Returns 401/403 for unauthorized API requests (no redirects).
- **Demo login:** demo@taskflow.local / Pass123$
- **Current features:** login/logout, fetch tasks, add new tasks, persistent via EF Core (SQLite).
