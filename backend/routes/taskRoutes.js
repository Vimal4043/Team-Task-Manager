import express from 'express';
import {
  createTaskValidation,
  updateTaskValidation,
  taskQueryValidation,
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, ...taskQueryValidation, getTasks);
router.get('/:id', protect, getTaskById);
router.post('/', protect, authorize('admin'), ...createTaskValidation, createTask);
router.put('/:id', protect, ...updateTaskValidation, updateTask);
router.delete('/:id', protect, authorize('admin'), deleteTask);

export default router;
