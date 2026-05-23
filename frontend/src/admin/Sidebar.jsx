import { NavLink } from 'react-router-dom';

const linkClass = ({ isActive }) =>
  `block rounded-xl px-3 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-white text-slate-900' : 'text-slate-100 hover:bg-white/20'
  }`;

const Sidebar = () => {
  return (
    <aside className="rounded-3xl bg-linear-to-b from-cyan-700 to-slate-900 p-4 text-white">
      <h2 className="mb-4 text-xs uppercase tracking-[0.2em] text-cyan-200">Admin Control</h2>
      <div className="space-y-2">
        <NavLink to="/admin" end className={linkClass}>
          Overview
        </NavLink>
        <NavLink to="/admin/projects" className={linkClass}>
          Manage Projects
        </NavLink>
        <NavLink to="/admin/tasks" className={linkClass}>
          Manage Tasks
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
