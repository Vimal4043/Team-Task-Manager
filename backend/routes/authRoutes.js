import express from 'express';
import { register, login, me, registerValidation, loginValidation } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', ...registerValidation, register);
router.post('/login', ...loginValidation, login);
router.get('/me', protect, me);

export default router;
