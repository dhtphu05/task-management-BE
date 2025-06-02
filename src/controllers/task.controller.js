import TaskService from '../services/task.service.js';

export class TaskController {
    static async getTasks(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const { tasks, total } = await TaskService.getTasks(Number(page), Number(limit));

      res.json({
        success: true,
        message: "Get all tasks successfully",
        data: {
          tasks,
          total,
          page: Number(page),
          limit: Number(limit)
        }
      });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
    static async getTaskById(req, res) {
        try {
            const taskId = req.params.id;
            const task = await TaskService.getTaskById(taskId);

            if (!task) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            res.json({
                success: true,
                message: "Get task successfully",
                data: task
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async createTask(req, res) {
        try {
            const taskData = {...req.body, creator: req.user.id};
            const newTask = await TaskService.createTask(taskData);

            res.status(201).json({
                success: true,
                message: "Task created successfully",
                data: newTask
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async updateTask(req, res) {
        try {
            const taskId = req.params.id;
            const taskData = req.body;
            const updatedTask = await TaskService.updateTask(taskId, taskData);

            if (!updatedTask) {
                return res.status(404).json({ success: false, message: 'Task not found' });
            }

            res.json({
                success: true,
                message: "Task updated successfully",
                data: updatedTask
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }

    static async deleteTask(req, res) {
        try {
            const taskId = req.params.id;
            const result = await TaskService.deleteTask(taskId);

            res.json({
                success: true,
                message: result.message
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getTasksByTeamId(req, res) {
        try {
            const teamId = req.params.teamId;
            const { page = 1, limit = 10 } = req.query;
            const { tasks, total } = await TaskService.getTasksByTeamId(teamId, Number(page), Number(limit));

            res.json({
                success: true,
                message: "Get tasks by team ID successfully",
                data: {
                    tasks,
                    total,
                    page: Number(page),
                    limit: Number(limit)
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getTasksByUserId(req, res) {
        try {
            const userId = req.params.userId;
            const { page = 1, limit = 10 } = req.query;
            const { tasks, total } = await TaskService.getTasksByUserId(userId, Number(page), Number(limit));

            res.json({
                success: true,
                message: "Get tasks by user ID successfully",
                data: {
                    tasks,
                    total,
                    page: Number(page),
                    limit: Number(limit)
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
    static async getTasksBySubBoardId(req, res) {
        try {
            const subBoardId = req.params.subBoardId;
            const { page = 1, limit = 10 } = req.query;
            const { tasks, total } = await TaskService.getTasksBySubBoardId(subBoardId, Number(page), Number(limit));

            res.json({
                success: true,
                message: "Get tasks by sub-board ID successfully",
                data: {
                    tasks,
                    total,
                    page: Number(page),
                    limit: Number(limit)
                }
            });
        } catch (err) {
            res.status(500).json({ success: false, message: err.message });
        }
    }
  }
export default TaskController;