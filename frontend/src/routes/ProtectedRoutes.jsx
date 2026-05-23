import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Utils/Loader';

const ProtectedRoutes = ({ roles, redirectTo = '/projects' }) => {
  const { user, isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <Loader label="Checking session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
