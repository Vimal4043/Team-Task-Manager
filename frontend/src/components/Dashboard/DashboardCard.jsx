const DashboardCard = ({ title, value, description, accent = 'cyan' }) => {
  const accents = {
    cyan: 'from-cyan-500 to-cyan-300',
    amber: 'from-amber-500 to-amber-300',
    emerald: 'from-emerald-500 to-emerald-300',
    rose: 'from-rose-500 to-rose-300',
    indigo: 'from-indigo-500 to-indigo-300',
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className={`h-1.5 w-16 rounded-full bg-linear-to-r ${accents[accent] || accents.cyan}`} />
      <p className="mt-4 text-sm font-medium uppercase tracking-[0.22em] text-slate-500">{title}</p>
      <div className="mt-3 flex items-end justify-between gap-4">
        <span className="text-3xl font-semibold tracking-tight text-slate-950">{value}</span>
        {description ? <span className="text-xs text-slate-500">{description}</span> : null}
      </div>
    </article>
  );
};

export default DashboardCard;
