import {Task} from '../models/Task.js';

export class TaskService {
  static async getTasks(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const tasks = await Task.find()
      .populate({
        path: 'subBoards',
        select: 'name background',
      })
      .populate({
        path: 'creator',
        select: 'username',
      })
      .populate({
        path: 'teamId',
        select: '_id', // hoặc thêm thông tin nếu muốn
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const formattedTasks = tasks.map(task => ({
      id: task._id,
      title: task.title,
      description: task.description,
      dueTime: task.dueTime,
      documentLink: task.documentLink,
      githubRepo: task.githubRepo,
      subBoards: task.subBoards.map(board => ({
        id: board._id,
        name: board.name,
        background: board.background
      })),
      creator: {
        id: task.creator?._id,
        username: task.creator?.username
      },
      teamId: task.teamId?._id,
      createdAt: task.createdAt
    }));

    const total = await Task.countDocuments();

    return { tasks: formattedTasks, total };
  }
  static async getTaskById(id) {
    const task = await Task.findById(id)
      .populate({
        path: 'subBoards',
        select: 'name background',
      })
      .populate({
        path: 'creator',
        select: 'username',
      })
      .populate({
        path: 'teamId',
        select: '_id',
      });

    if (!task) throw new Error('Task not found');

    const comments = await Comment.find({ taskId: id })
      .populate({ path: 'user', select: 'username' })
      .sort({ createdAt: 1 });

    return {
      id: task._id,
      title: task.title,
      description: task.description,
      dueTime: task.dueTime,
      documentLink: task.documentLink,
      githubRepo: task.githubRepo,
      subBoards: task.subBoards.map(board => ({
        id: board._id,
        name: board.name,
        background: board.background
      })),
      comments: comments.map(c => ({
        id: c._id,
        user: {
          id: c.user._id,
          username: c.user.username
        },
        content: c.content,
        createdAt: c.createdAt
      })),
      creator: {
        id: task.creator._id,
        username: task.creator.username
      },
      teamId: task.teamId?._id,
      createdAt: task.createdAt
    };
  }
}