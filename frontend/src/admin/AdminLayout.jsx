import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const AdminLayout = () => {
  return (
    <section className="grid gap-5 lg:grid-cols-[260px_1fr]">
      <Sidebar />
      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <Outlet />
      </div>
    </section>
  );
};

export default AdminLayout;
