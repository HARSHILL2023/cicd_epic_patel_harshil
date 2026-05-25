// src/routes/knowledge.routes.js
import express from 'express';
import { getAllItems, getItemById } from '../controllers/knowledge.controller.js';

const router = express.Router();

// GET /api/v1/knowledge
router.get('/', getAllItems);

// GET /api/v1/knowledge/:id
router.get('/:id', getItemById);

export default router;
