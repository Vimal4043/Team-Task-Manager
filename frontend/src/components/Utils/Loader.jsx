const Loader = ({ label = 'Loading...' }) => {
  return (
    <div className="flex min-h-[35vh] items-center justify-center">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-3 shadow-sm">
        <span className="inline-block h-3 w-3 animate-ping rounded-full bg-amber-500" />
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
    </div>
  );
};

export default Loader;
