import { body, param } from 'express-validator';
import Project from '../models/Project.js';
import Task from '../models/Task.js';
import User from '../models/User.js';
import { validateRequest } from '../utils/validators.js';

const updateUserRoleValidation = [
  param('id').isMongoId().withMessage('Valid user id is required'),
  body('role').isIn(['admin', 'member']).withMessage('Invalid role'),
  validateRequest,
];

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 }).lean();

    const enrichedUsers = await Promise.all(
      users.map(async (user) => {
        const [taskCount, projectCount] = await Promise.all([
          Task.countDocuments({ assignedTo: user._id }),
          Project.countDocuments({ members: user._id, status: 'active' }),
        ]);

        return {
          ...user,
          taskCount,
          projectCount,
        };
      }),
    );

    return res.status(200).json({ users: enrichedUsers });
  } catch (error) {
    return next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('assignedTasks', 'title status dueDate priority')
      .populate('projects', 'title status progress');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

const updateUserRole = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.role = req.body.role;
    await user.save();

    return res.status(200).json({
      message: 'User role updated',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('assignedTasks', 'title status dueDate priority project')
      .populate('projects', 'title status progress');

    return res.status(200).json({ user });
  } catch (error) {
    return next(error);
  }
};

export {
  updateUserRoleValidation,
  getUsers,
  getUserById,
  updateUserRole,
  getProfile,
};
