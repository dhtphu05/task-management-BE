import User from '../models/user.model.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserService from '../services/user.service.js';
class AuthController {
    // Register a new user
    static async registerUser(req, res) {
        try {
            createUser(req.body);
            

            if (user) {
                res.status(201).json({
                    success: true,
                    message: 'User created successfully',
                    data: {
                        _id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                        token: generateToken(user._id)
                    }
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: 'Invalid user data'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }

    // Login user
    static async loginUser(req, res){
        const {email, password} = req.body;
        try{
            //val;idate required fields
            if(!email ||!password){
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                })
            }
            // Check if user exists
            const user = await User.findOne({ email }).select('+password');

        }
    }
    // Get user profile
    static async getUserProfile(req, res) {
        try {
            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            res.status(200).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }

    // Update user profile
    static async updateUserProfile(req, res) {
        try {
            const { name, email } = req.body;
            const user = await User.findById(req.user.id);

            if (!user) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            user.name = name || user.name;
            user.email = email || user.email;

            const updatedUser = await user.save();

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    role: updatedUser.role
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }

    // Change password
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide current and new password'
                });
            }

            const user = await User.findById(req.user.id).select('+password');
            
            // Check current password
            const isPasswordValid = await user.matchPassword(currentPassword);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Current password is incorrect'
                });
            }

            user.password = newPassword;
            await user.save();

            res.status(200).json({
                success: true,
                message: 'Password changed successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Server error',
                error: error.message
            });
        }
    }
}

export default AuthController;

// Export individual methods for route usage
export const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    changePassword
} = AuthController;