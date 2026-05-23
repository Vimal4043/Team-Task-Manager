import { NavLink } from 'react-router-dom';

const SidebarItem = ({ to, icon: Icon, label, end = false, onClick }) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
          isActive
            ? 'bg-white text-slate-950 shadow-lg shadow-cyan-950/20'
            : 'text-slate-300 hover:bg-white/8 hover:text-white'
        }`
      }
    >
      <Icon size={18} className="shrink-0 opacity-90 transition-transform duration-200 group-hover:scale-110" />
      <span>{label}</span>
    </NavLink>
  );
};

export default SidebarItem;
