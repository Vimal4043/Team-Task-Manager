import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../../api/axios';
import DashboardSkeleton from '../../components/Dashboard/DashboardSkeleton';
import StatsGrid from '../../components/Dashboard/StatsGrid';
import TaskTable from '../../components/Tasks/TaskTable';
import EmptyState from '../../components/Utils/EmptyState';

const Dashboard = () => {
  const { searchValue = '' } = useOutletContext() || {};
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        // Fetch tasks (for list + recent activity)
        const tasksPromise = api.get('/tasks', { params: { sortBy: 'dueDate', order: 'asc' } });

        // Fetch projects and teams (stats)

        const projectsPromise = api.get('/projects');
        const usersPromise = api.get('/users');

        const [tasksResponse, projectsResponse, usersResponse] = await Promise.all([
          tasksPromise,
          projectsPromise,
          usersPromise,
        ]);

        const tasksData = tasksResponse.data.tasks || [];
        const projectsData = projectsResponse.data.projects || [];
        const usersData = usersResponse.data.users || [];

        // Derive unique teams from users' teams arrays
        const teamIds = new Set();
        usersData.forEach((u) => {
          if (Array.isArray(u.teams)) {
            u.teams.forEach((t) => teamIds.add(String(t._id || t)));
          }
        });
        const teamsData = Array.from(teamIds);

        // Compute basic stats similar to previous /dashboard response
        const totalTasks = tasksData.length;
        const completedTasks = tasksData.filter((t) => t.status === 'completed').length;
        const pendingTasks = tasksData.filter((t) => t.status !== 'completed').length;
        const overdueTasks = tasksData.filter((t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length;

        setData({
          stats: {
            totalTasks,
            completedTasks,
            pendingTasks,
            overdueTasks,
            totalProjects: projectsData.length,
            totalTeams: teamsData.length,
            totalUsers: null,
          },
        });

        setTasks(tasksData || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = useMemo(
    () => [
      { title: 'Total Tasks', value: data?.stats?.totalTasks ?? 0, description: 'All workspace tasks', accent: 'cyan' },
      { title: 'Completed', value: data?.stats?.completedTasks ?? 0, description: 'Finished work items', accent: 'emerald' },
      { title: 'Pending', value: data?.stats?.pendingTasks ?? 0, description: 'Still in motion', accent: 'amber' },
      { title: 'Overdue', value: data?.stats?.overdueTasks ?? 0, description: 'Needs attention', accent: 'rose' },
    ],
    [data],
  );

  const visibleTasks = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return tasks;
    }

    return tasks.filter((task) => {
      const projectTitle = task.project?.title || '';
      const assignee = task.assignedTo?.name || '';
      return [task.title, task.status, task.priority, projectTitle, assignee]
        .join(' ')
        .toLowerCase()
        .includes(query);
    });
  }, [searchValue, tasks]);

  const upcomingDeadlines = useMemo(
    () =>
      [...tasks]
        .filter((task) => task.status !== 'completed')
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 4),
    [tasks],
  );

  if (loading) return <DashboardSkeleton />;
  if (error) return <EmptyState title="Dashboard unavailable" message={error} />;

  return (
    <div className="space-y-6 pb-4">
      <StatsGrid stats={stats} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <section className="min-w-0 space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Recent Tasks</h3>
              {/* <p className="mt-1 text-sm text-slate-500">Latest items from the live task feed</p> */}
            </div>
          </div>
          <TaskTable tasks={visibleTasks.slice(0, 8)} onSelect={(task) => navigate(`/tasks/${task._id}`)} />
        </section>

        <div className="space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_40px_-28px_rgba(15,23,42,0.45)] xl:mt-8">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Upcoming Deadlines</h3>
            <div className="mt-5 space-y-3">
              {upcomingDeadlines.map((task) => (
                <article key={task._id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{task.title}</p>
                      <p className="mt-1 text-sm text-slate-600">
                        Due {new Date(task.dueDate).toLocaleDateString()} · {task.assignedTo?.name || 'Unassigned'}
                      </p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-800">
                      {task.priority}
                    </span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
