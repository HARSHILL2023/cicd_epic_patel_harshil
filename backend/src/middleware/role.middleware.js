// src/middleware/role.middleware.js
import { sendResponse } from '../utils/response.util.js';

/**
 * Middleware to restrict access based on user roles
 */
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendResponse(
        res,
        403,
        false,
        `Role (${req.user?.role || 'none'}) is not allowed to access this resource`,
        null,
        { message: 'Forbidden' }
      );
    }
    next();
  };
};
