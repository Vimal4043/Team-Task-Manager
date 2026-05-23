const AuthForm = ({ title, subtitle, fields, values, onChange, onSubmit, loading, error, submitLabel, footer }) => {
  return (
    <section className="mx-auto w-full max-w-md rounded-3xl border border-white/60 bg-white/85 p-7 shadow-xl backdrop-blur-sm">
      <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
      <form className="mt-6 space-y-4" onSubmit={onSubmit}>
        {fields.map((field) => (
          <label key={field.name} className="block">
            <span className="mb-1 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">{field.label}</span>
            {field.type === 'select' ? (
              <select
                name={field.name}
                value={values[field.name]}
                onChange={onChange}
                required={field.required}
                className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-500 focus:ring"
              >
                {field.options?.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                name={field.name}
                value={values[field.name]}
                onChange={onChange}
                required={field.required}
                className="w-full rounded-2xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none ring-cyan-500 focus:ring"
              />
            )}
          </label>
        ))}
        {error ? <p className="rounded-xl bg-rose-50 p-2 text-sm text-rose-700">{error}</p> : null}
        <button
          disabled={loading}
          type="submit"
          className="w-full rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold uppercase tracking-[0.12em] text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Please wait...' : submitLabel}
        </button>
      </form>
      <div className="mt-4 text-sm text-slate-600">{footer}</div>
    </section>
  );
};

export default AuthForm;
