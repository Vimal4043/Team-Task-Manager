const TaskTable = ({ tasks, onSelect }) => {
  const getStatusStyles = (status) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
      case 'in-progress':
        return 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200';
      case 'completed':
        return 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case 'low':
        return 'bg-emerald-100 text-emerald-800 ring-1 ring-inset ring-emerald-200';
      case 'medium':
        return 'bg-sky-100 text-sky-800 ring-1 ring-inset ring-sky-200';
      case 'high':
        return 'bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200';
      case 'critical':
        return 'bg-rose-100 text-rose-800 ring-1 ring-inset ring-rose-200';
      default:
        return 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200';
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-190 w-full lg:min-w-0 divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Task</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Project</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Assignee</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Priority</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
            <th className="px-4 py-3 text-left font-semibold text-slate-600">Due Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {tasks.map((task) => (
            <tr key={task._id} className="cursor-pointer hover:bg-cyan-50" onClick={() => onSelect(task)}>
              <td className="px-4 py-3 font-medium text-slate-800">{task.title}</td>
              <td className="px-4 py-3 text-slate-600">{task.project?.title || 'Unknown'}</td>
              <td className="px-4 py-3 text-slate-600">{task.assignedTo?.name || 'Unassigned'}</td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${getPriorityStyles(task.priority)}`}>
                  {task.priority}
                </span>
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${getStatusStyles(task.status)}`}>
                  {task.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{new Date(task.dueDate).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
