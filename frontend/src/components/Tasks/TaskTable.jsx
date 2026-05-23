const TaskTable = ({ tasks, onSelect }) => {
  return (
    <div className="overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
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
                <span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold uppercase text-slate-700">{task.priority}</span>
              </td>
              <td className="px-4 py-3">
                <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold uppercase text-amber-700">{task.status}</span>
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
