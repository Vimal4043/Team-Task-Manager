import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { user } = useAuth();

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">Settings</h1>
      <p className="mt-2 text-sm text-slate-600">Your account and workspace settings overview.</p>
      <div className="mt-4 space-y-1 text-sm text-slate-700">
        <p>Name: {user?.name}</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
    </section>
  );
};

export default Settings;
