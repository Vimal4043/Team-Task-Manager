import { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';

const CreateProject = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'planning',
    memberIds: [],
    startDate: '',
    endDate: '',
  });
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loadingProject, setLoadingProject] = useState(isEditMode);

  useEffect(() => {
    const preload = async () => {
      try {
        const requests = [api.get('/users')];
        if (isEditMode) {
          requests.push(api.get(`/projects/${id}`));
        }

        const [usersRes, projectRes] = await Promise.all(requests);
        setUsers(usersRes.data.users || []);

        if (projectRes?.data?.project) {
          const project = projectRes.data.project;
          setForm({
            title: project.title || '',
            description: project.description || '',
            status: project.status || 'planning',
            memberIds: (project.members || []).map((member) => member._id),
            startDate: project.startDate ? new Date(project.startDate).toISOString().slice(0, 10) : '',
            endDate: project.endDate ? new Date(project.endDate).toISOString().slice(0, 10) : '',
          });
        }
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to preload project form');
      } finally {
        setLoadingProject(false);
      }
    };

    preload();
  }, [id, isEditMode]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  useEffect(() => {
    const handlePointerDown = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    const handleKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };

    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKey);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  const submit = async (event) => {
    event.preventDefault();
    try {
      setError('');

      if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate)) {
        setError('Due date must be on or after start date');
        return;
      }

      setSaving(true);

      const payload = {
        ...form,
        startDate: form.startDate || undefined,
        endDate: form.endDate || undefined,
      };

      if (isEditMode) {
        await api.put(`/projects/${id}`, payload);
        navigate(`/projects/${id}`);
      } else {
        await api.post('/projects', payload);
        navigate('/projects');
      }
    } catch (err) {
      setError(err?.response?.data?.message || (isEditMode ? 'Failed to update project' : 'Failed to create project'));
    } finally {
      setSaving(false);
    }
  };

  // preserve original order and keep selected users visible
  const usersWithSelected = users.map((u) => ({ ...u, selected: form.memberIds.includes(u._id) }));
  const filteredUsers = usersWithSelected.filter((u) => {
    const q = search.trim().toLowerCase();
    if (!q) return true;
    return (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q);
  });
  if (loadingProject) {
    return <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm text-sm text-slate-600">Loading project form...</div>;
  }

  return (
    <form onSubmit={submit} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-slate-900">{isEditMode ? 'Edit Project' : 'Create Project'}</h1>
        <button
          type="button"
          onClick={() => navigate('/projects')}
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:bg-white hover:text-slate-900 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-slate-200"
        >
          <span className="text-base leading-none">←</span>
          <span>Back to Projects</span>
        </button>
      </div>
      <input required placeholder="Project name" className="w-full rounded-2xl border border-slate-300 px-3 py-2" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
      <textarea placeholder="Description" className="w-full rounded-2xl border border-slate-300 px-3 py-2" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Start Date</label>
          <input
            type="date"
            value={form.startDate}
            onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))}
            className="w-full rounded-2xl border border-slate-300 px-3 py-2"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700">Due Date</label>
          <input
            type="date"
            value={form.endDate}
            onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))}
            min={form.startDate || undefined}
            className="w-full rounded-2xl border border-slate-300 px-3 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
          <select className="w-full rounded-2xl border border-slate-300 px-3 py-2" value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
            <option value="planning">Planning</option>
            <option value="active">Active</option>
            <option value="on-hold">On Hold</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        {/* Assign Members - rebuilt searchable multi-select */}
        <div className="relative" ref={containerRef}>
          <label className="block text-sm font-medium text-slate-700 mb-2">Assign Members</label>

          <div className="rounded-2xl border border-slate-300 bg-white px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2" onClick={() => inputRef.current?.focus()}>
                  {form.memberIds.map((id) => {
                    const u = users.find((x) => x._id === id);
                    if (!u) return null;
                    return (
                      <span key={id} className="flex items-center gap-2 rounded-full bg-slate-100 px-2 py-1 text-sm text-slate-800">
                        <span className="max-w-40 truncate">{u.name}</span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm((p) => ({ ...p, memberIds: p.memberIds.filter((m) => m !== id) }));
                          }}
                          className="ml-1 rounded-full bg-slate-200 p-0.5 text-xs text-slate-600"
                          aria-label={`Remove ${u.name}`}
                        >
                          ×
                        </button>
                      </span>
                    );
                  })}

                  <input
                    readOnly
                    type="text"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen((v) => !v);
                      // focus the dropdown search when opening
                      setTimeout(() => inputRef.current?.focus(), 0);
                    }}
                    placeholder={form.memberIds.length === 0 ? 'Select members...' : ''}
                    className="min-w-30 flex-1 bg-transparent text-sm outline-none cursor-default"
                  />
                </div>
              </div>

              <div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpen((v) => !v);
                  }}
                  className="ml-2 shrink-0 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                >
                  {open ? 'Close' : 'Select'}
                </button>
              </div>
            </div>
          </div>

          <div
            className={`absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg transition-all duration-150 ease-out ${open ? 'max-h-64 opacity-100 translate-y-0 pointer-events-auto' : 'max-h-0 opacity-0 -translate-y-1 pointer-events-none'
              }`}
          >
            <div className="max-h-64 overflow-auto py-2">
              {/* Search box inside dropdown (sticky) */}
              <div className="sticky top-0 z-10 bg-white px-3 pt-2 pb-2 border-b border-slate-100">
                <input
                  ref={inputRef}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Escape') setOpen(false);
                  }}
                  placeholder="Search by name or email..."
                  className="w-full rounded-md border border-slate-200 px-3 py-2 text-sm outline-none"
                />
              </div>

              <div className="flex items-center justify-between px-3 pb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
                <span>{form.memberIds.length} selected</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setForm((p) => ({ ...p, memberIds: [] }));
                  }}
                  className="text-slate-500 transition hover:text-slate-900"
                >
                  Clear all
                </button>
              </div>

              <ul className="divide-y px-2 pb-2">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const selected = u.selected;
                    return (
                      <li key={u._id}>
                        <button
                          type="button"
                          onClick={() => {
                            setForm((p) => ({
                              ...p,
                              memberIds: selected ? p.memberIds.filter((m) => m !== u._id) : [...p.memberIds, u._id],
                            }));
                          }}
                          className={`flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-slate-50 ${selected ? 'bg-slate-50' : ''}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className={`inline-flex h-4 w-4 items-center justify-center rounded-sm border ${selected ? 'bg-slate-800 border-slate-800' : 'border-slate-300'}`}>
                              {selected ? (
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L4 7L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                              ) : null}
                            </span>
                            <div className="text-left">
                              <div className="font-medium text-slate-800">{u.name}</div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-3 py-3 text-sm text-slate-500">{search ? 'No users found' : 'No members available'}</li>
                )}
              </ul>
            </div>
          </div>
        </div>
      </div>
      {error ? <p className="text-sm text-rose-700">{error}</p> : null}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={saving} className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
          {saving ? (isEditMode ? 'Saving...' : 'Creating...') : (isEditMode ? 'Save Changes' : 'Create Project')}
        </button>
        {isEditMode ? (
          <button
            type="button"
            onClick={() => navigate(`/projects/${id}`)}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
};

export default CreateProject;
