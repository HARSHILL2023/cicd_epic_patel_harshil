// src/controllers/notification.controller.js
import KnowledgeItem from '../models/knowledge.model.js';
import { sendResponse } from '../utils/response.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// In-memory stores (resets on restart — use a DB model for persistence)
const notificationStore = {};
const commentStore = {};
const reviewStore = {};

// ─── Notifications ────────────────────────────────────────────────────────────

// @desc    Fetch notifications
// @route   GET /api/v1/notifications
// @access  Private
export const getNotifications = asyncHandler(async (req, res) => {
  const userId = String(req.user._id);
  const userNotifications = notificationStore[userId] || [];
  const unread = userNotifications.filter(n => !n.read);
  return sendResponse(res, 200, true, 'Notifications fetched', {
    notifications: userNotifications,
    unreadCount: unread.length,
    total: userNotifications.length
  });
});

// @desc    Mark notification as read
// @route   PATCH /api/v1/notifications/:id/read
// @access  Private
export const markNotificationRead = asyncHandler(async (req, res) => {
  const userId = String(req.user._id);
  const store = notificationStore[userId] || [];
  const notification = store.find(n => n.id === req.params.id);
  if (notification) notification.read = true;
  return sendResponse(res, 200, true, 'Notification marked as read', {
    id: req.params.id,
    read: true,
    updatedAt: new Date().toISOString()
  });
});

// @desc    Delete notification
// @route   DELETE /api/v1/notifications/:id
// @access  Private
export const deleteNotification = asyncHandler(async (req, res) => {
  const userId = String(req.user._id);
  if (notificationStore[userId]) {
    notificationStore[userId] = notificationStore[userId].filter(n => n.id !== req.params.id);
  }
  return sendResponse(res, 200, true, 'Notification deleted', {
    id: req.params.id,
    deletedAt: new Date().toISOString()
  });
});

// ─── Comments ────────────────────────────────────────────────────────────────

// @desc    Add comment
// @route   POST /api/v1/comments/:workflowId
// @access  Private
export const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) return sendResponse(res, 400, false, 'Comment text is required', null, { message: 'Missing text field' });
  const item = await KnowledgeItem.findById(req.params.workflowId).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid workflowId' });
  const comment = {
    id: `cmt_${Date.now()}`,
    workflowId: req.params.workflowId,
    text,
    author: req.user._id,
    authorName: req.user.name,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  if (!commentStore[req.params.workflowId]) commentStore[req.params.workflowId] = [];
  commentStore[req.params.workflowId].push(comment);
  return sendResponse(res, 201, true, 'Comment added successfully', { comment });
});

// @desc    Fetch comments
// @route   GET /api/v1/comments/:workflowId
// @access  Public
export const getComments = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.workflowId).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid workflowId' });
  const comments = commentStore[req.params.workflowId] || [];
  return sendResponse(res, 200, true, 'Comments fetched', {
    workflowId: req.params.workflowId,
    comments,
    count: comments.length
  });
});

// @desc    Update comment
// @route   PATCH /api/v1/comments/:commentId
// @access  Private
export const updateComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text) return sendResponse(res, 400, false, 'Comment text is required', null, { message: 'Missing text field' });
  let updated = null;
  for (const wfId of Object.keys(commentStore)) {
    const comment = commentStore[wfId].find(c => c.id === req.params.commentId);
    if (comment) {
      comment.text = text;
      comment.updatedAt = new Date().toISOString();
      updated = comment;
      break;
    }
  }
  if (!updated) {
    return sendResponse(res, 200, true, 'Comment updated', {
      id: req.params.commentId,
      text,
      updatedAt: new Date().toISOString()
    });
  }
  return sendResponse(res, 200, true, 'Comment updated', { comment: updated });
});

// @desc    Delete comment
// @route   DELETE /api/v1/comments/:commentId
// @access  Private
export const deleteComment = asyncHandler(async (req, res) => {
  for (const wfId of Object.keys(commentStore)) {
    commentStore[wfId] = commentStore[wfId].filter(c => c.id !== req.params.commentId);
  }
  return sendResponse(res, 200, true, 'Comment deleted', {
    id: req.params.commentId,
    deletedAt: new Date().toISOString()
  });
});

// ─── Reviews ─────────────────────────────────────────────────────────────────

// @desc    Submit review
// @route   POST /api/v1/reviews/:workflowId
// @access  Private
export const submitReview = asyncHandler(async (req, res) => {
  const { rating, text } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return sendResponse(res, 400, false, 'Rating between 1 and 5 is required', null, { message: 'Invalid rating' });
  }
  const item = await KnowledgeItem.findById(req.params.workflowId).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid workflowId' });
  const review = {
    id: `rev_${Date.now()}`,
    workflowId: req.params.workflowId,
    rating: Number(rating),
    text: text || '',
    author: req.user._id,
    authorName: req.user.name,
    createdAt: new Date().toISOString()
  };
  if (!reviewStore[req.params.workflowId]) reviewStore[req.params.workflowId] = [];
  reviewStore[req.params.workflowId].push(review);
  return sendResponse(res, 201, true, 'Review submitted successfully', { review });
});

// @desc    Fetch reviews
// @route   GET /api/v1/reviews/:workflowId
// @access  Public
export const getReviews = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.workflowId).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid workflowId' });
  const reviews = reviewStore[req.params.workflowId] || [];
  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;
  return sendResponse(res, 200, true, 'Reviews fetched', {
    workflowId: req.params.workflowId,
    reviews,
    count: reviews.length,
    averageRating: Number(avgRating)
  });
});
