// src/routes/notification.routes.js
// Note: This file handles /notifications, /comments, and /reviews
// These are mounted at /api/v1 level in app.js (not under a sub-prefix)
import express from 'express';
import {
  getNotifications,
  markNotificationRead,
  deleteNotification,
  addComment,
  getComments,
  updateComment,
  deleteComment,
  submitReview,
  getReviews
} from '../controllers/notification.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

// ─── Notification routes ──────────────────────────────────────────────────────
// GET /api/v1/notifications
router.get('/notifications', authMiddleware, getNotifications);

// PATCH /api/v1/notifications/:id/read
router.patch('/notifications/:id/read', authMiddleware, markNotificationRead);

// DELETE /api/v1/notifications/:id
router.delete('/notifications/:id', authMiddleware, deleteNotification);

// ─── Comment routes ───────────────────────────────────────────────────────────
// POST /api/v1/comments/:workflowId
router.post('/comments/:workflowId', authMiddleware, addComment);

// GET /api/v1/comments/:workflowId
router.get('/comments/:workflowId', getComments);

// PATCH /api/v1/comments/:commentId
router.patch('/comments/:commentId', authMiddleware, updateComment);

// DELETE /api/v1/comments/:commentId
router.delete('/comments/:commentId', authMiddleware, deleteComment);

// ─── Review routes ────────────────────────────────────────────────────────────
// POST /api/v1/reviews/:workflowId
router.post('/reviews/:workflowId', authMiddleware, submitReview);

// GET /api/v1/reviews/:workflowId
router.get('/reviews/:workflowId', getReviews);

export default router;
