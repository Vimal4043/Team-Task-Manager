# Backend API (Express + MongoDB)

## Setup

1. cd backend
2. npm install
3. Copy `.env.example` to `.env` and configure values
4. npm run dev

## Scripts

- npm run dev
- npm start
- npm run seed
- npm run check

## Environment Variables

- PORT
- MONGODB_URI
- JWT_SECRET
- JWT_EXPIRES_IN
- CLIENT_URL

`NODE_ENV` is read from the runtime environment in production and does not need to be set in the local `.env` file.

## Core API Endpoints

- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me
- GET /api/users/profile
- GET /api/users (admin)
- PUT /api/users/:id/role (admin)
- GET /api/projects
- POST /api/projects (admin)
- GET /api/projects/:id
- PUT /api/projects/:id (admin)
- DELETE /api/projects/:id (admin)
- GET /api/tasks
- POST /api/tasks (admin)
- GET /api/tasks/:id
- PUT /api/tasks/:id
- DELETE /api/tasks/:id (admin)
 
 
