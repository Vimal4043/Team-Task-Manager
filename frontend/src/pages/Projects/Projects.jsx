import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import ProjectCard from '../../components/Projects/ProjectCard';
import Loader from '../../components/Utils/Loader';
import EmptyState from '../../components/Utils/EmptyState';
import { useAuth } from '../../context/AuthContext';

const Projects = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
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

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => project.title.toLowerCase().includes(query.toLowerCase()));
  }, [projects, query]);

  if (loading) return <Loader label="Loading projects..." />;

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <input
          placeholder="Search projects..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full max-w-sm rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none ring-cyan-500 focus:ring"
        />
        {user?.role === 'admin' ? (
          <Link to="/projects/create" className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white">
            New Project
          </Link>
        ) : null}
      </div>
      {error ? <EmptyState title="Projects unavailable" message={error} /> : null}
      {!filteredProjects.length && !error ? <EmptyState title="No projects found" message="Create one to get started." /> : null}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filteredProjects.map((project) => (
          <ProjectCard key={project._id} project={project} />
        ))}
      </div>
    </section>
  );
};

export default Projects;
