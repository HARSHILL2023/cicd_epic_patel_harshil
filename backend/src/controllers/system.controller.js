// src/controllers/system.controller.js
import mongoose from 'mongoose';
import { sendResponse } from '../utils/response.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// @desc    System information
// @route   GET /api/v1/system/info
// @access  Public
export const getSystemInfo = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'System information fetched', {
    name: 'CI/CD & Infrastructure Knowledge API',
    version: '1.0.0',
    description: 'Enterprise-grade REST API for CI/CD and Infrastructure knowledge management',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    environment: process.env.NODE_ENV || 'development'
  });
});

// @desc    API version
// @route   GET /api/v1/system/version
// @access  Public
export const getVersion = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'API version fetched', {
    version: '1.0.0',
    apiVersion: 'v1',
    releaseDate: '2026-01-01',
    changelog: '/api/v1/system/info'
  });
});

// @desc    System uptime
// @route   GET /api/v1/system/uptime
// @access  Public
export const getUptime = asyncHandler(async (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  return sendResponse(res, 200, true, 'System uptime fetched', {
    uptimeSeconds,
    formatted: `${hours}h ${minutes}m ${seconds}s`,
    startedAt: new Date(Date.now() - uptimeSeconds * 1000).toISOString()
  });
});

// @desc    Public configuration
// @route   GET /api/v1/system/config
// @access  Public
export const getPublicConfig = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Public configuration fetched', {
    apiVersion: 'v1',
    corsEnabled: true,
    rateLimitEnabled: true,
    maxPageSize: 100,
    defaultPageSize: 20,
    supportedMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
    features: ['pagination', 'sorting', 'filtering', 'search', 'aggregation', 'soft-delete']
  });
});

// @desc    System status
// @route   GET /api/v1/system/status
// @access  Public
export const getSystemStatus = asyncHandler(async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  return sendResponse(res, 200, true, 'System status fetched', {
    api: 'operational',
    database: dbStatusMap[dbState] || 'unknown',
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// @desc    Memory usage
// @route   GET /api/v1/system/memory
// @access  Public
export const getMemoryUsage = asyncHandler(async (req, res) => {
  const mem = process.memoryUsage();
  return sendResponse(res, 200, true, 'Memory usage fetched', {
    rss: `${Math.round(mem.rss / 1024 / 1024)} MB`,
    heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`,
    heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
    external: `${Math.round(mem.external / 1024 / 1024)} MB`,
    heapUsagePercent: `${Math.round((mem.heapUsed / mem.heapTotal) * 100)}%`,
    timestamp: new Date().toISOString()
  });
});

// @desc    Storage usage
// @route   GET /api/v1/system/storage
// @access  Public
export const getStorageUsage = asyncHandler(async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  return sendResponse(res, 200, true, 'Storage usage fetched', {
    database: {
      type: 'MongoDB',
      status: isConnected ? 'connected' : 'disconnected',
      host: mongoose.connection.host || 'unknown',
      name: mongoose.connection.name || 'unknown'
    },
    timestamp: new Date().toISOString()
  });
});

// @desc    Active connections
// @route   GET /api/v1/system/connections
// @access  Public
export const getActiveConnections = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Active connections fetched', {
    database: mongoose.connection.readyState === 1 ? 'active' : 'inactive',
    mongoosePoolSize: mongoose.connection.poolSize || 'default',
    activeConnections: mongoose.connection.readyState === 1 ? 1 : 0,
    timestamp: new Date().toISOString()
  });
});

// @desc    Environment information
// @route   GET /api/v1/system/environment
// @access  Public
export const getEnvironmentInfo = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Environment information fetched', {
    nodeEnv: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    architecture: process.arch,
    port: process.env.PORT || 5000,
    pid: process.pid
  });
});
