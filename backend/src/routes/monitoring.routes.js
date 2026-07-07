// src/routes/monitoring.routes.js
import express from 'express';
import {
  getPrometheusMetrics,
  getGrafanaDashboards,
  getAlerts,
  getUptime,
  getCpuMetrics,
  getMemoryMetrics,
  getNetworkMetrics,
  getStorageMetrics,
  createAlert,
  deleteAlert
} from '../controllers/monitoring.controller.js';

const router = express.Router();

// GET /api/v1/monitoring/prometheus
router.get('/prometheus', getPrometheusMetrics);

// GET /api/v1/monitoring/grafana
router.get('/grafana', getGrafanaDashboards);

// GET /api/v1/monitoring/alerts
router.get('/alerts', getAlerts);

// GET /api/v1/monitoring/uptime
router.get('/uptime', getUptime);

// GET /api/v1/monitoring/cpu
router.get('/cpu', getCpuMetrics);

// GET /api/v1/monitoring/memory
router.get('/memory', getMemoryMetrics);

// GET /api/v1/monitoring/network
router.get('/network', getNetworkMetrics);

// GET /api/v1/monitoring/storage
router.get('/storage', getStorageMetrics);

// POST /api/v1/monitoring/alerts/create
router.post('/alerts/create', createAlert);

// DELETE /api/v1/monitoring/alerts/:id
router.delete('/alerts/:id', deleteAlert);

export default router;
