import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Utils/Loader';
import EmptyState from '../../components/Utils/EmptyState';
import { useAuth } from '../../context/AuthContext';

const TaskDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [comment, setComment] = useState('');

  const currentUserId = user?._id || user?.id;
  const canEdit =
    user?.role === 'admin' ||
    currentUserId === task?.assignedTo?._id ||
    currentUserId === task?.createdBy?._id;
  const canDelete = user?.role === 'admin';

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const { data } = await api.get(`/tasks/${id}`);
        setTask(data.task);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch task');
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const refreshTask = async () => {
    const { data } = await api.get(`/tasks/${id}`);
    setTask(data.task);
  };

  const updateStatus = async (status) => {
    try {
      setActionError('');
      await api.put(`/tasks/${id}`, { status });
      refreshTask();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to update status');
    }
  };

  const addComment = async (event) => {
    event.preventDefault();
    if (!comment.trim()) return;
    try {
      setActionError('');
      await api.put(`/tasks/${id}`, { comment });
      setComment('');
      refreshTask();
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to add comment');
    }
  };

  const deleteTask = async () => {
    if (!canDelete || !task) return;

    const confirmed = window.confirm(`Delete task "${task.title}"? This action cannot be undone.`);
    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setActionError('');
      await api.delete(`/tasks/${id}`);
      navigate('/tasks');
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to delete task');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading task..." />;
  if (error) return <EmptyState title="Task unavailable" message={error} />;

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">{task.title}</h1>
        <div className="flex items-center gap-2">
          <select value={task.status} onChange={(e) => updateStatus(e.target.value)} className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          {canEdit ? (
            <button
              type="button"
              onClick={() => {
                setActionError('');
                navigate(`/tasks/${id}/edit`);
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700"
            >
              Edit
            </button>
          ) : null}

          {canDelete ? (
            <button
              type="button"
              onClick={deleteTask}
              disabled={isDeleting}
              className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </button>
          ) : null}
        </div>
      </div>

      <p className="text-sm text-slate-600">{task.description || 'No description'}</p>
      <div className="grid gap-2 text-sm sm:grid-cols-3">
        <div>Priority: <span className="font-semibold">{task.priority}</span></div>
        <div>Assignee: <span className="font-semibold">{task.assignedTo?.name}</span></div>
        <div>Due: <span className="font-semibold">{new Date(task.dueDate).toLocaleDateString()}</span></div>
      </div>

      {actionError ? <p className="text-sm text-rose-700">{actionError}</p> : null}

      <form onSubmit={addComment} className="space-y-2">
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} className="w-full rounded-2xl border border-slate-300 px-3 py-2" placeholder="Add a comment..." />
        <button type="submit" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">Add Comment</button>
      </form>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Activity</h2>
        <div className="mt-2 space-y-2">
          {(task.activityHistory || []).map((item) => (
            <article key={item._id} className="rounded-2xl bg-slate-50 p-2 text-sm">
              <p className="font-medium text-slate-700">{item.action}</p>
              <p className="text-xs text-slate-500">{new Date(item.createdAt).toLocaleString()}</p>
            </article>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Comments</h2>
        <div className="mt-2 space-y-2">
          {(task.comments || []).map((item) => (
            <article key={item._id} className="rounded-2xl bg-cyan-50 p-2 text-sm">
              <p className="font-medium text-slate-800">{item.user?.name}</p>
              <p className="text-slate-700">{item.message}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TaskDetails;
