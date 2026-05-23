import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItemClass = ({ isActive }) =>
  `rounded-full px-3 py-1 text-sm font-medium transition ${
    isActive ? 'bg-slate-900 text-white' : 'text-slate-700 hover:bg-slate-200'
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const homePath = user?.role === 'admin' ? '/dashboard' : '/projects';

  return (
    <header className="sticky top-0 z-20 border-b border-white/30 bg-white/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to={homePath} className="text-lg font-bold tracking-tight text-slate-900">
          Team Task Manager
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          {user?.role === 'admin' ? (
            <NavLink to="/dashboard" className={navItemClass}>
              Dashboard
            </NavLink>
          ) : null}
          <NavLink to="/projects" className={navItemClass}>
            Projects
          </NavLink>
          <NavLink to="/tasks" className={navItemClass}>
            Tasks
          </NavLink>
          {user?.role === 'admin' ? (
            <NavLink to="/team" className={navItemClass}>
              Team
            </NavLink>
          ) : null}
          {user?.role === 'admin' ? (
            <NavLink to="/admin" className={navItemClass}>
              Admin
            </NavLink>
          ) : null}
        </nav>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.15em] text-slate-500">{user?.role || 'member'}</p>
            <p className="text-sm font-semibold text-slate-700">{user?.name}</p>
          </div>
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white hover:bg-slate-700"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
