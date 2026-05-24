# Team Task Manager

A full-stack team task management application (MERN) with JWT authentication, role-based access (Admin / Member), projects and tasks, and a responsive React frontend powered by a REST API.

**Built with:** Node.js, Express, MongoDB, Mongoose, React (Vite), Tailwind CSS.

--

**Key features**
- JWT authentication and secure password hashing
- Admin / Member roles and route protection
- Projects and tasks with assignment, status, deadlines, and comments
- Clean MVC backend structure and reusable React components
- Clean MVC backend structure and reusable React components

--

**Repository layout (top level)**
- backend/ — Express API, models, controllers, middleware
- frontend/ — React (Vite) app, components, pages, API client

--

## Prerequisites
- Node.js 18+ and npm (or Yarn)
- MongoDB (local or hosted)

## Quick start — Local development

1) Backend

```bash
cd backend
npm install
copy .env.example .env
# Edit backend/.env and set MONGODB_URI, JWT_SECRET, CLIENT_URL (see below)
npm run dev
```

Optional: seed sample data

```bash
npm run seed
```

2) Frontend

```bash
cd frontend
npm install
copy .env.example .env
# Set VITE_API_URL to your backend (e.g. http://localhost:5000/api)
npm run dev
```

--

## Environment variables

Backend (`backend/.env`)

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PORT=5000
```

Frontend (`frontend/.env`)

```
VITE_API_URL=http://localhost:5000/api
```

--

## How to run

- Development (backend): `npm run dev` in `backend/` (uses nodemon)
- Development (frontend): `npm run dev` in `frontend/` (Vite)
- Production (backend): set env vars and `npm start`
- Production (frontend): build with `npm run build` and deploy static assets (Vercel, Netlify, etc.)

--

## API quick reference

Auth
- POST /api/auth/register — register
- POST /api/auth/login — login (returns JWT)
- GET /api/auth/me — current user

Users (admin)
- GET /api/users — list users
- GET /api/users/:id — user details
- PUT /api/users/:id/role — change role

Projects
- GET /api/projects
- GET /api/projects/:id
- POST /api/projects — (admin)
- PUT /api/projects/:id — (admin)
- DELETE /api/projects/:id — (admin)

Tasks
- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks — (admin)
- PUT /api/tasks/:id
- DELETE /api/tasks/:id — (admin)

--

--

## Deployment notes
- Backend: `railway.json` is included for Railway deployments. Ensure required env vars (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`) are set and use `npm start`.
- Frontend: `vercel.json` is prepared for SPA routing. Set `VITE_API_URL` to the deployed API URL.

--

## Development tips
- Use Postman/Insomnia to test API endpoints.
- Frontend Axios client: `frontend/src/api/axios.js` includes an interceptor that attaches the JWT.

--

## Contributing
- Open issues or PRs. Follow existing code style and add tests for new functionality.

--

## License
Add a `LICENSE` file if you intend to open-source this project. For private/internal use, document any internal policies.

--

If you'd like, I can also:
- add a short `backend/.env.example` and `frontend/.env.example` snippet to the repo,
- or create a `CONTRIBUTING.md` with PR guidelines.
