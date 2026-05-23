import express from 'express';
import { getUsers, getUserById, updateUserRole, updateUserRoleValidation, getProfile } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
import authorize from '../middleware/roleMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getProfile);
router.get('/', protect, authorize('admin'), getUsers);
router.get('/:id', protect, authorize('admin'), getUserById);
router.put('/:id/role', protect, authorize('admin'), ...updateUserRoleValidation, updateUserRole);

export default router;
