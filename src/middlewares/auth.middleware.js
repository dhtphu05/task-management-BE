import jwt from 'jsonwebtoken';
import User from '../models/useModel.js';

export const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied: Insufficient role' });
    }

    next();
  };
};
export const isAdmin = (req, res, next) => {

  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Kiểm tra xem người dùng có phải là admin không
  //decode the token and check the role
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  if (!req.user || !req.user.role) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  // Kiểm tra xem vai trò của người dùng có phải là 'admin' không
  if (!req.user.role) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied: Admins only' });
  }

  next();
}
