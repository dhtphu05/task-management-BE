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
}