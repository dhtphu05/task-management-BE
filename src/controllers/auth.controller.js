import User from '../models/useModel.js';
import generateToken from '../utils/generateToken.js';
import AuthService from '../services/auth.service.js';

const authService = new AuthService();

class AuthController {
    // Register a new user
    static async register(req, res) {
        try {
            const user = await authService.register(req.body);
            res.status(201).json({
                success: true,
                message: 'User created successfully',
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user)
                }
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Invalid user data'
            });
        }
    }

    // Login user
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide email and password'
                });
            }
            const userData = await authService.login({ email, password });
            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: userData
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message || 'Invalid email or password'
            });
        }
    }

    // Get user profile
    static async getUserProfile(req, res) {
        try {
            const user = await authService.findById(req.user.id);
            res.status(200).json({
                success: true,
                data: user
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message || 'User not found'
            });
        }
    }

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

    

}
export default AuthController;

