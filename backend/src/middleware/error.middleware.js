// src/middleware/error.middleware.js

/**
 * 404 handler for routes that do not exist.
 */
export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Cannot find route ${req.originalUrl} on this server`,
    data: null,
    error: { message: 'Route not found' }
  });
};

/**
 * Central error handler.
 * Catches errors passed via next(err) and sends a consistent JSON response.
 */
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;

  const response = {
    success: false,
    message: err.message || 'Internal Server Error',
    data: null,
    error: { message: err.message || 'Something went wrong' }
  };

  // Attach validation errors if they exist (from express-validator)
  if (err.errors) {
    response.error.details = err.errors;
  }

  // Show stack trace only in development
  if (process.env.NODE_ENV !== 'production' && err.stack) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};
