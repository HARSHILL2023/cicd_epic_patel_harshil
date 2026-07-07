// src/controllers/search.controller.js
import KnowledgeItem from '../models/knowledge.model.js';
import { sendResponse } from '../utils/response.util.js';
import { getPaginatedData } from '../utils/pagination.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// @desc    Full text search
// @route   GET /api/v1/search?q=
// @access  Public
export const globalSearch = asyncHandler(async (req, res) => {
  const q = req.query.q || req.query.search || '';
  const filter = { isDeleted: { $ne: true } };
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ instruction: regex }, { topic: regex }, { output: regex }];
  }
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, 'Search results fetched', { query: q, ...paginatedData });
});

// @desc    Fetch all tags
// @route   GET /api/v1/search/tags
// @access  Public
export const getAllTags = asyncHandler(async (req, res) => {
  const tags = await KnowledgeItem.distinct('topic', { isDeleted: { $ne: true } });
  return sendResponse(res, 200, true, 'Tags fetched successfully', { tags, count: tags.length });
});

// @desc    Search by tag
// @route   GET /api/v1/search/by-tag/:tag
// @access  Public
export const searchByTag = asyncHandler(async (req, res) => {
  const filter = { topic: req.params.tag.toLowerCase(), isDeleted: { $ne: true } };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, `Results for tag: ${req.params.tag}`, { tag: req.params.tag, ...paginatedData });
});

// @desc    Popular searches
// @route   GET /api/v1/search/popular
// @access  Public
export const getPopularSearches = asyncHandler(async (req, res) => {
  const popular = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$topic', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { topic: '$_id', count: 1, _id: 0 } }
  ]);
  return sendResponse(res, 200, true, 'Popular searches fetched', { popular });
});

// @desc    Recent searches
// @route   GET /api/v1/search/recent
// @access  Public
export const getRecentSearches = asyncHandler(async (req, res) => {
  const recent = await KnowledgeItem.find({ isDeleted: { $ne: true } })
    .sort({ updatedAt: -1 })
    .limit(10)
    .select('instruction topic difficulty updatedAt')
    .lean();
  return sendResponse(res, 200, true, 'Recent items fetched', { recent, count: recent.length });
});

// @desc    Search autocomplete
// @route   GET /api/v1/search/autocomplete?q=
// @access  Public
export const autocomplete = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(`^${q}`, 'i');
  const topics = await KnowledgeItem.distinct('topic', { topic: regex, isDeleted: { $ne: true } });
  const instructions = await KnowledgeItem.find({ instruction: regex, isDeleted: { $ne: true } }, 'instruction')
    .limit(5).lean();
  return sendResponse(res, 200, true, 'Autocomplete suggestions fetched', {
    query: q,
    topics: topics.slice(0, 5),
    instructions: instructions.map(i => i.instruction)
  });
});

// @desc    Fuzzy search
// @route   GET /api/v1/search/fuzzy?q=
// @access  Public
export const fuzzySearch = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const fuzzyPattern = q.split('').join('.*');
  const regex = new RegExp(fuzzyPattern, 'i');
  const filter = { isDeleted: { $ne: true }, $or: [{ instruction: regex }, { topic: regex }] };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, 'Fuzzy search results', { query: q, ...paginatedData });
});

// @desc    Exact match search
// @route   GET /api/v1/search/exact?q=
// @access  Public
export const exactSearch = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const filter = { isDeleted: { $ne: true }, $or: [{ instruction: q }, { topic: q }] };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, 'Exact match results', { query: q, ...paginatedData });
});

// @desc    Search by category
// @route   GET /api/v1/search/category/:name
// @access  Public
export const searchByCategory = asyncHandler(async (req, res) => {
  const filter = { topic: req.params.name.toLowerCase(), isDeleted: { $ne: true } };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, ['instruction']);
  return sendResponse(res, 200, true, `Results for category: ${req.params.name}`, { category: req.params.name, ...paginatedData });
});

// @desc    Search by language
// @route   GET /api/v1/search/language/:lang
// @access  Public
export const searchByLanguage = asyncHandler(async (req, res) => {
  const regex = new RegExp(req.params.lang, 'i');
  const filter = { isDeleted: { $ne: true }, $or: [{ topic: regex }, { instruction: regex }, { output: regex }] };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, `Results for language: ${req.params.lang}`, { language: req.params.lang, ...paginatedData });
});

// @desc    Search by DevOps tool
// @route   GET /api/v1/search/tool/:tool
// @access  Public
export const searchByTool = asyncHandler(async (req, res) => {
  const regex = new RegExp(req.params.tool, 'i');
  const filter = { isDeleted: { $ne: true }, $or: [{ topic: regex }, { instruction: regex }] };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, `Results for tool: ${req.params.tool}`, { tool: req.params.tool, ...paginatedData });
});

