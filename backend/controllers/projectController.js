import { body, param, query } from 'express-validator';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import Team from '../models/Team.js';
import User from '../models/User.js';
import { validateRequest } from '../utils/validators.js';

const createProjectValidation = [
  body('title').trim().isLength({ min: 2 }).withMessage('Project title must be at least 2 characters'),
  body('description').optional().isLength({ max: 2000 }).withMessage('Description is too long'),
  body('status').optional().isIn(['planning', 'active', 'on-hold', 'completed']).withMessage('Invalid status'),
  body('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
  body('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid date')
    .custom((value, { req }) => {
      if (!req.body.startDate || !value) {
        return true;
      }
      if (new Date(value) < new Date(req.body.startDate)) {
        throw new Error('Due date must be on or after start date');
      }
      return true;
    }),
  body('memberIds').optional().isArray().withMessage('memberIds must be an array'),
  body('teamId').optional().isMongoId().withMessage('teamId must be valid'),
  validateRequest,
];

const updateProjectValidation = [
  param('id').isMongoId().withMessage('Valid project id is required'),
  body('title').optional().trim().isLength({ min: 2 }).withMessage('Project title must be at least 2 characters'),
  body('status').optional().isIn(['planning', 'active', 'on-hold', 'completed']).withMessage('Invalid status'),
  body('startDate').optional().isISO8601().withMessage('startDate must be a valid date'),
  body('endDate').optional().isISO8601().withMessage('endDate must be a valid date'),
  validateRequest,
];

const projectQueryValidation = [
  query('status').optional().isIn(['planning', 'active', 'on-hold', 'completed']).withMessage('Invalid status'),
  validateRequest,
];

const recalculateProjectProgress = async (projectId) => {
  const tasks = await Task.find({ project: projectId }).select('status');

  if (!tasks.length) {
    await Project.findByIdAndUpdate(projectId, { progress: 0 });
    return 0;
  }

  const completed = tasks.filter((task) => task.status === 'completed').length;
  const progress = Math.round((completed / tasks.length) * 100);
  await Project.findByIdAndUpdate(projectId, { progress });
  return progress;
};

const getProjects = async (req, res, next) => {
  try {
    const { status, search } = req.query;
    const filter = {};

    if (status) {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (req.user.role !== 'admin') {
      filter.members = req.user._id;
    }

    const projects = await Project.find(filter)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('team', 'name')
      .populate('tasks', 'title status dueDate priority assignedTo')
      .sort({ createdAt: -1 });

    return res.status(200).json({ projects });
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('team', 'name members')
      .populate({
        path: 'tasks',
        populate: { path: 'assignedTo', select: 'name email role' },
      });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (req.user.role !== 'admin') {
      const canAccess = project.members.some((member) => member._id.toString() === req.user._id.toString());
      if (!canAccess) {
        return res.status(403).json({ message: 'Not authorized to access this project' });
      }
    }

    return res.status(200).json({ project });
  } catch (error) {
    return next(error);
  }
};

const createProject = async (req, res, next) => {
  try {
    const {
      title,
      description,
      status,
      memberIds = [],
      teamId,
      startDate,
      endDate,
    } = req.body;

    if (startDate && endDate && new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ message: 'Due date must be on or after start date' });
    }

    const members = [...new Set([req.user._id.toString(), ...memberIds])];
    const validMembers = await User.find({ _id: { $in: members } }).select('_id');

    const projectData = {
      title,
      description,
      status: status || 'planning',
      members: validMembers.map((user) => user._id),
      createdBy: req.user._id,
      startDate,
      endDate,
    };

    if (teamId) {
      const team = await Team.findById(teamId);
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      projectData.team = teamId;
    }

    const project = await Project.create(projectData);

    await User.updateMany({ _id: { $in: project.members } }, { $addToSet: { projects: project._id } });

    if (teamId) {
      await Team.findByIdAndUpdate(teamId, { $addToSet: { projects: project._id } });
    }

    const populatedProject = await Project.findById(project._id)
      .populate('createdBy', 'name email role')
      .populate('members', 'name email role')
      .populate('team', 'name');

    return res.status(201).json({ message: 'Project created', project: populatedProject });
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const updates = ['title', 'description', 'status', 'startDate', 'endDate'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        project[field] = req.body[field];
      }
    });

    if (project.startDate && project.endDate && new Date(project.endDate) < new Date(project.startDate)) {
      return res.status(400).json({ message: 'Due date must be on or after start date' });
    }

    if (Array.isArray(req.body.memberIds)) {
      const memberIds = [...new Set([req.user._id.toString(), ...req.body.memberIds])];
      const validMembers = await User.find({ _id: { $in: memberIds } }).select('_id');
      project.members = validMembers.map((user) => user._id);
      await User.updateMany({ _id: { $in: validMembers.map((u) => u._id) } }, { $addToSet: { projects: project._id } });
    }

    await project.save();
    await recalculateProjectProgress(project._id);

    return res.status(200).json({ message: 'Project updated', project });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    await Task.deleteMany({ project: project._id });
    await Team.updateMany({ projects: project._id }, { $pull: { projects: project._id } });
    await User.updateMany({ projects: project._id }, { $pull: { projects: project._id } });
    await project.deleteOne();

    return res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export {
  createProjectValidation,
  updateProjectValidation,
  projectQueryValidation,
  recalculateProjectProgress,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
};
