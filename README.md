# 🗂️ Team Task Manager (MERN)

A full-stack team task management application built with the **MERN** stack (MongoDB, Express, React, Node). It includes JWT authentication, role-based access (Admin / Member), projects, tasks, and a responsive React frontend powered by a REST API.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
	- [Prerequisites](#prerequisites)
	- [Environment Variables](#environment-variables)
	- [Installation](#installation)
	- [Running the App](#running-the-app)
- [API Reference](#-api-reference)
- [Pages & Routes](#-pages--routes)
- [Data Models](#-data-models)
- [Deployment](#-deployment)

---

## ✨ Features

### User Features
- 📝 Register and log in with JWT-based authentication
- 📁 Create and browse projects
- ✅ Create, assign, and manage projects and tasks with status and deadlines
- 👥 Team member management and role-based access

### Admin Features
- ➕ Create, edit, and delete projects and tasks
- 🧑‍💼 Manage workspace members
- 📊 View dashboards and basic KPIs

---

## 🧰 Tech Stack

| Layer       | Technology                                     |
|-------------|------------------------------------------------|
| Frontend    | React 19, React Router 7, Vite, Tailwind CSS 4 |
| Backend     | Node.js, Express                               |
| Database    | MongoDB with Mongoose                          |
| Auth        | JSON Web Tokens (JWT), bcryptjs                |
| Build Tool  | Vite                                           |

---

## 📁 Project Structure
```
Team Task Manager/
├── README.md
├── backend/
│   ├── package.json
│   ├── server.js                # Express app entry point
│   ├── config/
│   │   └── db.js                # MongoDB connection
│   ├── controllers/             # controller logic (auth, users, projects, tasks)
│   ├── middleware/              # auth, role, and error handlers
│   ├── models/                  # Mongoose models: User, Project, Task
│   └── routes/                  # API routes: auth, users, projects, tasks
└── frontend/
		├── package.json
		├── vite.config.js
		├── public/                  # static assets
		└── src/
				├── api/                 # axios client
				├── components/          # shared UI components
				├── context/             # AuthContext
				├── pages/               # pages: Auth, Dashboard, Projects, Tasks, Team
				└── routes/              # Protected / public route wrappers
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm (or Yarn)
- MongoDB (local or hosted)

---

### Environment Variables

Create a `.env` file in `backend/` and set:

```
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
PORT=5000
```

Create a `.env` file in `frontend/` and set:

```
VITE_API_URL=http://localhost:5000/api
```

---

### Installation

1. Install backend dependencies

```bash
cd backend
npm install
```

2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

---

### Running the App

Start the backend server:

```bash
cd backend
npm run dev
```

Start the frontend development server:

```bash
cd frontend
npm run dev
```

Open the frontend at `http://localhost:5173` (Vite default).

---

## 📡 API Reference

### Auth — `/api/auth`

| Method | Endpoint           | Description               | Auth Required |
|--------|--------------------|---------------------------|---------------|
| POST   | `/api/auth/register` | Register a new user     | ❌            |
| POST   | `/api/auth/login`    | Login and get JWT        | ❌            |
| GET    | `/api/auth/me`       | Get current user         | ✅            |

---

### Users — `/api/users` (admin)

| Method | Endpoint               | Description           | Auth Required |
|--------|------------------------|-----------------------|---------------|
| GET    | `/api/users`           | List users            | ✅ Admin      |
| GET    | `/api/users/:id`       | Get user details      | ✅ Admin      |
| PUT    | `/api/users/:id/role`  | Change user role      | ✅ Admin      |

---

### Projects — `/api/projects`

| Method | Endpoint                | Description           | Auth Required |
|--------|-------------------------|-----------------------|---------------|
| GET    | `/api/projects`         | List projects         | ✅            |
| GET    | `/api/projects/:id`     | Project details       | ✅            |
| POST   | `/api/projects`         | Create project        | ✅ Admin      |
| PUT    | `/api/projects/:id`     | Update project        | ✅ Admin      |
| DELETE | `/api/projects/:id`     | Delete project        | ✅ Admin      |

---

### Tasks — `/api/tasks`

| Method | Endpoint             | Description            | Auth Required |
|--------|----------------------|------------------------|---------------|
| GET    | `/api/tasks`         | List tasks             | ✅            |
| GET    | `/api/tasks/:id`     | Task details           | ✅            |
| POST   | `/api/tasks`         | Create task            | ✅ Admin      |
| PUT    | `/api/tasks/:id`     | Update task            | ✅            |
| DELETE | `/api/tasks/:id`     | Delete task            | ✅ Admin      |

---

## 🗺️ Pages & Routes (frontend)

| Path                    | Page / Component       | Access        |
|-------------------------|------------------------|---------------|
| `/`                     | Redirect to `/dashboard`| Protected     |
| `/auth/login`           | Login                  | Public (hidden when logged in)
| `/auth/signup`          | Signup                 | Public (hidden when logged in)
| `/dashboard`            | Dashboard              | Admin         |
| `/projects`             | Projects list          | Authenticated |
| `/projects/:id`         | Project details        | Authenticated |
| `/tasks`                | Tasks list             | Authenticated |
| `/team`                 | Workspace/team pages   | Admin         |

---

## 🗃️ Data Models (summary)

### User
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Full name |
| `email` | String | Unique email |
| `password` | String | Hashed password |
| `role` | String | `admin` or `member` |

### Project
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Project title |
| `description` | String | Details |
| `members` | [ObjectId] | Assigned users |

### Task
| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Task title |
| `description` | String | Details |
| `assignee` | ObjectId | Assigned user |
| `status` | String | `todo`, `in-progress`, `done` |

---

## 🌐 Deployment

- Backend: `railway.json` is included for Railway deployments. Ensure env vars (`MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL`) are set and run `npm start`.
- Frontend: `vercel.json` is prepared for SPA routing. Set `VITE_API_URL` to the deployed API URL.

---

## 👨‍💻 Author

Project maintained by Vimal Kumar.

---

If you'd like, I can also add `backend/.env.example` and `frontend/.env.example`, or create a `CONTRIBUTING.md` with contribution guidelines.
