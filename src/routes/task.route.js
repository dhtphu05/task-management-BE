import express from 'express';
import { TaskController } from '../controllers/task.controller.js';
import { protect } from '../middlewares/auth.middleware.js';
import { authorizeRoles, isAdmin } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.get('/', protect, TaskController.getTasks);
router.get('/:id', protect, TaskController.getTaskById);
router.post('/', protect, authorizeRoles('admin'), TaskController.createTask);
router.patch('/:id', protect, authorizeRoles('admin'), TaskController.updateTask);
router.delete('/:id', protect, authorizeRoles('admin'), TaskController.deleteTask);

export default router;
