import StatCard from '../Cards/StatCard';

const KpiGrid = ({ stats }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      <StatCard label="Projects" value={stats.totalProjects || 0} tone="indigo" />
      <StatCard label="Total Tasks" value={stats.totalTasks || 0} tone="cyan" />
      <StatCard label="Completed" value={stats.completedTasks || 0} tone="emerald" />
      <StatCard label="Pending" value={stats.pendingTasks || 0} tone="amber" />
      <StatCard label="Overdue" value={stats.overdueTasks || 0} tone="rose" />
    </div>
  );
};

export default KpiGrid;
