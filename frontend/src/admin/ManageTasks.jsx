import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Utils/Loader';
import EmptyState from '../components/Utils/EmptyState';

const ManageTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data } = await api.get('/tasks');
        setTasks(data.tasks || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const removeTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    const { data } = await api.get('/tasks');
    setTasks(data.tasks || []);
  };

  if (loading) return <Loader label="Loading tasks..." />;
  if (error) return <EmptyState title="Tasks unavailable" message={error} />;

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-slate-900">Manage Tasks</h1>
      {tasks.map((task) => (
        <article key={task._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 p-3">
          <div>
            <p className="font-semibold text-slate-800">{task.title}</p>
            <p className="text-sm text-slate-600">{task.status} - {task.priority}</p>
          </div>
          <button type="button" className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white" onClick={() => removeTask(task._id)}>
            Delete
          </button>
        </article>
      ))}
    </div>
  );
};

export default ManageTasks;
