// src/controllers/knowledge.controller.js
import KnowledgeItem from '../models/knowledge.model.js';
import { sendResponse } from '../utils/response.util.js';
import { getPaginatedData } from '../utils/pagination.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// @desc    Get all knowledge items (with filtering, sorting, pagination, search)
// @route   GET /api/v1/knowledge
// @access  Public
export const getAllItems = asyncHandler(async (req, res) => {
  const filter = { isDeleted: { $ne: true } };
  if (req.query.difficulty) filter.difficulty = req.query.difficulty.toLowerCase();
  if (req.query.topic) filter.topic = req.query.topic.toLowerCase();

  const searchFields = ['instruction', 'topic'];
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, searchFields);

  return sendResponse(res, 200, true, 'Knowledge items fetched successfully', paginatedData);
});

// @desc    Get single knowledge item
// @route   GET /api/v1/knowledge/:id
// @access  Public
export const getItemById = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findOne({ _id: req.params.id, isDeleted: { $ne: true } }).lean();
  if (!item) {
    return sendResponse(res, 404, false, 'Knowledge item not found', null, { message: 'Invalid ID' });
  }
  return sendResponse(res, 200, true, 'Knowledge item fetched successfully', { item });
});

// @desc    Create knowledge item
// @route   POST /api/v1/knowledge
// @access  Private/Admin
export const createItem = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.create(req.body);
  return sendResponse(res, 201, true, 'Knowledge item created successfully', { item });
});

// @desc    Update knowledge item
// @route   PUT /api/v1/knowledge/:id
// @access  Private/Admin
export const updateItem = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!item) {
    return sendResponse(res, 404, false, 'Knowledge item not found', null, { message: 'Invalid ID' });
  }
  return sendResponse(res, 200, true, 'Knowledge item updated successfully', { item });
});

// @desc    Soft Delete knowledge item
// @route   DELETE /api/v1/knowledge/:id
// @access  Private/Admin
export const deleteItem = asyncHandler(async (req, res) => {
  const item = await KnowledgeItem.findOneAndUpdate(
    { _id: req.params.id, isDeleted: { $ne: true } },
    { isDeleted: true },
    { new: true }
  );
  if (!item) {
    return sendResponse(res, 404, false, 'Knowledge item not found', null, { message: 'Invalid ID or already deleted' });
  }
  return sendResponse(res, 200, true, 'Knowledge item deleted successfully');
});

// @desc    Get knowledge base statistics (Aggregation)
// @route   GET /api/v1/knowledge/stats/overview
// @access  Public
export const getStats = asyncHandler(async (req, res) => {
  const activeRecords = await KnowledgeItem.countDocuments({ isDeleted: { $ne: true } });
  const deletedRecords = await KnowledgeItem.countDocuments({ isDeleted: true });

  const byDifficulty = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$difficulty', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  const byTopic = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$topic', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  const latestRecords = await KnowledgeItem.find({ isDeleted: { $ne: true } })
    .sort({ createdAt: -1 })
    .limit(5)
    .select('instruction topic difficulty createdAt')
    .lean();

  return sendResponse(res, 200, true, 'Statistics fetched successfully', {
    totalActiveRecords: activeRecords,
    totalDeletedRecords: deletedRecords,
    byDifficulty,
    mostUsedTopics: byTopic,
    latestRecords
  });
});
