// src/routes/debug.routes.js
import express from 'express';
import { getAllItems } from '../controllers/knowledge.controller.js';

const router = express.Router();

/**
 * Debug routes reuse the existing getAllItems controller.
 * Two injection middlewares:
 *  - injectTopic: filters by topic field
 *  - injectSearch: filters by keyword in instruction/output
 */
const injectTopic = (topic) => (req, res, next) => {
  req.query.topic = topic;
  next();
};

const injectSearch = (keyword) => (req, res, next) => {
  if (!req.query.search) req.query.search = keyword;
  next();
};

// GET /api/v1/debug/common-issues
router.get('/common-issues', injectSearch('issue error common fix'), getAllItems);

// GET /api/v1/debug/logs
router.get('/logs', injectSearch('logs logging centralized'), getAllItems);

// GET /api/v1/debug/connectivity
router.get('/connectivity', injectSearch('connectivity network connect'), getAllItems);

// GET /api/v1/debug/errors
router.get('/errors', injectSearch('error fix debug troubleshoot'), getAllItems);

// GET /api/v1/debug/k8s
router.get('/k8s', injectTopic('k8s'), getAllItems);

// GET /api/v1/debug/docker
router.get('/docker', injectTopic('docker'), getAllItems);

// GET /api/v1/debug/jenkins
router.get('/jenkins', injectTopic('jenkins'), getAllItems);

// GET /api/v1/debug/github-actions
router.get('/github-actions', injectTopic('github-actions'), getAllItems);

// GET /api/v1/debug/gitlab-ci
router.get('/gitlab-ci', injectTopic('gitlab-ci'), getAllItems);

// GET /api/v1/debug/terraform
router.get('/terraform', injectTopic('terraform'), getAllItems);

// GET /api/v1/debug/aws
router.get('/aws', injectTopic('aws'), getAllItems);

// GET /api/v1/debug/gcp
router.get('/gcp', injectTopic('gcp'), getAllItems);

// GET /api/v1/debug/azure
router.get('/azure', injectTopic('azure'), getAllItems);

// GET /api/v1/debug/network
router.get('/network', injectTopic('networking'), getAllItems);

// GET /api/v1/debug/security
router.get('/security', injectTopic('security'), getAllItems);

export default router;
