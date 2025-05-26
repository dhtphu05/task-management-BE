import express from 'express';
import { TaskController } from '../controllers/taskController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, TaskController.getTasks);
router.get('/:id', protect, TaskController.getTaskById);

export default router;
