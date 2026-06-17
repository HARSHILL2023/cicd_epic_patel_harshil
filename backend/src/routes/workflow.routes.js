// src/routes/workflow.routes.js
import express from 'express';
import {
  getAllWorkflows,
  getWorkflowById,
  createWorkflow,
  replaceWorkflow,
  updateWorkflowContent,
  deleteWorkflow,
  getRandomWorkflow,
  getLatestWorkflows,
  getTrendingWorkflows,
  getRecommendedWorkflows,
  getPopularWorkflows,
  getWorkflowHistory,
  archiveWorkflow,
  restoreWorkflow,
  getWorkflowVersions,
  cloneWorkflow,
  getWorkflowLogs,
  getWorkflowMetrics,
  runWorkflow,
  cancelWorkflow,
  bookmarkWorkflow
} from '../controllers/workflow.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';
import { createKnowledgeValidation, updateKnowledgeValidation } from '../validations/knowledge.validation.js';

const router = express.Router();

// ─── Static named routes MUST come BEFORE /:id to avoid conflict ─────────────
router.get('/random', getRandomWorkflow);
router.get('/latest', getLatestWorkflows);
router.get('/trending', getTrendingWorkflows);
router.get('/recommended', getRecommendedWorkflows);
router.get('/popular', getPopularWorkflows);
router.get('/history/:id', getWorkflowHistory);

// ─── Collection routes ────────────────────────────────────────────────────────
router.get('/', getAllWorkflows);
router.post('/', authMiddleware, authorizeRoles('admin'), createKnowledgeValidation, createWorkflow);

// ─── Dynamic ID sub-resource routes MUST come before /:id GET ────────────────
router.get('/:id/versions', getWorkflowVersions);
router.get('/:id/logs', getWorkflowLogs);
router.get('/:id/metrics', getWorkflowMetrics);
router.post('/:id/clone', authMiddleware, cloneWorkflow);
router.post('/:id/run', authMiddleware, runWorkflow);
router.post('/:id/cancel', authMiddleware, cancelWorkflow);
router.post('/:id/bookmark', authMiddleware, bookmarkWorkflow);
router.patch('/:id/content', authMiddleware, authorizeRoles('admin'), updateWorkflowContent);
router.patch('/:id/archive', authMiddleware, authorizeRoles('admin'), archiveWorkflow);
router.patch('/:id/restore', authMiddleware, authorizeRoles('admin'), restoreWorkflow);

// ─── Dynamic ID base routes ───────────────────────────────────────────────────
router.get('/:id', getWorkflowById);
router.put('/:id', authMiddleware, authorizeRoles('admin'), updateKnowledgeValidation, replaceWorkflow);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), deleteWorkflow);

export default router;
