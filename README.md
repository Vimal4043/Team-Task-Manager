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

1. Deploy `frontend` project to Vercel
2. Set `VITE_API_URL` to your Railway backend URL ending in `/api`
3. `vercel.json` handles SPA route rewrites