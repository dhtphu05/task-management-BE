import { CommentService } from '../services/comment.service.js';

export class CommentController {
     static async addComment(req, res) {
        try {
            const { taskId } = req.params;
            const { content } = req.body;
            
            if (!content || content.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Comment content is required'
                });
            }
            
            const commentData = {
                // Thay thế cấu trúc user bằng userId trực tiếp
                userId: req.user.id,
                content,
                taskId
                // Không cần thêm createdAt vì model đã có timestamps: true
            };
            
            const comment = await CommentService.addComment(commentData);
            
            res.status(201).json({
                success: true,
                message: 'Comment added successfully',
                data: comment
            });
        } catch (error) {
            res.status(error.message === 'Task not found' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async getCommentsByTaskId(req, res) {
        try {
            const { taskId } = req.params;
            const { page = 1, limit = 10 } = req.query;
            
            const result = await CommentService.getCommentsByTaskId(
                taskId,
                Number(page),
                Number(limit)
            );
            
            res.json({
                success: true,
                message: 'Comments retrieved successfully',
                data: result
            });
        } catch (error) {
            res.status(error.message === 'Task not found' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async deleteComment(req, res) {
        try {
            const { commentId } = req.params;
            
            const result = await CommentService.deleteComment(commentId, req.user.id);
            
            res.json({
                success: true,
                message: 'Comment deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}