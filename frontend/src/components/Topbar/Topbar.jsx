import { Bell, Search, Menu, ChevronDown } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/team': 'Team',
};

const Topbar = ({ onMenuClick, searchValue, onSearchChange }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const title = useMemo(() => {
    const exact = pageTitles[location.pathname];
    if (exact) {
      return exact;
    }

    if (location.pathname.startsWith('/projects/')) return 'Project Details';
    if (location.pathname.startsWith('/tasks/')) return 'Task Details';
    return 'Team Task Manager';
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 backdrop-blur-xl">
      <div className="flex items-center gap-3 px-4 py-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md lg:hidden"
          aria-label="Open sidebar"
        >
          <Menu size={18} />
        </button>

        <div className="min-w-0 flex-1">
          <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">Workspace overview</p>
          <h2 className="truncate text-lg font-semibold tracking-tight text-slate-950 sm:text-xl">{title}</h2>
        </div>

        {/* <label className="hidden min-w-0 flex-1 items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 shadow-sm md:flex md:max-w-xl">
          <Search size={16} />
          <input
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search projects, tasks, members..."
            className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
          />
        </label> */}

        {/* <button
          type="button"
          className="hidden h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:inline-flex"
          aria-label="Notifications"
        >
          <Bell size={18} />
        </button> */}

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-cyan-500 to-amber-400 text-sm font-bold text-white">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-xs font-semibold text-slate-900">{user?.name || 'User'}</p>
              <p className="text-[11px] text-slate-500 capitalize">{user?.role || 'member'}</p>
            </div>
            <ChevronDown size={14} className="text-slate-500" />
          </button>

          {menuOpen ? (
            <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="w-full rounded-xl px-3 py-2 text-left text-sm font-medium text-slate-700 transition hover:bg-slate-100"
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
