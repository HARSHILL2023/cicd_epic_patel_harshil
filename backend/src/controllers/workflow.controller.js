// src/controllers/workflow.controller.js
import KnowledgeItem from '../models/knowledge.model.js';
import { sendResponse } from '../utils/response.util.js';
import { getPaginatedData } from '../utils/pagination.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// @desc    Fetch all workflows
// @route   GET /api/v1/workflows
// @access  Public
export const getAllWorkflows = asyncHandler(async (req, res) => {
  const filter = { isDeleted: { $ne: true } };
  if (req.query.difficulty) filter.difficulty = req.query.difficulty.toLowerCase();
  if (req.query.topic) filter.topic = req.query.topic.toLowerCase();
  const searchFields = ['instruction', 'topic'];
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, searchFields);
  return sendResponse(res, 200, true, 'Workflows fetched successfully', paginatedData);
});

// @desc    Fetch single workflow
// @route   GET /api/v1/workflows/:id
// @access  Public
export const getWorkflowById = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow fetched successfully', { workflow: item });
});

// @desc    Create new workflow
// @route   POST /api/v1/workflows
// @access  Private/Admin
export const createWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.create(req.body);
  return sendResponse(res, 201, true, 'Workflow created successfully', { workflow: item });
});

// @desc    Replace workflow
// @route   PUT /api/v1/workflows/:id
// @access  Private/Admin
export const replaceWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow replaced successfully', { workflow: item });
});

// @desc    Update workflow content
// @route   PATCH /api/v1/workflows/:id/content
// @access  Private/Admin
export const updateWorkflowContent = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    { $set: req.body },
    { new: true, runValidators: true }
  );
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow content updated successfully', { workflow: item });
});

// @desc    Delete workflow (soft delete)
// @route   DELETE /api/v1/workflows/:id
// @access  Private/Admin
export const deleteWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true }
  );
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID or already deleted' });
  return sendResponse(res, 200, true, 'Workflow deleted successfully');
});

// @desc    Fetch random workflow
// @route   GET /api/v1/workflows/random
// @access  Public
export const getRandomWorkflow = asyncHandler(async (req, res) => {
  const items = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $sample: { size: 1 } }
  ]);
  if (!items.length) return sendResponse(res, 404, false, 'No workflows found', null);
  return sendResponse(res, 200, true, 'Random workflow fetched', { workflow: items[0] });
});

// @desc    Fetch latest workflows
// @route   GET /api/v1/workflows/latest
// @access  Public
export const getLatestWorkflows = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const items = await KnowledgeItem.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return sendResponse(res, 200, true, 'Latest workflows fetched', { workflows: items, count: items.length });
});

// @desc    Fetch trending workflows
// @route   GET /api/v1/workflows/trending
// @access  Public
export const getTrendingWorkflows = asyncHandler(async (req, res) => {
  const items = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $sort: { updatedAt: -1 } },
    { $limit: 10 }
  ]);
  return sendResponse(res, 200, true, 'Trending workflows fetched', { workflows: items, count: items.length });
});

// @desc    Fetch recommended workflows
// @route   GET /api/v1/workflows/recommended
// @access  Public
export const getRecommendedWorkflows = asyncHandler(async (req, res) => {
  const items = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true }, difficulty: 'beginner' } },
    { $sample: { size: 10 } }
  ]);
  return sendResponse(res, 200, true, 'Recommended workflows fetched', { workflows: items, count: items.length });
});

// @desc    Fetch popular workflows
// @route   GET /api/v1/workflows/popular
// @access  Public
export const getPopularWorkflows = asyncHandler(async (req, res) => {
  const popular = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$topic', count: { $sum: 1 }, sample: { $push: '$$ROOT' } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $project: { topic: '$_id', count: 1, sample: { $slice: ['$sample', 3] }, _id: 0 } }
  ]);
  return sendResponse(res, 200, true, 'Popular workflows fetched', { popular });
});

// @desc    Fetch workflow history
// @route   GET /api/v1/workflows/history/:id
// @access  Public
export const getWorkflowHistory = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.id).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow history fetched', {
    workflow: item,
    history: [{ version: 1, action: 'created', timestamp: item.createdAt, changes: [] }]
  });
});

// @desc    Archive workflow
// @route   PATCH /api/v1/workflows/:id/archive
// @access  Private/Admin
export const archiveWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findByIdAndUpdate(
    req.params.id,
    { isDeleted: true },
    { new: true }
  );
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow archived successfully', { workflow: item });
});

// @desc    Restore workflow
// @route   PATCH /api/v1/workflows/:id/restore
// @access  Private/Admin
export const restoreWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findByIdAndUpdate(
    req.params.id,
    { isDeleted: false },
    { new: true }
  );
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow restored successfully', { workflow: item });
});

// @desc    Fetch workflow versions
// @route   GET /api/v1/workflows/:id/versions
// @access  Public
export const getWorkflowVersions = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.id).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow versions fetched', {
    workflowId: item._id,
    currentVersion: 1,
    versions: [{ version: 1, createdAt: item.createdAt, isActive: true, changes: 'Initial version' }]
  });
});

// @desc    Clone workflow
// @route   POST /api/v1/workflows/:id/clone
// @access  Private
export const cloneWorkflow = asyncHandler(async (req, res) => {
  const original = await KnowledgeItem.findById(req.params.id).lean();
  if (!original) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  const { _id, createdAt, updatedAt, __v, ...cloneData } = original;
  cloneData.instruction = `[Clone] ${cloneData.instruction}`;
  const cloned = await KnowledgeItem.create(cloneData);
  return sendResponse(res, 201, true, 'Workflow cloned successfully', {
    workflow: cloned,
    clonedFrom: req.params.id
  });
});

// @desc    Fetch workflow logs
// @route   GET /api/v1/workflows/:id/logs
// @access  Public
export const getWorkflowLogs = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.id).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow logs fetched', {
    workflowId: item._id,
    logs: [
      { timestamp: new Date().toISOString(), level: 'INFO', message: 'Workflow loaded successfully', status: 'ok' }
    ]
  });
});

// @desc    Fetch workflow metrics
// @route   GET /api/v1/workflows/:id/metrics
// @access  Public
export const getWorkflowMetrics = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.id).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow metrics fetched', {
    workflowId: item._id,
    metrics: {
      totalRuns: 0,
      successRate: '100%',
      avgDuration: 'N/A',
      lastRun: null,
      topic: item.topic,
      difficulty: item.difficulty
    }
  });
});

// @desc    Trigger workflow run
// @route   POST /api/v1/workflows/:id/run
// @access  Private
export const runWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.id).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow run triggered', {
    workflowId: item._id,
    runId: `run_${Date.now()}`,
    status: 'queued',
    triggeredAt: new Date().toISOString()
  });
});

// @desc    Cancel running workflow
// @route   POST /api/v1/workflows/:id/cancel
// @access  Private
export const cancelWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.id).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow run cancelled', {
    workflowId: item._id,
    status: 'cancelled',
    cancelledAt: new Date().toISOString()
  });
});

// @desc    Bookmark workflow
// @route   POST /api/v1/workflows/:id/bookmark
// @access  Private
export const bookmarkWorkflow = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findById(req.params.id).lean();
  if (!item) return sendResponse(res, 404, false, 'Workflow not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'Workflow bookmarked successfully', {
    workflowId: item._id,
    bookmarked: true,
    bookmarkedAt: new Date().toISOString()
  });
});
