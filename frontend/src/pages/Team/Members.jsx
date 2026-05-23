import { useEffect, useState } from 'react';
import api from '../../api/axios';
import EmptyState from '../../components/Utils/EmptyState';
import Loader from '../../components/Utils/Loader';

const Members = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
      <h1 className="mb-4 text-lg font-semibold text-slate-900">Workspace Members</h1>
      <div className="space-y-2">
        {users.map((user) => (
          <article key={user._id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-sm">
            <div>
              <p className="font-semibold text-slate-800">{user.name}</p>
              <p className="text-slate-500">{user.email}</p>
            </div>
            <span className="rounded-full bg-slate-200 px-2 py-1 text-xs font-semibold uppercase text-slate-700">{user.role}</span>
          </article>
        ))}
      </div>
    </section>
  );
};

export default Members;
