import { body, param, query } from 'express-validator';
import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { recalculateProjectProgress } from './projectController.js';
import { validateRequest } from '../utils/validators.js';

const createTaskValidation = [
  body('title').trim().isLength({ min: 2 }).withMessage('Task title must be at least 2 characters'),
  body('assignedTo').isMongoId().withMessage('Valid assigned user is required'),
  body('project').isMongoId().withMessage('Valid project is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('dueDate').isISO8601().withMessage('Valid due date is required'),
  validateRequest,
];

const updateTaskValidation = [
  param('id').isMongoId().withMessage('Valid task id is required'),
  body('assignedTo').optional().isMongoId().withMessage('Valid assigned user is required'),
  body('project').optional().isMongoId().withMessage('Valid project is required'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  body('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  body('dueDate').optional().isISO8601().withMessage('Valid due date is required'),
  validateRequest,
];

const taskQueryValidation = [
  query('status').optional().isIn(['todo', 'in-progress', 'completed']).withMessage('Invalid status'),
  query('priority').optional().isIn(['low', 'medium', 'high', 'critical']).withMessage('Invalid priority'),
  query('overdue').optional().isBoolean().withMessage('overdue must be boolean'),
  validateRequest,
];

const taskPopulation = [
  { path: 'assignedTo', select: 'name email role' },
  { path: 'project', select: 'title status progress' },
  { path: 'createdBy', select: 'name email role' },
  { path: 'comments.user', select: 'name email role' },
  { path: 'activityHistory.performedBy', select: 'name email role' },
];

const getTasks = async (req, res, next) => {
  try {
    const { status, priority, project, assignedTo, search, overdue, sortBy = 'dueDate', order = 'asc' } = req.query;
    const filter = {};
    const andConditions = [];

    if (status) {
      filter.status = status;
    }

    if (priority) {
      filter.priority = priority;
    }

    if (project) {
      filter.project = project;
    }

    if (assignedTo) {
      filter.assignedTo = assignedTo;
    }

    if (search) {
      andConditions.push({
        $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        ],
      });
    }

    if (overdue === 'true') {
      filter.dueDate = { $lt: new Date() };
      filter.status = { $ne: 'completed' };
    }

    if (req.user.role !== 'admin') {
      andConditions.push({ $or: [{ assignedTo: req.user._id }, { createdBy: req.user._id }] });
    }

    if (andConditions.length) {
      filter.$and = andConditions;
    }

    const sort = { [sortBy]: order === 'desc' ? -1 : 1 };

    const tasks = await Task.find(filter).populate(taskPopulation).sort(sort);

    return res.status(200).json({ tasks });
  } catch (error) {
    return next(error);
  }
};

const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate(taskPopulation);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin') {
      const canAccess =
        task.assignedTo._id.toString() === req.user._id.toString() ||
        task.createdBy._id.toString() === req.user._id.toString();

      if (!canAccess) {
        return res.status(403).json({ message: 'Not authorized to access this task' });
      }
    }

    return res.status(200).json({ task });
  } catch (error) {
    return next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const { title, description, assignedTo, project, priority, status, dueDate } = req.body;

    const [assignee, projectDoc] = await Promise.all([
      User.findById(assignedTo),
      Project.findById(project),
    ]);

    if (!assignee) {
      return res.status(404).json({ message: 'Assigned user not found' });
    }

    if (!projectDoc) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const task = await Task.create({
      title,
      description,
      assignedTo,
      project,
      priority: priority || 'medium',
      status: status || 'todo',
      dueDate,
      createdBy: req.user._id,
      activityHistory: [
        {
          action: 'Task created',
          performedBy: req.user._id,
          meta: `Assigned to ${assignee.name}`,
        },
      ],
      completedAt: status === 'completed' ? new Date() : undefined,
    });

    await Promise.all([
      Project.findByIdAndUpdate(project, { $addToSet: { tasks: task._id } }),
      User.findByIdAndUpdate(assignedTo, { $addToSet: { assignedTasks: task._id } }),
    ]);

    await recalculateProjectProgress(project);

    const populatedTask = await Task.findById(task._id).populate(taskPopulation);

    return res.status(201).json({ message: 'Task created', task: populatedTask });
  } catch (error) {
    return next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (req.user.role !== 'admin') {
      const canEdit =
        task.assignedTo.toString() === req.user._id.toString() ||
        task.createdBy.toString() === req.user._id.toString();

      if (!canEdit) {
        return res.status(403).json({ message: 'Not authorized to update this task' });
      }
    }

    const previousStatus = task.status;
    const previousAssignee = task.assignedTo.toString();
    const previousProject = task.project.toString();

    const updates = ['title', 'description', 'assignedTo', 'project', 'priority', 'status', 'dueDate'];
    updates.forEach((field) => {
      if (req.body[field] !== undefined) {
        task[field] = req.body[field];
      }
    });

    if (req.body.comment && req.body.comment.trim()) {
      task.comments.push({
        user: req.user._id,
        message: req.body.comment.trim(),
      });
    }

    if (previousStatus !== task.status) {
      task.activityHistory.push({
        action: `Status changed: ${previousStatus} -> ${task.status}`,
        performedBy: req.user._id,
      });

      task.completedAt = task.status === 'completed' ? new Date() : undefined;
    }

    await task.save();

    if (previousAssignee !== task.assignedTo.toString()) {
      await Promise.all([
        User.findByIdAndUpdate(previousAssignee, { $pull: { assignedTasks: task._id } }),
        User.findByIdAndUpdate(task.assignedTo, { $addToSet: { assignedTasks: task._id } }),
      ]);
    }

    if (previousProject !== task.project.toString()) {
      await Promise.all([
        Project.findByIdAndUpdate(previousProject, { $pull: { tasks: task._id } }),
        Project.findByIdAndUpdate(task.project, { $addToSet: { tasks: task._id } }),
      ]);
      await recalculateProjectProgress(previousProject);
    }

    await recalculateProjectProgress(task.project);

    const populatedTask = await Task.findById(task._id).populate(taskPopulation);
    return res.status(200).json({ message: 'Task updated', task: populatedTask });
  } catch (error) {
    return next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Promise.all([
      Project.findByIdAndUpdate(task.project, { $pull: { tasks: task._id } }),
      User.findByIdAndUpdate(task.assignedTo, { $pull: { assignedTasks: task._id } }),
    ]);

    const projectId = task.project;
    await task.deleteOne();
    await recalculateProjectProgress(projectId);

    return res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    return next(error);
  }
};

export {
  createTaskValidation,
  updateTaskValidation,
  taskQueryValidation,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
