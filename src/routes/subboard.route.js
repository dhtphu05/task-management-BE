import express from 'express';
import { SubBoardController } from '../controllers/subboard.controller.js';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Route: POST /api/tasks/:taskId/subboards
router.post('/tasks/:taskId/subboards', 
    protect, 
    authorizeRoles('admin'),
    SubBoardController.addSubBoardToTask
);

// Route: GET /api/tasks/:taskId/subboards
router.get('/tasks/:taskId/subboards',
    protect,
    SubBoardController.getSubBoardsByTaskId
);

// Route: PATCH /api/tasks/subboards/:subBoardId
router.patch('/subboards/:subBoardId',
    protect,
    authorizeRoles('admin'),
    SubBoardController.updateSubBoard
);

// Route: DELETE /api/tasks/subboards/:subBoardId
router.delete('/subboards/:subBoardId',
    protect,
    authorizeRoles('admin'),
    SubBoardController.removeSubBoard
);

export default router;