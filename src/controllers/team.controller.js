import { TeamService } from '../services/team.service.js';

export class TeamController {
  // Tạo team mới
  static async createTeam(req, res) {
  try {
    console.log("Received team creation request:", req.body);
    
    const teamData = req.body;
    
    // Nếu không có leader được chỉ định, gán người tạo làm leader
    if (!teamData.leader && req.user) {
      teamData.leader = req.user.id;
    }
    
    const team = await TeamService.createTeam(teamData);
    
    res.status(201).json({
      success: true,
      message: 'Team created successfully',
      data: team
    });
  } catch (error) {
    console.error("Team creation error:", error);
    
    // Xác định status code phù hợp
    const statusCode = 
      error.message.includes('not found') ? 404 :
      error.name === 'ValidationError' ? 400 :
      error.name === 'CastError' ? 400 :
      500;
      
    res.status(statusCode).json({
      success: false,
      message: error.message
    });
  }
}

  // Lấy danh sách tất cả teams
  static async getAllTeams(req, res) {
    try {
      const { page = 1, limit = 10 } = req.query;
      const result = await TeamService.getAllTeams(Number(page), Number(limit));
      
      res.json({
        success: true,
        message: 'Teams retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy thông tin team theo ID
  static async getTeamById(req, res) {
    try {
      const { teamId } = req.params;
      const team = await TeamService.getTeamById(teamId);
      
      res.json({
        success: true,
        message: 'Team retrieved successfully',
        data: team
      });
    } catch (error) {
      res.status(error.message === 'Team not found' ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cập nhật thông tin team
  static async updateTeam(req, res) {
    try {
      const { teamId } = req.params;
      const updateData = req.body;
      
      const updatedTeam = await TeamService.updateTeam(teamId, updateData);
      
      res.json({
        success: true,
        message: 'Team updated successfully',
        data: updatedTeam
      });
    } catch (error) {
      res.status(error.message === 'Team not found' ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa team
  static async deleteTeam(req, res) {
    try {
      const { teamId } = req.params;
      const result = await TeamService.deleteTeam(teamId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(error.message === 'Team not found' ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Thêm user vào team
  static async addUserToTeam(req, res) {
    try {
      const { teamId, userId } = req.params;
      const result = await TeamService.addUserToTeam(teamId, userId);
      
      res.json({
        success: true,
        message: 'User added to team successfully',
        data: result
      });
    } catch (error) {
      const status = 
        error.message === 'Team not found' || error.message === 'User not found' 
          ? 404 
          : 500;
          
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  // Xóa user khỏi team
  static async removeUserFromTeam(req, res) {
    try {
      const { teamId, userId } = req.params;
      const result = await TeamService.removeUserFromTeam(teamId, userId);
      
      res.json({
        success: true,
        message: 'User removed from team successfully',
        data: result
      });
    } catch (error) {
      const status = 
        error.message.includes('not found') 
          ? 404 
          : 500;
          
      res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  // Lấy danh sách thành viên trong team
  static async getTeamMembers(req, res) {
    try {
      const { teamId } = req.params;
      const { page = 1, limit = 10 } = req.query;
      
      const result = await TeamService.getTeamMembers(
        teamId,
        Number(page),
        Number(limit)
      );
      
      res.json({
        success: true,
        message: 'Team members retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(error.message === 'Team not found' ? 404 : 500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default TeamController;