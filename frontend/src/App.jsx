import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoutes from './routes/ProtectedRoutes';
import MainLayout from './layout/MainLayout';

import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';
import Dashboard from './pages/Dashboard/Dashboard';
import Projects from './pages/Projects/Projects';
import ProjectDetails from './pages/Projects/ProjectDetails';
import CreateProject from './pages/Projects/CreateProject';
import Tasks from './pages/Tasks/Tasks';
import TaskDetails from './pages/Tasks/TaskDetails';
import CreateTask from './pages/Tasks/CreateTask';
import Team from './pages/Team/Team';
import Members from './pages/Team/Members';
import NotFound from './pages/Utils/NotFound';


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<Signup />} />

      <Route element={<ProtectedRoutes />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetails />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/tasks/:id" element={<TaskDetails />} />
          <Route path="/tasks/:id/edit" element={<CreateTask />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoutes roles={['admin']} />}>
        <Route element={<MainLayout />}>
          <Route path="/projects/create" element={<CreateProject />} />
          <Route path="/projects/:id/edit" element={<CreateProject />} />
          <Route path="/tasks/create" element={<CreateTask />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/members" element={<Members />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;