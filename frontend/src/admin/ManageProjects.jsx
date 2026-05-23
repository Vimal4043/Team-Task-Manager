import { useEffect, useState } from 'react';
import api from '../api/axios';
import Loader from '../components/Utils/Loader';
import EmptyState from '../components/Utils/EmptyState';

const ManageProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data } = await api.get('/projects');
        setProjects(data.projects || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to fetch projects');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const removeProject = async (id) => {
    await api.delete(`/projects/${id}`);
    const { data } = await api.get('/projects');
    setProjects(data.projects || []);
  };

  if (loading) return <Loader label="Loading projects..." />;
  if (error) return <EmptyState title="Projects unavailable" message={error} />;

  return (
    <div className="space-y-3">
      <h1 className="text-lg font-semibold text-slate-900">Manage Projects</h1>
      {projects.map((project) => (
        <article key={project._id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 p-3">
          <div>
            <p className="font-semibold text-slate-800">{project.title}</p>
            <p className="text-sm text-slate-600">{project.status} - {project.progress}%</p>
          </div>
          <button type="button" className="rounded-full bg-rose-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.1em] text-white" onClick={() => removeProject(project._id)}>
            Delete
          </button>
        </article>
      ))}
    </div>
  );
};

export default ManageProjects;
