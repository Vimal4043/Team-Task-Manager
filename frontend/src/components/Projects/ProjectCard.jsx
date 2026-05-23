import { Link } from 'react-router-dom';

const ProjectCard = ({ project }) => {
  const dueDateText = project.endDate ? new Date(project.endDate).toLocaleDateString() : 'No due date';

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
        <span className="rounded-full bg-cyan-100 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-cyan-700">
          {project.status}
        </span>
      </div>
      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{project.description || 'No description'}</p>
      <div className="mt-4">
        <div className="mb-1 flex justify-between text-xs text-slate-500">
          <span>Progress</span>
          <span>{project.progress || 0}%</span>
        </div>
        <div className="h-2 rounded-full bg-slate-100">
          <div className="h-full rounded-full bg-linear-to-r from-cyan-500 to-amber-400" style={{ width: `${project.progress || 0}%` }} />
        </div>
      </div>
      <p className="mt-3 text-xs font-medium text-slate-500">Due: {dueDateText}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-slate-500">
        <span>{project.members?.length || 0} members</span>
        <Link to={`/projects/${project._id}`} className="font-semibold text-cyan-700 hover:text-cyan-900">
          View details
        </Link>
      </div>
    </article>
  );
};

export default ProjectCard;
