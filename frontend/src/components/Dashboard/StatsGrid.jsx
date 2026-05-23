import DashboardCard from './DashboardCard';

const StatsGrid = ({ stats = [] }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <DashboardCard key={stat.title} {...stat} />
      ))}
    </div>
  );
};

export default StatsGrid;
