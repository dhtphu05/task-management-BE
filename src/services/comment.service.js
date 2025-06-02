import { Comment } from '../models/Comment.js';
import { Task } from '../models/Task.js';

export class CommentService {
    static async addComment(commentData) {
        try {
            // Kiểm tra task có tồn tại không
            const taskExists = await Task.exists({ _id: commentData.taskId });
            if (!taskExists) {
                throw new Error('Task not found');
            }

            // Tạo comment mới
            const comment = new Comment(commentData);
            await comment.save();
            
            return comment;
        } catch (error) {
            throw error;
        }
    }

    static async getCommentsByTaskId(taskId, page = 1, limit = 10) {
        try {
            // Kiểm tra task có tồn tại không
            const taskExists = await Task.exists({ _id: taskId });
            if (!taskExists) {
                throw new Error('Task not found');
            }

            // Tính số lượng bản ghi bỏ qua
            const skip = (page - 1) * limit;
            
            // Lấy danh sách comment và populate thông tin user
            const comments = await Comment.find({ taskId })
                .sort({ createdAt: -1 }) // Mới nhất trước
                .skip(skip)
                .limit(limit)
                .populate({
                    path: 'userId',
                    select: 'name email'
                });
            
            // Đếm tổng số comment
            const total = await Comment.countDocuments({ taskId });
            
            return {
                comments,
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit)
            };
        } catch (error) {
            throw error;
        }
    }
    
    static async deleteComment(commentId, userId) {
        try {
            // Tìm comment và chỉ xóa nếu người dùng hiện tại là người tạo comment
            const comment = await Comment.findOneAndDelete({
                _id: commentId,
                userId: userId
            });
            
            if (!comment) {
                throw new Error('Comment not found or you are not authorized to delete this comment');
            }
            
            return { success: true, message: 'Comment deleted successfully' };
        } catch (error) {
            throw error;
        }
    }
}