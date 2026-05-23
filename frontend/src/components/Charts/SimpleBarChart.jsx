const SimpleBarChart = ({ title, data = [], labelKey, valueKey }) => {
  const max = Math.max(...data.map((item) => item[valueKey]), 1);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">{title}</h3>
      <div className="mt-5 space-y-3">
        {data.map((item) => {
          const width = `${Math.round((item[valueKey] / max) * 100)}%`;
          return (
            <div key={item[labelKey]}>
              <div className="mb-1 flex justify-between text-xs text-slate-600">
                <span>{item[labelKey]}</span>
                <span>{item[valueKey]}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-amber-400" style={{ width }} />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SimpleBarChart;
