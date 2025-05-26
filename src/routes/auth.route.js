import express from 'express';
import AuthController from '../controllers/auth.controller.js';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/me', protect, AuthController.getUserProfile);
router.patch('/me', protect, AuthController.updateUserProfile);


export default router;
