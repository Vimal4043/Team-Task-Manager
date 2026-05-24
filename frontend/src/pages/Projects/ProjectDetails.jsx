import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../api/axios';
import Loader from '../../components/Utils/Loader';
import EmptyState from '../../components/Utils/EmptyState';
import ConfirmDeleteCard from '../../components/Utils/ConfirmDeleteCard';
import { useAuth } from '../../context/AuthContext';

const ProjectDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const { data } = await api.get(`/projects/${id}`);
        setProject(data.project);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch project');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  const tasks = useMemo(() => project?.tasks || [], [project]);
  const startDateText = project?.startDate ? new Date(project.startDate).toLocaleDateString() : 'Not set';
  const dueDateText = project?.endDate ? new Date(project.endDate).toLocaleDateString() : 'Not set';

  const handleDelete = async () => {
    if (!isAdmin || !project) return;

    try {
      setIsDeleting(true);
      setActionError('');
      setShowDeleteConfirm(false);
      await api.delete(`/projects/${id}`);
      navigate('/projects');
    } catch (err) {
      setActionError(err?.response?.data?.message || 'Failed to delete project');
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <Loader label="Loading project..." />;
  if (error) return <EmptyState title="Project unavailable" message={error} />;

  return (
    <section className="space-y-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-slate-900">{project.title}</h1>
        {isAdmin ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Back to Projects
            </button>
            <button
              type="button"
              onClick={() => navigate('/tasks/create', { state: { project: project._id } })}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700"
            >
              Add Task
            </button>
            <button
              type="button"
              onClick={() => {
                setActionError('');
                navigate(`/projects/${id}/edit`);
              }}
              className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => {
                setActionError('');
                setShowDeleteConfirm(true);
              }}
              disabled={isDeleting}
              className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-70"
            >
              Delete
            </button>
          </div>
        ) : null}
      </div>

      <p className="text-sm text-slate-600">{project.description || 'No description provided.'}</p>
      <div className="text-sm text-slate-700">Status: <span className="font-semibold">{project.status}</span></div>
        <div className="text-sm text-slate-700">Start Date: <span className="font-semibold">{startDateText}</span></div>
        <div className="text-sm text-slate-700">Due Date: <span className="font-semibold">{dueDateText}</span></div>

      {actionError ? <p className="text-sm text-rose-700">{actionError}</p> : null}

      <div className="text-sm text-slate-700">Progress: <span className="font-semibold">{project.progress}%</span></div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Members</h2>
        <div className="mt-2 flex flex-wrap gap-2">
          {(project.members || []).map((member) => (
            <span key={member._id} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              {member.name}
            </span>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-slate-500">Tasks</h2>
        <div className="mt-2 space-y-2">
          {tasks.map((task) => (
            <article key={task._id} className="rounded-2xl bg-slate-50 p-3 text-sm">
              <p className="font-semibold text-slate-800">{task.title}</p>
              <p className="text-slate-600">{task.status} - {task.priority}</p>
            </article>
          ))}
        </div>
      </div>

      <ConfirmDeleteCard
        open={showDeleteConfirm}
        title={`Delete project "${project.title}"?`}
        message="This action cannot be undone. The project and its related data will be removed from the workspace."
        confirmLabel="Delete project"
        onCancel={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        loading={isDeleting}
      />
    </section>
  );
};

export default ProjectDetails;
