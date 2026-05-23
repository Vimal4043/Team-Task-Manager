import express from 'express';
import {
  createProjectValidation,
  updateProjectValidation,
  projectQueryValidation,
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/projectController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/', protect, projectQueryValidation, getProjects);
router.get('/:id', protect, getProjectById);
router.post('/', protect, authorize('admin'), ...createProjectValidation, createProject);
router.put('/:id', protect, authorize('admin'), ...updateProjectValidation, updateProject);
router.delete('/:id', protect, authorize('admin'), deleteProject);

export default router;
