import { BriefcaseBusiness, LayoutDashboard, LogOut, Users, CheckSquare, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SidebarItem from './SidebarItem';

const Sidebar = ({ isOpen, onClose, isMobile = false }) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    if (isMobile && onClose) {
      onClose();
    }
  };

  const items = [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/projects', icon: BriefcaseBusiness, label: 'Projects' },
    { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
    { to: '/team', icon: Users, label: 'Team' },
  ];

  const visibleItems = items.filter((it) => {
    if (it.to === '/team' && user?.role !== 'admin') return false;
    return true;
  });

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-slate-800 bg-slate-950 text-white shadow-2xl shadow-slate-950/40 transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}
    >
      <div className="flex items-center justify-between border-b border-white/8 px-6 py-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-cyan-300/80">Workspace</p>
          <h1 className="mt-1 text-xl font-semibold tracking-tight text-white">Team Task Manager</h1>
        </div>
        {isMobile ? (
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-white/10 p-2 text-slate-200 transition hover:bg-white/8"
            aria-label="Close sidebar"
          >
            <X size={18} />
          </button>
        ) : null}
      </div>

      <div className="flex-1 px-4 py-5">
        <nav className="space-y-1">
          {visibleItems.map((item) => (
            <SidebarItem key={item.to} {...item} onClick={isMobile ? onClose : undefined} />
          ))}
          {/* Users management removed */}
        </nav>
      </div>

      <div className="border-t border-white/8 p-4">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl bg-white/8 px-4 py-3 text-left text-sm font-medium text-white transition hover:bg-white/14"
        >
          <LogOut size={18} className="shrink-0" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
