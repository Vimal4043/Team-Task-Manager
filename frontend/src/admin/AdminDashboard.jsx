import { useEffect, useState } from 'react';
import api from '../api/axios';
import KpiGrid from '../components/Dashboard/KpiGrid';
import Loader from '../components/Utils/Loader';
import EmptyState from '../components/Utils/EmptyState';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const [tasksRes, projectsRes, usersRes] = await Promise.all([
          api.get('/tasks'),
          api.get('/projects'),
          api.get('/users'),
        ]);

        const tasks = tasksRes.data.tasks || [];
        const projects = projectsRes.data.projects || [];
        const users = usersRes.data.users || [];

        // Derive unique teams from users' teams arrays
        const teamIds = new Set();
        users.forEach((u) => {
          if (Array.isArray(u.teams)) {
            u.teams.forEach((t) => teamIds.add(String(t._id || t)));
          }
        });
        const teams = Array.from(teamIds);

        const statsPayload = {
          totalTasks: tasks.length,
          completedTasks: tasks.filter((t) => t.status === 'completed').length,
          pendingTasks: tasks.filter((t) => t.status !== 'completed').length,
          overdueTasks: tasks.filter((t) => t.status !== 'completed' && new Date(t.dueDate) < new Date()).length,
          totalProjects: projects.length,
          totalTeams: teams.length,
          totalUsers: users.length,
        };

        setStats(statsPayload);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load admin dashboard');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading) return <Loader label="Loading admin dashboard..." />;
  if (error) return <EmptyState title="Admin dashboard unavailable" message={error} />;

  return <KpiGrid stats={stats || {}} />;
};

export default AdminDashboard;
