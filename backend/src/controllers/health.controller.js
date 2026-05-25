// src/controllers/health.controller.js
import mongoose from 'mongoose';
import { sendResponse } from '../utils/response.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// @desc    Get system health status
// @route   GET /api/v1/health/system
// @access  Public
export const getSystemHealth = asyncHandler(async (req, res) => {
  const memoryUsage = process.memoryUsage();
  const memoryUsageInMB = {
    rss: `${Math.round(memoryUsage.rss / 1024 / 1024 * 100) / 100} MB`,
    heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024 * 100) / 100} MB`,
    heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024 * 100) / 100} MB`,
    external: `${Math.round(memoryUsage.external / 1024 / 1024 * 100) / 100} MB`,
  };

  const healthData = {
    uptime: `${Math.floor(process.uptime())} seconds`,
    environment: process.env.NODE_ENV || 'development',
    memoryUsage: memoryUsageInMB,
    timestamp: new Date().toISOString()
  };

  return sendResponse(res, 200, true, 'System health retrieved successfully', healthData);
});

// @desc    Get database health status
// @route   GET /api/v1/health/database
// @access  Public
export const getDatabaseHealth = asyncHandler(async (req, res) => {
  const isConnected = mongoose.connection.readyState === 1;
  const dbHealthData = {
    status: isConnected ? 'connected' : 'disconnected',
    host: mongoose.connection.host || 'unknown',
    name: mongoose.connection.name || 'unknown',
    timestamp: new Date().toISOString()
  };

  if (!isConnected) {
    return sendResponse(res, 503, false, 'Database is disconnected', dbHealthData);
  }

  return sendResponse(res, 200, true, 'Database is healthy', dbHealthData);
});
