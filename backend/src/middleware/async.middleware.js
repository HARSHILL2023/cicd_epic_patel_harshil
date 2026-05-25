// src/middleware/async.middleware.js

/**
 * Wraps an async route handler and automatically forwards errors to next().
 * This removes the need to write try/catch in every async controller.
 *
 * Usage:
 *   router.get('/route', asyncHandler(async (req, res) => { ... }));
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
