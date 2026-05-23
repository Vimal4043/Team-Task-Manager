const EmptyState = ({ title, message }) => {
  return (
    <div className="rounded-3xl border border-dashed border-slate-300 bg-white/75 p-8 text-center">
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      <p className="mt-2 text-sm text-slate-700">{message}</p>
    </div>
  );
};

export default EmptyState;
