import { SubBoard } from "../models/SubBoard.js"; 
import { Task } from "../models/Task.js";

export class SubBoardService {
    static async createSubBoard(subBoardData) {
        const subBoard = new SubBoard(subBoardData);
        await subBoard.save();
        return subBoard;
    }

    static async addSubBoardToTask(taskId, subBoardData) {
        // Tạo sub-board mới
        const subBoard = new SubBoard(subBoardData);
        await subBoard.save();
        
        // Thêm sub-board vào task
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        
        task.subBoards.push(subBoard._id);
        await task.save();
        
        return {
            task,
            subBoard
        };
    }
    
    // Thêm phương thức mới này
    static async updateSubBoard(subBoardId, updateData) {
        const subBoard = await SubBoard.findByIdAndUpdate(
            subBoardId,
            updateData,
            { new: true }
        );
        
        if (!subBoard) {
            throw new Error('Sub-board not found');
        }
        
        return subBoard;
    }
    
    // Nếu bạn cũng đang sử dụng removeSubBoard thì cần thêm phương thức này
    static async removeSubBoard(subBoardId) {
        const subBoard = await SubBoard.findByIdAndDelete(subBoardId);
        
        if (!subBoard) {
            throw new Error('Sub-board not found');
        }
        
        // Nếu cần, bạn cũng có thể xóa sub-board này khỏi tất cả các task
        await Task.updateMany(
            { subBoards: subBoardId },
            { $pull: { subBoards: subBoardId } }
        );
        
        return { id: subBoard._id };
    }
    
    static async getSubBoardsByTaskId(taskId) {
        const task = await Task.findById(taskId).populate('subBoards');
        if (!task) {
            throw new Error('Task not found');
        }
        
        return task.subBoards;
    }
    
    static async removeSubBoardFromTask(taskId, subBoardId) {
        const task = await Task.findById(taskId);
        if (!task) {
            throw new Error('Task not found');
        }
        
        // Xóa subBoardId khỏi mảng subBoards
        task.subBoards = task.subBoards.filter(
            id => id.toString() !== subBoardId
        );
        
        await task.save();
        
        return task;
    }
}