# Frontend (React + Vite)

## Setup

1. `npm install`
2. Copy `.env.example` to `.env`
3. `npm run dev`

## Environment

- `VITE_API_URL=http://localhost:5000/api`

## Architecture

- `src/context/AuthContext.jsx`: JWT session, login/signup/logout, token persistence
- `src/routes/ProtectedRoutes.jsx`: route protection + role checks
- `src/layout/MainLayout.jsx`: shared responsive shell
- `src/pages/*`: API-driven pages for auth/dashboard/projects/tasks/team/settings
- `src/admin/*`: admin-only management routes
- `src/components/*`: reusable cards, charts, auth, navbar, utilities

## UX Capabilities

- Protected routes and role-based rendering
- Dynamic dashboard analytics from API
- Task filtering, search, sorting, status updates, comments
- Project creation, details, and member mapping
- Team list with member/project stats
- Mobile responsive layout and modern visual style

## Build

- `npm run build`
- `npm run preview`
