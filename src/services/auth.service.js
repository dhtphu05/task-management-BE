import User from '../models/useModel.js';
import generateToken from "../utils/generateToken.js"
class AuthService {
    async register({ name, email, password, role }) {
        const userExists = await User.findOne({ email });
        if (userExists) {
            throw new Error('User already exists');
        }
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'member'
        });
        return user;
    }

    async login({ email, password }) {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            throw new Error('Invalid email or password');
        }
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user)
        };
    }

    async findById(id) {
        const user = await User.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        };
    }
}

export default AuthService;