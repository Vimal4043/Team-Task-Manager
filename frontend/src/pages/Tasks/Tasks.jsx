import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import TaskTable from '../../components/Tasks/TaskTable';
import Loader from '../../components/Utils/Loader';
import EmptyState from '../../components/Utils/EmptyState';
import { useAuth } from '../../context/AuthContext';

const Tasks = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '', sortBy: 'dueDate', order: 'asc' });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/tasks');
        setTasks(data.tasks || []);
        setError('');
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchInput.trim().toLowerCase());
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  const filtered = useMemo(() => {
    let nextTasks = [...tasks];

    if (debouncedSearch) {
      nextTasks = nextTasks.filter((task) => task.title.toLowerCase().includes(debouncedSearch));
    }

    if (filters.status) {
      nextTasks = nextTasks.filter((task) => task.status === filters.status);
    }

    if (filters.priority) {
      nextTasks = nextTasks.filter((task) => task.priority === filters.priority);
    }

    nextTasks.sort((a, b) => {
      const first = a?.[filters.sortBy];
      const second = b?.[filters.sortBy];

      if (filters.sortBy === 'dueDate') {
        const firstDate = new Date(first).getTime();
        const secondDate = new Date(second).getTime();
        return filters.order === 'desc' ? secondDate - firstDate : firstDate - secondDate;
      }

      const firstValue = String(first || '').toLowerCase();
      const secondValue = String(second || '').toLowerCase();
      if (firstValue < secondValue) return filters.order === 'desc' ? 1 : -1;
      if (firstValue > secondValue) return filters.order === 'desc' ? -1 : 1;
      return 0;
    });

    return nextTasks;
  }, [tasks, debouncedSearch, filters.status, filters.priority, filters.sortBy, filters.order]);

  const isInitialLoading = loading && tasks.length === 0;

  if (isInitialLoading) return <Loader label="Loading tasks..." />;

  return (
    <section className="space-y-5 min-w-0">
      <div className="grid gap-2 md:grid-cols-5">
        <input value={searchInput} onChange={(e) => setSearchInput(e.target.value)} placeholder="Search tasks" className="rounded-2xl border border-slate-300 px-3 py-2 text-sm" />
        <select value={filters.status} onChange={(e) => setFilters((p) => ({ ...p, status: e.target.value }))} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">All status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <select value={filters.priority} onChange={(e) => setFilters((p) => ({ ...p, priority: e.target.value }))} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">All priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
        <select value={filters.order} onChange={(e) => setFilters((p) => ({ ...p, order: e.target.value }))} className="rounded-2xl border border-slate-300 px-3 py-2 text-sm">
          <option value="asc">Due date asc</option>
          <option value="desc">Due date desc</option>
        </select>
        {user?.role === 'admin' ? (
          <button type="button" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white" onClick={() => navigate('/tasks/create')}>
            Create Task
          </button>
        ) : null}
      </div>
      {error ? <EmptyState title="Tasks unavailable" message={error} /> : null}
      {!filtered.length && !error ? <EmptyState title="No tasks" message="Adjust filters or create a new task." /> : null}
      {filtered.length ? <TaskTable tasks={filtered} onSelect={(task) => navigate(`/tasks/${task._id}`)} /> : null}
    </section>
  );
};

export default Tasks;
