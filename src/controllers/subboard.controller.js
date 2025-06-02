import { SubBoardService } from '../services/subboard.service.js';

export class SubBoardController {
    static async addSubBoardToTask(req, res) {
        try {
            const { taskId } = req.params;
            const subBoardData = req.body;
            
            const result = await SubBoardService.addSubBoardToTask(taskId, subBoardData);
            
            res.status(201).json({
                success: true,
                message: 'Sub-board added to task successfully',
                data: {
                    subBoard: {
                        id: result.subBoard._id,
                        name: result.subBoard.name,
                        background: result.subBoard.background
                    },
                    task: {
                        id: result.task._id,
                        title: result.task.title
                    }
                }
            });
        } catch (error) {
            res.status(error.message === 'Task not found' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async getSubBoardsByTaskId(req, res) {
        try {
            const { taskId } = req.params;
            const subBoards = await SubBoardService.getSubBoardsByTaskId(taskId);
            
            res.json({
                success: true,
                data: subBoards
            });
        } catch (error) {
            res.status(error.message === 'Task not found' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    
    static async removeSubBoardFromTask(req, res) {
        try {
            const { taskId, subBoardId } = req.params;
            await SubBoardService.removeSubBoardFromTask(taskId, subBoardId);
            
            res.json({
                success: true,
                message: 'Sub-board removed from task successfully'
            });
        } catch (error) {
            res.status(error.message === 'Task not found' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    static async removeSubBoard(req, res) {
        try {
            const { subBoardId } = req.params;
            const result = await SubBoardService.removeSubBoard(subBoardId);
            
            res.json({
                success: true,
                message: 'Sub-board removed successfully',
                data: result
            });
        } catch (error) {
            res.status(error.message === 'Sub-board not found' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
    static async updateSubBoard(req, res) {
        try {
            const { subBoardId } = req.params;
            const updateData = req.body;
            const updatedSubBoard = await SubBoardService.updateSubBoard(subBoardId, updateData);
            
            res.json({
                success: true,
                message: 'Sub-board updated successfully',
                data: updatedSubBoard
            });
        } catch (error) {
            res.status(error.message === 'Sub-board not found' ? 404 : 500).json({
                success: false,
                message: error.message
            });
        }
    }
}