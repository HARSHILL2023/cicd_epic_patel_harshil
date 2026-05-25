// src/middleware/request.logger.middleware.js

/**
 * Simple request logging middleware
 * Logs Method, Route, Timestamp, and sets up a response finish listener for Status
 */
export const requestLogger = (req, res, next) => {
  const start = Date.now();
  const timestamp = new Date().toISOString();

  // Wait for the response to finish to get the status code
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl} - Status: ${res.statusCode} - ${duration}ms`);
  });

  next();
};
