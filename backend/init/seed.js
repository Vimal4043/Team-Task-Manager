import dotenv from 'dotenv';
import connectDB from '../config/db.js';
import User from '../models/User.js';
import Team from '../models/Team.js';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import { sampleUsers, sampleTeam, sampleProject, sampleTasks } from './sampleData.js';

dotenv.config();

const runSeed = async () => {
  try {
    await connectDB();

    await Promise.all([
      Task.deleteMany({}),
      Project.deleteMany({}),
      Team.deleteMany({}),
      User.deleteMany({}),
    ]);

    const createdUsers = await User.insertMany(sampleUsers);
    const admin = createdUsers.find((u) => u.role === 'admin');
    const member = createdUsers.find((u) => u.role === 'member');

    const team = await Team.create({
      ...sampleTeam,
      members: [
        { user: admin._id, role: 'admin' },
        { user: member._id, role: 'member' },
      ],
      createdBy: admin._id,
    });

    const project = await Project.create({
      ...sampleProject,
      members: [admin._id, member._id],
      team: team._id,
      createdBy: admin._id,
    });

    const tasks = await Task.insertMany(
      sampleTasks.map((task) => ({
        title: task.title,
        description: task.description,
        assignedTo: member._id,
        project: project._id,
        priority: task.priority,
        status: task.status,
        dueDate: new Date(Date.now() + task.dueInDays * 24 * 60 * 60 * 1000),
        createdBy: admin._id,
        activityHistory: [
          {
            action: 'Task seeded',
            performedBy: admin._id,
          },
        ],
      }))
    );

    project.tasks = tasks.map((task) => task._id);
    project.progress = Math.round((tasks.filter((task) => task.status === 'completed').length / tasks.length) * 100);
    await project.save();

    team.projects = [project._id];
    await team.save();

    admin.projects = [project._id];
    admin.teams = [team._id];
    await admin.save();

    member.projects = [project._id];
    member.teams = [team._id];
    member.assignedTasks = tasks.map((task) => task._id);
    await member.save();

    console.log('Seed completed successfully');
    process.exit(0);
  } catch (error) {
    console.error(`Seed failed: ${error.message}`);
    process.exit(1);
  }
};

runSeed();
