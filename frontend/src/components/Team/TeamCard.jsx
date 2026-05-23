const TeamCard = ({ team }) => {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">{team.name}</h3>
      <p className="mt-1 text-sm text-slate-600">{team.description || 'No description'}</p>
      <div className="mt-4 flex items-center gap-2 text-xs text-slate-500">
        <span>{team.members?.length || 0} members</span>
        <span className="h-1 w-1 rounded-full bg-slate-300" />
        <span>{team.projects?.length || 0} projects</span>
      </div>
    </article>
  );
};

export default TeamCard;
