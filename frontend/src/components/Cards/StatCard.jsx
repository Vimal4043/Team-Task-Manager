const StatCard = ({ label, value, tone = 'amber' }) => {
  const toneMap = {
    amber: 'from-amber-500 to-amber-300',
    cyan: 'from-cyan-500 to-cyan-300',
    rose: 'from-rose-500 to-rose-300',
    emerald: 'from-emerald-500 to-emerald-300',
  };

  return (
    <article className="rounded-3xl border border-white/50 bg-white p-5 shadow-sm">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <div className="mt-3 flex items-end justify-between">
        <p className="text-3xl font-semibold text-slate-900">{value}</p>
        <span className={`h-2 w-20 rounded-full bg-gradient-to-r ${toneMap[tone]}`} />
      </div>
    </article>
  );
};

export default StatCard;
