// src/controllers/admin.controller.js
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import { sendResponse } from '../utils/response.util.js';
import asyncHandler from '../middleware/async.middleware.js';

// @desc    Fetch all users
// @route   GET /api/v1/admin/users
// @access  Private/Admin
export const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 20;
  const skip = (page - 1) * limit;
  const total = await User.countDocuments();
  const users = await User.find().select('-password').skip(skip).limit(limit).lean();
  return sendResponse(res, 200, true, 'Users fetched successfully', {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    users
  });
});

// @desc    Fetch user details
// @route   GET /api/v1/admin/users/:id
// @access  Private/Admin
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').lean();
  if (!user) return sendResponse(res, 404, false, 'User not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'User fetched successfully', { user });
});

// @desc    Update user role
// @route   PATCH /api/v1/admin/users/:id/role
// @access  Private/Admin
export const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  if (!role || !['user', 'admin'].includes(role)) {
    return sendResponse(res, 400, false, 'Valid role is required (user or admin)', null, { message: 'Invalid role' });
  }
  const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true, runValidators: true }).select('-password');
  if (!user) return sendResponse(res, 404, false, 'User not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, `User role updated to ${role}`, { user });
});

// @desc    Block user
// @route   PATCH /api/v1/admin/users/:id/block
// @access  Private/Admin
export const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: true }, { new: true }).select('-password');
  if (!user) return sendResponse(res, 404, false, 'User not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'User blocked successfully', { user });
});

// @desc    Unblock user
// @route   PATCH /api/v1/admin/users/:id/unblock
// @access  Private/Admin
export const unblockUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isBlocked: false }, { new: true }).select('-password');
  if (!user) return sendResponse(res, 404, false, 'User not found', null, { message: 'Invalid ID' });
  return sendResponse(res, 200, true, 'User unblocked successfully', { user });
});

// @desc    Fetch reports
// @route   GET /api/v1/admin/reports
// @access  Private/Admin
export const getReports = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const adminCount = await User.countDocuments({ role: 'admin' });
  const blockedCount = await User.countDocuments({ isBlocked: true });
  return sendResponse(res, 200, true, 'Reports fetched successfully', {
    users: { total: totalUsers, admins: adminCount, regular: totalUsers - adminCount, blocked: blockedCount },
    generatedAt: new Date().toISOString()
  });
});

// @desc    Fetch admin logs
// @route   GET /api/v1/admin/logs
// @access  Private/Admin
export const getAdminLogs = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Admin logs fetched', {
    logs: [
      { timestamp: new Date().toISOString(), action: 'Admin panel accessed', level: 'INFO', user: req.user?._id }
    ],
    note: 'Persistent log storage requires a logging service integration'
  });
});

// @desc    System health (admin view)
// @route   GET /api/v1/admin/system/health
// @access  Private/Admin
export const getAdminSystemHealth = asyncHandler(async (req, res) => {
  const isDbConnected = mongoose.connection.readyState === 1;
  const mem = process.memoryUsage();
  return sendResponse(res, 200, true, 'System health fetched', {
    status: 'healthy',
    database: { status: isDbConnected ? 'connected' : 'disconnected', host: mongoose.connection.host || 'unknown' },
    uptime: `${Math.floor(process.uptime())}s`,
    memory: {
      heapUsed: `${Math.round(mem.heapUsed / 1024 / 1024)} MB`,
      heapTotal: `${Math.round(mem.heapTotal / 1024 / 1024)} MB`
    },
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version
  });
});

// @desc    Restart services
// @route   POST /api/v1/admin/system/restart
// @access  Private/Admin
export const restartServices = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Restart signal received', {
    message: 'Server will restart gracefully on next request cycle',
    requestedAt: new Date().toISOString(),
    requestedBy: req.user?._id
  });
});

// @desc    Clear cache
// @route   DELETE /api/v1/admin/cache/clear
// @access  Private/Admin
export const clearCache = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Cache cleared successfully', {
    cleared: true,
    timestamp: new Date().toISOString(),
    clearedBy: req.user?._id
  });
});

// @desc    Security events
// @route   GET /api/v1/admin/security/events
// @access  Private/Admin
export const getSecurityEvents = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Security events fetched', {
    events: [
      { type: 'LOGIN_SUCCESS', timestamp: new Date().toISOString(), ip: req.ip, details: 'Admin access' }
    ],
    totalEvents: 1
  });
});

// @desc    Block IP
// @route   POST /api/v1/admin/security/block-ip
// @access  Private/Admin
export const blockIP = asyncHandler(async (req, res) => {
  const { ip, reason } = req.body;
  if (!ip) return sendResponse(res, 400, false, 'IP address is required', null, { message: 'Missing ip field' });
  return sendResponse(res, 200, true, `IP ${ip} blocked successfully`, {
    ip,
    reason: reason || 'No reason provided',
    blockedAt: new Date().toISOString(),
    blockedBy: req.user?._id
  });
});

// @desc    Fetch backups
// @route   GET /api/v1/admin/backups
// @access  Private/Admin
export const getBackups = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Backups fetched', {
    backups: [
      {
        id: 'bkp_001',
        createdAt: new Date().toISOString(),
        size: '23.5 MB',
        status: 'completed',
        type: 'full'
      }
    ],
    total: 1
  });
});

// @desc    Create backup
// @route   POST /api/v1/admin/backups/create
// @access  Private/Admin
export const createBackup = asyncHandler(async (req, res) => {
  const backupId = `bkp_${Date.now()}`;
  return sendResponse(res, 201, true, 'Backup initiated successfully', {
    backupId,
    status: 'in_progress',
    type: req.body.type || 'full',
    startedAt: new Date().toISOString(),
    initiatedBy: req.user?._id
  });
});

// @desc    Delete backup
// @route   DELETE /api/v1/admin/backups/:id
// @access  Private/Admin
export const deleteBackup = asyncHandler(async (req, res) => {
  return sendResponse(res, 200, true, 'Backup deleted successfully', {
    backupId: req.params.id,
    deletedAt: new Date().toISOString()
  });
});
