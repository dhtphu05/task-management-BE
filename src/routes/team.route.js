import express from 'express';
import { TeamController } from '../controllers/team.controller.js';
import { protect, authorizeRoles } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Routes cho team management - chỉ admin có quyền quản lý
router.post('/', protect, authorizeRoles('admin'), TeamController.createTeam);
router.get('/', protect, TeamController.getAllTeams);
router.get('/:teamId', protect, TeamController.getTeamById);
router.patch('/:teamId', protect, authorizeRoles('admin'), TeamController.updateTeam);
router.delete('/:teamId', protect, authorizeRoles('admin'), TeamController.deleteTeam);

// Routes cho team members management
router.post('/:teamId/members/:userId', protect, authorizeRoles('admin'), TeamController.addUserToTeam);
router.delete('/:teamId/members/:userId', protect, authorizeRoles('admin'), TeamController.removeUserFromTeam);
router.get('/:teamId/members', protect, TeamController.getTeamMembers);

export default router;