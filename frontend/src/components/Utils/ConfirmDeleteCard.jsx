const ConfirmDeleteCard = ({ open, title, message, confirmLabel = 'Delete', cancelLabel = 'Cancel', onConfirm, onCancel, loading = false }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm" role="presentation" onClick={onCancel}>
      <div
        className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        aria-describedby="delete-confirm-message"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-full bg-rose-100 text-rose-700">
            !
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="delete-confirm-title" className="text-lg font-semibold text-slate-900">
              {title}
            </h2>
            <p id="delete-confirm-message" className="mt-1 text-sm leading-6 text-slate-600">
              {message}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-700 transition hover:bg-slate-50"
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Deleting...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteCard;