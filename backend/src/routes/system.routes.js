// src/routes/system.routes.js
import express from 'express';
import {
  getSystemInfo,
  getVersion,
  getUptime,
  getPublicConfig,
  getSystemStatus,
  getMemoryUsage,
  getStorageUsage,
  getActiveConnections,
  getEnvironmentInfo
} from '../controllers/system.controller.js';

const router = express.Router();

// GET /api/v1/system/info
router.get('/info', getSystemInfo);

// GET /api/v1/system/version
router.get('/version', getVersion);

// GET /api/v1/system/uptime
router.get('/uptime', getUptime);

// GET /api/v1/system/config
router.get('/config', getPublicConfig);

// GET /api/v1/system/status
router.get('/status', getSystemStatus);

// GET /api/v1/system/memory
router.get('/memory', getMemoryUsage);

// GET /api/v1/system/storage
router.get('/storage', getStorageUsage);

// GET /api/v1/system/connections
router.get('/connections', getActiveConnections);

// GET /api/v1/system/environment
router.get('/environment', getEnvironmentInfo);

export default router;
