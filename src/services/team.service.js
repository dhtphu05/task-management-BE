import { Team } from '../models/Team.js';
import User from '../models/useModel.js';

export class TeamService {
  // Tạo team mới
  static async createTeam(teamData) {
    const team = new Team(teamData);
    await team.save();
    return team;
  }

  // Lấy tất cả teams với pagination
  static async getAllTeams(page = 1, limit = 10) {
    const skip = (page - 1) * limit;
    
    const teams = await Team.find()
      .populate('leader', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Team.countDocuments();
    
    // Format lại dữ liệu để trả về
    const formattedTeams = teams.map(team => ({
      id: team._id,
      name: team.name,
      description: team.description,
      leader: team.leader ? {
        id: team.leader._id,
        name: team.leader.name,
        email: team.leader.email
      } : null,
      createdAt: team.createdAt
    }));
    
    return { 
      teams: formattedTeams, 
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }

  // Lấy thông tin chi tiết team bao gồm danh sách thành viên
  static async getTeamById(teamId) {
    const team = await Team.findById(teamId)
      .populate('leader', 'name email');
      
    if (!team) {
      throw new Error('Team not found');
    }
    
    // Lấy danh sách users thuộc team
    const members = await User.find({ teamId: teamId })
      .select('_id name email role');
      
    return {
      id: team._id,
      name: team.name,
      description: team.description,
      leader: team.leader ? {
        id: team.leader._id,
        name: team.leader.name,
        email: team.leader.email
      } : null,
      members: members.map(member => ({
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role
      })),
      createdAt: team.createdAt
    };
  }

  // Cập nhật thông tin team
  static async updateTeam(teamId, updateData) {
    const team = await Team.findByIdAndUpdate(
      teamId, 
      updateData, 
      { new: true }
    ).populate('leader', 'name email');
    
    if (!team) {
      throw new Error('Team not found');
    }
    
    return {
      id: team._id,
      name: team.name,
      description: team.description,
      leader: team.leader ? {
        id: team.leader._id,
        name: team.leader.name,
        email: team.leader.email
      } : null,
      createdAt: team.createdAt
    };
  }

  // Xóa team
  static async deleteTeam(teamId) {
    const team = await Team.findByIdAndDelete(teamId);
    
    if (!team) {
      throw new Error('Team not found');
    }
    
    // Cập nhật tất cả user thuộc team về null
    await User.updateMany(
      { teamId: teamId },
      { $set: { teamId: null } }
    );
    
    return { message: 'Team deleted successfully' };
  }

  // Thêm user vào team
  static async addUserToTeam(teamId, userId) {
    // Kiểm tra team có tồn tại không
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    // Kiểm tra user có tồn tại không
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    
    // Gán user vào team
    user.teamId = teamId;
    await user.save();
    
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      teamId: user.teamId
    };
  }

  // Xóa user khỏi team
  static async removeUserFromTeam(teamId, userId) {
    // Kiểm tra team có tồn tại không
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    // Kiểm tra user có tồn tại và thuộc team không
    const user = await User.findOne({ _id: userId, teamId: teamId });
    if (!user) {
      throw new Error('User not found in this team');
    }
    
    // Xóa user khỏi team
    user.teamId = null;
    await user.save();
    
    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    };
  }

  // Lấy danh sách users trong team
  static async getTeamMembers(teamId, page = 1, limit = 10) {
    // Kiểm tra team có tồn tại không
    const team = await Team.findById(teamId);
    if (!team) {
      throw new Error('Team not found');
    }
    
    const skip = (page - 1) * limit;
    
    const members = await User.find({ teamId: teamId })
      .select('_id name email role')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
      
    const total = await User.countDocuments({ teamId: teamId });
    
    return {
      members: members.map(member => ({
        id: member._id,
        name: member.name,
        email: member.email,
        role: member.role
      })),
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / limit)
    };
  }
}

export default TeamService;