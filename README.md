# Team Task Manager (MERN)

Production-ready Team Task Manager built with MongoDB, Express, React (Vite), and Node.js using JWT authentication, role-based access (Admin/Member), and dynamic API-driven UI/state.

## Features

- JWT auth with secure password hashing (bcryptjs)
- Role-based access control for admin-only routes/actions
- MVC backend architecture with centralized middleware
- MongoDB relationships using ObjectId refs and population
- Projects, tasks, teams, users, and dashboard analytics from database APIs only
- Task assignment, status flow, deadlines, overdue tracking, activity comments
- Responsive frontend with protected routes and Axios interceptors
- Railway-ready backend and Vercel-ready frontend configuration

## Project Structure

- `backend/`: Express API, Mongoose models, middleware, controllers, routes, seed scripts
- `frontend/`: React app with auth context, protected routing, reusable components and pages

## Local Development

### 1) Backend

1. `cd backend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. Set `MONGODB_URI`, `JWT_SECRET`, `CLIENT_URL`
5. `npm run dev`

Optional sample data:

- `npm run seed`

### 2) Frontend

1. `cd frontend`
2. `npm install`
3. Copy `.env.example` to `.env`
4. `npm run dev`

## REST API Summary

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Users

- `GET /api/users/profile`
- `GET /api/users` (admin)
- `GET /api/users/:id` (admin)
- `PUT /api/users/:id/role` (admin)

### Projects

- `GET /api/projects`
- `GET /api/projects/:id`
- `POST /api/projects` (admin)
- `PUT /api/projects/:id` (admin)
- `DELETE /api/projects/:id` (admin)

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks` (admin)
- `PUT /api/tasks/:id`
- `DELETE /api/tasks/:id` (admin)

### Teams

- `GET /api/teams`
- `POST /api/teams` (admin)
- `PUT /api/teams/:id` (admin)
- `POST /api/teams/:id/members` (admin)
- `DELETE /api/teams/:id/members` (admin)
- `DELETE /api/teams/:id` (admin)

### Dashboard

- `GET /api/dashboard`

## Railway Deployment (Backend)

1. Deploy `backend` service to Railway
2. Set environment variables: `PORT`, `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`
3. Start command: `npm start`

## Vercel Deployment (Frontend)

# Team Task Manager (MERN)

A production-ready Team Task Manager built with MongoDB, Express, React (Vite), and Node.js. It includes JWT authentication, role-based access (Admin / Member), and a REST API powering a responsive React UI.

**Highlights**
- **Auth:** JWT with secure password hashing (bcryptjs).
- **Roles:** Admin-only routes and actions.
- **Architecture:** MVC backend with centralized middleware.
- **Data model:** Projects, Tasks, Teams, Users with Mongoose refs and population.
- **Frontend:** React (Vite) with protected routes, context-based auth, and Axios interceptors.

---

**Tech stack**
- Backend: Node.js, Express, MongoDB, Mongoose
- Frontend: React, Vite, Tailwind CSS
- Auth: JWT, bcryptjs

---

## Quick Start

Prerequisites: Node.js 18+, npm, and a MongoDB instance (local or hosted).

1) Backend

```bash
cd backend
npm install
cp .env.example .env
# Edit .env to set MONGODB_URI, JWT_SECRET, CLIENT_URL
npm run dev
```

Optional: Seed sample data

```bash
npm run seed
```

2) Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL to your backend API (e.g. http://localhost:5000/api)
npm run dev
```

---

## Environment variables

- Backend (copy to `backend/.env`):

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PORT=5000
```

- Frontend (copy to `frontend/.env`):

```
VITE_API_URL=http://localhost:5000/api
```

---

## API Summary (most-used endpoints)

- Auth
	- POST `/api/auth/register` — register a new user
	- POST `/api/auth/login` — login (returns JWT)
	- GET `/api/auth/me` — current user data

- Users (admin)
	- GET `/api/users` — list users
	- GET `/api/users/:id` — user details
	- PUT `/api/users/:id/role` — update role

- Projects
	- GET `/api/projects` — list projects
	- GET `/api/projects/:id` — project details
	- POST `/api/projects` — create (admin)
	- PUT `/api/projects/:id` — update (admin)
	- DELETE `/api/projects/:id` — delete (admin)

- Tasks
	- GET `/api/tasks` — list tasks
	- GET `/api/tasks/:id` — task details
	- POST `/api/tasks` — create (admin)
	- PUT `/api/tasks/:id` — update
	- DELETE `/api/tasks/:id` — delete (admin)

- Teams
	- GET `/api/teams` — list teams
	- POST `/api/teams` — create (admin)
	- PUT `/api/teams/:id` — update (admin)
	- POST `/api/teams/:id/members` — add member (admin)
	- DELETE `/api/teams/:id/members` — remove member (admin)

---

## Deployment notes

- Backend: Railway is configured via `railway.json`. Ensure `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, and `CLIENT_URL` are set. Start command: `npm start`.
- Frontend: Vercel works with `VITE_API_URL` pointing to the backend API (include `/api` suffix if needed). `vercel.json` handles SPA rewrites.

---

## Development tips
- Use Postman or Insomnia to exercise the API endpoints during development.
- The frontend includes an Axios instance with an interceptor at `frontend/src/api/axios.js` to attach the JWT to requests.

---

## Contributing
- Open an issue or submit a pull request. Keep changes focused and add tests when possible.

---

## License
This project is provided as-is. Add a license file if you plan to open source it.
