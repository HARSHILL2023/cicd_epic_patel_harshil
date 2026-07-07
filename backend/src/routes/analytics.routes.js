// src/routes/analytics.routes.js
import express from 'express';
import {
  getAnalyticsSummary,
  getFailureAnalytics,
  getSuccessRate,
  getDeploymentAnalytics,
  getBuildTimes,
  getTopTools,
  getTopErrors,
  getUsageAnalytics,
  getTrendingAnalytics,
  getLatestAnalytics,
  getGrowthAnalytics,
  getPerformanceMetrics,
  getSecurityAnalytics,
  getCostAnalytics,
  getCloudUsage
} from '../controllers/analytics.controller.js';

const router = express.Router();

// GET /api/v1/analytics/summary
router.get('/summary', getAnalyticsSummary);

// GET /api/v1/analytics/failures
router.get('/failures', getFailureAnalytics);

// GET /api/v1/analytics/success-rate
router.get('/success-rate', getSuccessRate);

// GET /api/v1/analytics/deployments
router.get('/deployments', getDeploymentAnalytics);

// GET /api/v1/analytics/build-times
router.get('/build-times', getBuildTimes);

// GET /api/v1/analytics/top-tools
router.get('/top-tools', getTopTools);

// GET /api/v1/analytics/top-errors
router.get('/top-errors', getTopErrors);

// GET /api/v1/analytics/usage
router.get('/usage', getUsageAnalytics);

// GET /api/v1/analytics/trending
router.get('/trending', getTrendingAnalytics);

// GET /api/v1/analytics/latest
router.get('/latest', getLatestAnalytics);

// GET /api/v1/analytics/growth
router.get('/growth', getGrowthAnalytics);

// GET /api/v1/analytics/performance
router.get('/performance', getPerformanceMetrics);

// GET /api/v1/analytics/security
router.get('/security', getSecurityAnalytics);

// GET /api/v1/analytics/costs
router.get('/costs', getCostAnalytics);

// GET /api/v1/analytics/cloud-usage
router.get('/cloud-usage', getCloudUsage);

export default router;
