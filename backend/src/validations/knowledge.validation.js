// src/validations/knowledge.validation.js
import { body, validationResult } from 'express-validator';
import { sendResponse } from '../utils/response.util.js';

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return sendResponse(res, 422, false, 'Validation failed', null, { details: errors.array() });
  }
  next();
};

export const createKnowledgeValidation = [
  body('instruction').trim().notEmpty().withMessage('Instruction is required'),
  body('output').notEmpty().withMessage('Output is required'),
  body('topic').trim().notEmpty().withMessage('Topic is required'),
  body('difficulty')
    .trim()
    .notEmpty().withMessage('Difficulty is required')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid difficulty level'),
  handleValidation
];

export const updateKnowledgeValidation = [
  body('instruction').optional().trim().notEmpty().withMessage('Instruction cannot be empty'),
  body('output').optional().notEmpty().withMessage('Output cannot be empty'),
  body('topic').optional().trim().notEmpty().withMessage('Topic cannot be empty'),
  body('difficulty')
    .optional()
    .trim()
    .isIn(['beginner', 'intermediate', 'advanced', 'expert']).withMessage('Invalid difficulty level'),
  handleValidation
];
