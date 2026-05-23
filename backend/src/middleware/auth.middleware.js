import { verifyToken } from '../utils/jwt.util.js';
import User from '../models/user.model.js';

/**
 * Authentication middleware to verify JWT token and attach user info to request.
 */
export default async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: No token provided',
        error: {}
      });
    }
    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    // Fetch latest user data from DB (excluding password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized: User not found',
        error: {}
      });
    }
    req.user = user; // attach mongoose doc (or plain object) to request
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: Invalid token',
      error: { message: err.message }
    });
  }
}
