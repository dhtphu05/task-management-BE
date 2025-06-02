import express from 'express';
import { CommentController } from '../controllers/comment.controller.js';
import { protect } from '../middlewares/auth.middleware.js';

const router = express.Router();

// POST /api/tasks/:taskId/comments - Thêm comment
router.post('/tasks/:taskId/comments', protect, CommentController.addComment);

// GET /api/tasks/:taskId/comments - Lấy tất cả comment
router.get('/tasks/:taskId/comments', protect, CommentController.getCommentsByTaskId);

// DELETE /api/comments/:commentId - Xóa comment (thêm API bổ sung)
router.delete('/comments/:commentId', protect, CommentController.deleteComment);

export default router;