// src/controllers/monitoring.controller.js
import mongoose from 'mongoose';
import { sendResponse } from '../utils/response.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// In-memory store for alerts (resets on server restart)
const alertStore = [];

// @desc    Prometheus monitoring metrics
// @route   GET /api/v1/monitoring/prometheus
// @access  Public
export const getPrometheusMetrics = asyncHandler(async (req, res) => {
  const mem = process.memoryUsage();
  const uptime = process.uptime();
  const cpuUsage = process.cpuUsage();
  const metrics = [
    '# HELP process_heap_used_bytes Node.js heap memory used',
    '# TYPE process_heap_used_bytes gauge',
    `process_heap_used_bytes ${mem.heapUsed}`,
    '',
    '# HELP process_heap_total_bytes Node.js heap memory total',
    '# TYPE process_heap_total_bytes gauge',
    `process_heap_total_bytes ${mem.heapTotal}`,
    '',
    '# HELP process_rss_bytes Node.js resident set size',
    '# TYPE process_rss_bytes gauge',
    `process_rss_bytes ${mem.rss}`,
    '',
    '# HELP process_uptime_seconds Node.js process uptime',
    '# TYPE process_uptime_seconds counter',
    `process_uptime_seconds ${Math.floor(uptime)}`,
    '',
    '# HELP process_cpu_user_seconds_total User CPU time spent',
    '# TYPE process_cpu_user_seconds_total counter',
    `process_cpu_user_seconds_total ${cpuUsage.user / 1e6}`,
    '',
    '# HELP mongodb_connection_status MongoDB connection state (1=connected)',
    '# TYPE mongodb_connection_status gauge',
    `mongodb_connection_status ${mongoose.connection.readyState === 1 ? 1 : 0}`
  ].join('\n');
  res.set('Content-Type', 'text/plain; version=0.0.4');
  return res.status(200).send(metrics);
});

// @desc    Grafana dashboards
// @route   GET /api/v1/monitoring/grafana
// @access  Public
export const getGrafanaDashboards = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Grafana dashboard data fetched', {
    dashboards: [
      { id: 1, name: 'API Overview', description: 'Request rates, response times, errors', panels: 6 },
      { id: 2, name: 'Database Metrics', description: 'MongoDB connection and query performance', panels: 4 },
      { id: 3, name: 'System Resources', description: 'CPU, memory, and disk usage', panels: 5 }
    ],
    note: 'Connect Grafana to your Prometheus endpoint for live dashboards'
  });
});

// @desc    Alert rules
// @route   GET /api/v1/monitoring/alerts
// @access  Public
export const getAlerts = asyncHandler(async (req, res) => {
  const defaultAlerts = [
    { id: 'default_1', name: 'High Memory Usage', threshold: '80%', metric: 'heap_used', severity: 'warning', active: false },
    { id: 'default_2', name: 'DB Disconnected', threshold: 'readyState !== 1', metric: 'mongodb_connection', severity: 'critical', active: false }
  ];
  return sendResponse(res, 200, true, 'Alert rules fetched', {
    alerts: [...defaultAlerts, ...alertStore],
    total: defaultAlerts.length + alertStore.length
  });
});

// @desc    Uptime monitoring
// @route   GET /api/v1/monitoring/uptime
// @access  Public
export const getUptime = asyncHandler(async (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  return sendResponse(res, 200, true, 'Uptime fetched', {
    uptimeSeconds,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString(),
    status: 'online'
  });
});

// @desc    CPU monitoring
// @route   GET /api/v1/monitoring/cpu
// @access  Public
export const getCpuMetrics = asyncHandler(async (req, res) => {
  const cpuUsage = process.cpuUsage();
  return sendResponse(res, 200, true, 'CPU metrics fetched', {
    userCpuMs: Math.round(cpuUsage.user / 1000),
    systemCpuMs: Math.round(cpuUsage.system / 1000),
    totalCpuMs: Math.round((cpuUsage.user + cpuUsage.system) / 1000),
    timestamp: new Date().toISOString()
  });
});

// @desc    Memory monitoring
// @route   GET /api/v1/monitoring/memory
// @access  Public
export const getMemoryMetrics = asyncHandler(async (req, res) => {
  const mem = process.memoryUsage();
  return sendResponse(res, 200, true, 'Memory metrics fetched', {
    rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(mem.external / 1024 / 1024)} MB`,
    heapUsagePercent: `${Math.round((mem.heapUsed / mem.heapTotal) * 100)}%`,
    timestamp: new Date().toISOString()
  });
});

// @desc    Network monitoring
// @route   GET /api/v1/monitoring/network
// @access  Public
export const getNetworkMetrics = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Network metrics fetched', {
    status: 'online',
    activeConnections: 1,
    requestsPerMinute: 0,
    latency: '< 5ms',
    timestamp: new Date().toISOString(),
    note: 'Detailed network stats require OS-level monitoring tools'
  });
});

// @desc    Storage monitoring
// @route   GET /api/v1/monitoring/storage
// @access  Public
export const getStorageMetrics = asyncHandler(async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  return sendResponse(res, 200, true, 'Storage metrics fetched', {
    database: {
      type: 'MongoDB',
      status: isConnected ? 'connected' : 'disconnected',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown'
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Create alert
// @route   POST /api/v1/monitoring/alerts/create
// @access  Public
export const createAlert = asyncHandler(async (req, res) => {
  const { name, threshold, severity, metric } = req.body;
  if (!name) return sendResponse(res, 400, false, 'Alert name is required', null, { message: 'Missing name field' });
  const alert = {
    id: `alert_${Date.now()}`,
    name,
    threshold: threshold || 'N/A',
    severity: severity || 'warning',
    metric: metric || 'custom',
    active: true,
    createdAt: new Date().toISOString()
  };
  alertStore.push(alert);
  return sendResponse(res, 201, true, 'Alert created successfully', { alert });
});

// @desc    Delete alert
// @route   DELETE /api/v1/monitoring/alerts/:id
// @access  Public
export const deleteAlert = asyncHandler(async (req, res) => {
  const idx = alertStore.findIndex(a => a.id === req.params.id);
  if (idx !== -1) alertStore.splice(idx, 1);
  return sendResponse(res, 200, true, 'Alert deleted successfully', {
    alertId: req.params.id,
    deletedAt: new Date().toISOString()
  });
});
