import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

const CreateTask = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingForm, setLoadingForm] = useState(isEditMode);
  const [form, setForm] = useState({
    title: '',
    description: '',
    assignedTo: '',
    project: '',
    priority: 'medium',
    status: 'todo',
    dueDate: '',
  });

  useEffect(() => {
    const preload = async () => {
      try {
        const requests = [api.get('/projects')];

        if (!isEditMode || user?.role === 'admin') {
          requests.push(api.get('/users'));
        }

        if (isEditMode) {
          requests.push(api.get(`/tasks/${id}`));
        }

        const [projectsRes, usersRes, taskRes] = await Promise.all(requests);
        setProjects(projectsRes.data.projects || []);
        setUsers(usersRes?.data?.users || []);

        if (taskRes?.data?.task) {
          const task = taskRes.data.task;
          setForm({
            title: task.title || '',
            description: task.description || '',
            assignedTo: task.assignedTo?._id || '',
            project: task.project?._id || '',
            priority: task.priority || 'medium',
            status: task.status || 'todo',
            dueDate: task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : '',
          });
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to preload form data');
      } finally {
        setLoadingForm(false);
      }
    };

    preload();
  }, [id, isEditMode, user?.role]);

  const eligibleUsers = (() => {
    if (!form.project) return users;
    const project = projects.find((p) => p._id === form.project);
    if (!project || !project.members) return [];
    const memberIds = project.members.map((m) => (m._id ? String(m._id) : String(m)));
    return users.filter((u) => memberIds.includes(String(u._id)));
  })();

  const submit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);
      setError('');

      if (isEditMode) {
        const payload = {
          title: form.title,
          description: form.description,
          priority: form.priority,
          status: form.status,
          dueDate: form.dueDate,
        };

        if (user?.role === 'admin') {
          payload.assignedTo = form.assignedTo;
          payload.project = form.project;
        }

        await api.put(`/tasks/${id}`, payload);
        navigate(`/tasks/${id}`);
      } else {
        await api.post('/tasks', form);
        navigate('/tasks');
      }
    } catch (err) {
      setError(err?.response?.data?.message || (isEditMode ? 'Failed to update task' : 'Failed to create task'));
    } finally {
      setSaving(false);
    }
  };

  if (loadingForm) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-600">Loading task form...</div>;
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h1 className="text-lg font-semibold text-slate-900">{isEditMode ? 'Edit Task' : 'Create Task'}</h1>
      <input required placeholder="Task title" className="w-full rounded-2xl border border-slate-300 px-3 py-2" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      <textarea placeholder="Description" className="w-full rounded-2xl border border-slate-300 px-3 py-2" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      {(!isEditMode || user?.role === 'admin') ? (
        <>
          <select required value={form.project} className="w-full rounded-2xl border border-slate-300 px-3 py-2" onChange={(e) => setForm((p) => ({ ...p, project: e.target.value }))}>
            <option value="">Select project</option>
            {projects.map((project) => <option key={project._id} value={project._id}>{project.title}</option>)}
          </select>
          <select required value={form.assignedTo} className="w-full rounded-2xl border border-slate-300 px-3 py-2" onChange={(e) => setForm((p) => ({ ...p, assignedTo: e.target.value }))}>
            <option value="">Assign user</option>
            {eligibleUsers.map((u) => <option key={u._id} value={u._id}>{u.name}</option>)}
          </select>
        </>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        <select value={form.priority} className="rounded-2xl border border-slate-300 px-3 py-2" onChange={(e) => setForm((p) => ({ ...p, priority: e.target.value }))}>
          <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="critical">Critical</option>
        </select>
        <select value={form.status} className="rounded-2xl border border-slate-300 px-3 py-2" onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
          <option value="todo">Todo</option><option value="in-progress">In Progress</option><option value="completed">Completed</option>
        </select>
        <input type="date" required value={form.dueDate} className="rounded-2xl border border-slate-300 px-3 py-2" onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))} />
      </div>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">{saving ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Task')}</button>
    </form>
  );
};

export default CreateTask;
