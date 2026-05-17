# TaskFlow Web

Frontend client for TaskFlow built with **React**, **TypeScript**, **Vite**, and **Tailwind CSS**.

The app connects to the TaskFlow API for authentication and task management.

Backend API repo:

```txt
https://github.com/alen01l/TaskFlow.Api
```

## Features

- React + TypeScript
- Vite development environment
- Tailwind CSS UI
- Cookie-based authentication
- Task CRUD integration
- Shared API layer
- Custom React hooks
- Component-based architecture

## Tech stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Fetch API
- ASP.NET Core backend

## Run locally

### Requirements

- Node.js 18+
- Running TaskFlow API backend

## Setup

Clone the repository:

```bash
git clone https://github.com/alen01l/taskflow-web.git
cd taskflow-web
```

Install dependencies:

```bash
npm install
```

Create a `.env` file in the project root:

```env
VITE_API_BASE=https://localhost:7160/api
```

Replace the port with your backend HTTPS port.

Start the development server:

```bash
npm run dev
```

The frontend runs at:

```txt
http://localhost:5173
```

## Authentication

Authentication uses cookies from the ASP.NET Core Identity backend.

After login:

- the API sets a secure auth cookie
- requests automatically include credentials
- unauthorized requests return `401`

Demo account:

```txt
Email: demo@taskflow.local
Password: Pass123$
```

## Project structure

```txt
src/
├── api/
├── components/
├── hooks/
├── lib/
├── types/
└── App.tsx
```

## Architecture

The frontend uses:

- reusable API modules
- shared TypeScript types
- custom hooks (`useAuth`, `useTasks`)
- isolated UI components
- centralized API client

## Current functionality

### Authentication

- Login
- Logout
- Session persistence
- Current user fetch

### Tasks

- List tasks
- Create tasks
- Update task title
- Update status
- Update priority
- Delete tasks

## API integration

API requests are centralized in:

```txt
src/api/
```

Shared fetch logic:

```txt
src/lib/apiClient.ts
```

## Available scripts

Start development server:

```bash
npm run dev
```

Build production app:

```bash
npm run build
```

Run linting:

```bash
npm run lint
```

Preview production build:

```bash
npm run preview
```

## Notes

### CORS

The backend must allow credentials from:

```txt
http://localhost:5173
```

### Cookie authentication

The backend uses:

```txt
SameSite=None
Secure=true
```

for auth cookies during development.

### API environment variable

The frontend requires:

```env
VITE_API_BASE
```

Example:

```env
VITE_API_BASE=https://localhost:7160/api
```

## Roadmap

- [x] React + Vite setup
- [x] Tailwind CSS integration
- [x] API connectivity
- [x] Cookie authentication
- [x] Task CRUD
- [x] Shared API modules
- [x] Custom React hooks
- [x] Component extraction
- [ ] Filtering and search
- [ ] Due dates
- [ ] Task sorting
- [ ] React Router
- [ ] Toast notifications
- [ ] Kanban board
- [ ] Deployment