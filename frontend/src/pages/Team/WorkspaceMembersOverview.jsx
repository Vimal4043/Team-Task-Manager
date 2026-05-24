import { useEffect, useState } from 'react';
import { FolderKanban, Mail, Search, UserCheck, Users } from 'lucide-react';
import api from '../../api/axios';
import EmptyState from '../../components/Utils/EmptyState';
import Loader from '../../components/Utils/Loader';

const WorkspaceMembersOverview = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await api.get('/users');
        setUsers(data.users || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Only admins can view members list');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <Loader label="Loading members..." />;
  if (error) return <EmptyState title="Members unavailable" message={error} />;

  const normalizedSearch = searchTerm.trim().toLowerCase();
  const visibleUsers = normalizedSearch
    ? users.filter((user) => {
        const haystack = [user.name, user.email, user.role].join(' ').toLowerCase();
        return haystack.includes(normalizedSearch);
      })
    : users;

  return (
    <section className="space-y-6 pb-4">
      <div className="rounded-4xl border border-slate-200 bg-white/90 p-5 shadow-[0_20px_70px_-40px_rgba(15,23,42,0.45)] backdrop-blur sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-cyan-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-800">
              <Users size={14} />
              Workspace Members Overview
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">Workspace Members Overview</h1>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-sm shadow-slate-200">
              <Users size={18} />
            </span>
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-slate-500">Total members</p>
              <p className="text-lg font-semibold text-slate-950">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 lg:grid-cols-[1fr_auto] lg:items-center">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm shadow-slate-100 transition focus-within:border-cyan-300 focus-within:bg-white">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search members by name, email, or role"
              className="w-full bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
            />
          </label>

          <div className="flex items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-sm shadow-slate-100 lg:min-w-52">
            <span>Showing</span>
            <span className="font-semibold text-slate-950">
              {visibleUsers.length} / {users.length}
            </span>
          </div>
        </div>
      </div>

      {visibleUsers.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibleUsers.map((user) => (
            <article
              key={user._id}
              className="group rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_16px_48px_-36px_rgba(15,23,42,0.45)] transition duration-200 hover:-translate-y-0.5 hover:border-cyan-200 hover:shadow-[0_24px_60px_-34px_rgba(15,23,42,0.55)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-100 to-sky-50 text-sm font-semibold text-cyan-900">
                      {user.name?.slice(0, 1)?.toUpperCase() || '?'}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-base font-semibold text-slate-950">{user.name}</p>
                      <div className="mt-1 flex items-center gap-2 text-sm text-slate-500">
                        <Mail size={14} className="shrink-0" />
                        <span className="truncate">{user.email}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${
                    user.role === 'admin'
                      ? 'bg-cyan-100 text-cyan-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {user.role === 'admin' ? 'Admin' : 'Member'}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    <UserCheck size={14} />
                    Tasks
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{user.taskCount || 0}</p>
                </div>

                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                    <FolderKanban size={14} />
                    Projects
                  </div>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{user.projectCount || 0}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <EmptyState title="No matching members" message="Try a different search term to find a workspace member." />
      )}
    </section>
  );
};

export default WorkspaceMembersOverview;