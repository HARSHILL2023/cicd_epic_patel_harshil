// src/controllers/knowledge.controller.js
import KnowledgeItem from '../models/knowledge.model.js';

// GET /api/v1/knowledge
// Supports: ?page, ?limit, ?sort, ?difficulty, ?topic, ?search
export const getAllItems = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const filter = {};

    if (req.query.difficulty) {
      filter.difficulty = req.query.difficulty.toLowerCase();
    }

    if (req.query.topic) {
      filter.topic = req.query.topic.toLowerCase();
    }

    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const sortField = req.query.sort || 'createdAt';
    const sortOrder = req.query.order === 'asc' ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const total = await KnowledgeItem.countDocuments(filter);
    const items = await KnowledgeItem.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .select('instruction topic difficulty createdAt');

    return res.status(200).json({
      success: true,
      message: 'Knowledge items fetched successfully',
      data: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        items
      },
      error: null
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch knowledge items',
      data: null,
      error: { message: err.message }
    });
  }
};

// GET /api/v1/knowledge/:id
export const getItemById = async (req, res) => {
  try {
    const item = await KnowledgeItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Knowledge item not found',
        data: null,
        error: { message: 'No item found with the given ID' }
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Knowledge item fetched successfully',
      data: { item },
      error: null
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch knowledge item',
      data: null,
      error: { message: err.message }
    });
  }
};