// @desc    Advanced search
// @route   GET /api/v1/search/advanced
// @access  Public
export const advancedSearch = asyncHandler(async (req, res) => {
  const { q, topic, difficulty, type } = req.query;
  const filter = { isDeleted: { $ne: true } };
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ instruction: regex }, { topic: regex }, { output: regex }];
  }
  if (topic) filter.topic = topic.toLowerCase();
  if (difficulty) filter.difficulty = difficulty.toLowerCase();
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, 'Advanced search results', {
    appliedFilters: { q, topic, difficulty, type },
    ...paginatedData
  });
});

// @desc    Suggested queries
// @route   GET /api/v1/search/suggestions?q=
// @access  Public
export const getSuggestions = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const regex = new RegExp(q, 'i');
  const topics = await KnowledgeItem.distinct('topic', { topic: regex, isDeleted: { $ne: true } });
  return sendResponse(res, 200, true, 'Search suggestions fetched', {
    query: q,
    suggestions: topics.slice(0, 8).map(t => ({ text: t, type: 'topic' }))
  });
});

// @desc    User search history
// @route   GET /api/v1/search/history
// @access  Public
export const getSearchHistory = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Search history fetched', {
    history: [],
    message: 'Search history tracking requires user sessions'
  });
});

// @desc    Trending topics
// @route   GET /api/v1/search/trending
// @access  Public
export const getTrendingSearches = asyncHandler(async (req, res) => {
  const trending = await KnowledgeItem.aggregate([
    { $match: { isDeleted: { $ne: true } } },
    { $group: { _id: '$topic', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
    { $project: { topic: '$_id', count: 1, _id: 0 } }
  ]);
  return sendResponse(res, 200, true, 'Trending topics fetched', { trending });
});

// @desc    Recommended searches
// @route   GET /api/v1/search/recommended
// @access  Public
export const getRecommendedSearches = asyncHandler(async (req, res) => {
  const topics = await KnowledgeItem.distinct('topic', { isDeleted: { $ne: true } });
  const recommended = topics.slice(0, 8).map(t => ({ query: t, type: 'topic', category: 'infrastructure' }));
  return sendResponse(res, 200, true, 'Recommended searches fetched', { recommended });
});

// @desc    Combined filtering
// @route   GET /api/v1/search/filter?tag=k8s&type=debug
// @access  Public
export const filterSearch = asyncHandler(async (req, res) => {
  const { tag, type, difficulty, topic, q } = req.query;
  const filter = { isDeleted: { $ne: true } };
  if (tag || topic) filter.topic = (tag || topic).toLowerCase();
  if (difficulty) filter.difficulty = difficulty.toLowerCase();
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ instruction: regex }, { output: regex }];
  }
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, ['instruction']);
  return sendResponse(res, 200, true, 'Filtered search results', { appliedFilters: req.query, ...paginatedData });
});

// @desc    Search YAML templates
// @route   GET /api/v1/search/yaml
// @access  Public
export const searchYaml = asyncHandler(async (req, res) => {
  const regex = new RegExp('yaml|yml|apiVersion|kind|pipeline|stages|template', 'i');
  const filter = { isDeleted: { $ne: true }, $or: [{ output: regex }, { instruction: regex }] };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, ['instruction', 'output']);
  return sendResponse(res, 200, true, 'YAML search results', paginatedData);
});

// @desc    Search code snippets
// @route   GET /api/v1/search/snippets
// @access  Public
export const searchSnippets = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const filter = { isDeleted: { $ne: true } };
  if (q) {
    const regex = new RegExp(q, 'i');
    filter.$or = [{ output: regex }, { instruction: regex }];
  }
  const items = await KnowledgeItem.find(filter)
    .select('instruction output topic difficulty')
    .limit(20)
    .lean();
  return sendResponse(res, 200, true, 'Code snippets fetched', { snippets: items, count: items.length });
});

// @desc    Search errors
// @route   GET /api/v1/search/errors?q=
// @access  Public
export const searchErrors = asyncHandler(async (req, res) => {
  const q = req.query.q || '';
  const errorPattern = q || 'error|issue|fail|crash|debug|troubleshoot|exception';
  const regex = new RegExp(errorPattern, 'i');
  const filter = { isDeleted: { $ne: true }, $or: [{ instruction: regex }, { output: regex }] };
  const paginatedData = await getPaginatedData(KnowledgeItem, req.query, filter, []);
  return sendResponse(res, 200, true, 'Error-related results fetched', { query: q, ...paginatedData });
});
