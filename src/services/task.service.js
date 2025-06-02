import { Task } from '../models/Task.js';
import { Comment } from '../models/Comment.js'; // Assuming Comment model is in the same directory or adjust path
import {SubBoard} from '../models/SubBoard.js'; // Assuming SubBoard model is in the same directory or adjust path

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
      select: 'username name email', // Lấy đủ các trường để có lựa chọn thay thế
    })
    .populate({
      path: 'teamId',
      select: '_id name',
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const formattedTasks = tasks.map(task => {
    // Xử lý trường hợp creator là null/undefined
    let creatorInfo = { id: null, username: 'Unknown user' };
    
    if (task.creator) {
      creatorInfo = {
        id: task.creator._id,
        username: task.creator.username || task.creator.name || task.creator.email || 'Unknown user'
      };
    }

    return {
      id: task._id,
      title: task.title,
      description: task.description,
      dueTime: task.dueTime,
      documentLink: task.documentLink,
      githubRepo: task.githubRepo,
      subBoards: (task.subBoards || []).map(board => ({
        id: board._id,
        name: board.name,
        background: board.background
      })),
      creator: creatorInfo,
      teamId: task.teamId?._id,
      createdAt: task.createdAt
    };
  });

  const total = await Task.countDocuments();
  return { tasks: formattedTasks, total };
}

  static async getTaskById(id) {
  try {
    console.log("Finding task with ID:", id);
    
    const task = await Task.findById(id)
      .populate({
        path: 'subBoards',
        select: 'name background',
      })
      .populate({
        path: 'creator',
        select: 'username name email', // Lấy đầy đủ thông tin để có lựa chọn
      })
      .populate({
        path: 'teamId',
        select: '_id name',
      });

    if (!task) throw new Error('Task not found');
    
    // Debug thông tin creator để xem vấn đề
    console.log("Creator info:", JSON.stringify(task.creator));
      
    const comments = await Comment.find({ taskId: id })
      .populate({ path: 'userId', select: 'name email' })
      .sort({ createdAt: 1 });

    const subBoards = task.subBoards || [];
    const commentsList = comments || [];

    // Xử lý trường hợp creator là null
    let creatorInfo = { id: null, username: 'Unknown user' };
    
    if (task.creator) {
      creatorInfo = {
        id: task.creator._id,
        username: task.creator.username || task.creator.name || task.creator.email || 'Unknown user'
      };
    }

    return {
      id: task._id,
      title: task.title,
      description: task.description,
      dueTime: task.dueTime,
      documentLink: task.documentLink,
      githubRepo: task.githubRepo,
      subBoards: subBoards.map(board => ({
        id: board?._id,
        name: board?.name,
        background: board?.background
      })),
      comments: commentsList.map(c => ({
        id: c?._id,
        user: {
          id: c?.userId?._id,
          username: c?.userId?.name || c?.userId?.email || 'Unknown user'
        },
        content: c?.content || '',
        createdAt: c?.createdAt
      })),
      creator: creatorInfo,
      teamId: task.teamId?._id,
      createdAt: task.createdAt
    };
  } catch (error) {
    console.error("Error in getTaskById:", error);
    throw error;
  }
}
  static async createTask(taskData) {
    const task = new Task(taskData);
    await task.save();
    return task;
  }
  static async updateTask(id, updateData) {
    const task = await Task.findByIdAndUpdate(id, updateData, { new: true });
    if (!task) throw new Error('Task not found');
    return task;
  }

  static async deleteTask(id) {
    const task = await Task.findByIdAndDelete(id);
    if (!task) throw new Error('Task not found');
    await Comment.deleteMany({ taskId: id });
    return { message: 'Task deleted successfully' };
  }

  // Example for getTasksByTeamId with pagination
  static async getTasksByTeamId(teamId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { teamId: teamId };

    const tasks = await Task.find(query)
      .populate(/*...populates as in getTasks...*/)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTasks = tasks.map(task => (
        // ... same formatting as in getTasks ...
        {
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
        }
    ));
    const total = await Task.countDocuments(query);
    return { tasks: formattedTasks, total };
  }

  // Example for getTasksByUserId with pagination
  static async getTasksByUserId(userId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { creator: userId }; // Assuming 'creator' field stores userId

    const tasks = await Task.find(query)
      .populate(/*...populates as in getTasks...*/)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    const formattedTasks = tasks.map(task => (
        // ... same formatting as in getTasks ...
        {
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
        }
    ));
    const total = await Task.countDocuments(query);
    return { tasks: formattedTasks, total };
  }

  // Example for getTasksBySubBoardId with pagination
  static async getTasksBySubBoardId(subBoardId, page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    const query = { subBoards: subBoardId }; // Assuming 'subBoards' is an array of subBoard IDs

    const tasks = await Task.find(query)
      .populate(/*...populates as in getTasks...*/)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const formattedTasks = tasks.map(task => (
        // ... same formatting as in getTasks ...
        {
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
        }
    ));
    const total = await Task.countDocuments(query);
    return { tasks: formattedTasks, total };
  }
}
export default TaskService;