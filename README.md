# TaskFlow Web

A simple task manager frontend built with React, TypeScript, Vite, and Tailwind CSS.
It connects to the TaskFlow API for authentication and task management.

Repo for the API: https://github.com/alen01l/TaskFlow.Api

## Run locally

1) Clone the repo:
   git clone https://github.com/alen01l/taskflow-web.git
   cd taskflow-web

2) Install dependencies:
   npm install

3) Configure the API URL (create a .env in the project root):
   VITE_API_BASE=https://localhost:7160/api
   (Change the port to your API’s HTTPS port shown in Swagger.)

4) Start the dev server:
   npm run dev

The app runs at http://localhost:5173/

## Roadmap / Progress

- [x] Scaffold frontend (Vite + React + TypeScript + Tailwind)
- [x] API connection verified (CORS + cookie test → 401 before login)
- [ ] Login with existing TaskFlow API users
- [ ] View list of tasks
- [ ] Create new tasks
- [ ] Update task status/priority
- [ ] Delete tasks
- [ ] UI polish with Tailwind (dark mode, responsive)

## Notes / Issues

- CORS: Ensure the API allows credentials from http://localhost:5173 and sets the cookie with SameSite=None and Secure.
- API cookie auth: For API routes, the backend should return 401/403 (no redirects to /Account/Login).
- Demo login: demo@taskflow.local / Pass123$
