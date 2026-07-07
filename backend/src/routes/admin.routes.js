// src/routes/admin.routes.js
import express from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole,
  blockUser,
  unblockUser,
  getReports,
  getAdminLogs,
  getAdminSystemHealth,
  restartServices,
  clearCache,
  getSecurityEvents,
  blockIP,
  getBackups,
  createBackup,
  deleteBackup
} from '../controllers/admin.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/role.middleware.js';

const router = express.Router();

// Apply auth + admin role to all admin routes
router.use(authMiddleware, authorizeRoles('admin'));

// ─── User Management ──────────────────────────────────────────────────────────
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.patch('/users/:id/role', updateUserRole);
router.patch('/users/:id/block', blockUser);
router.patch('/users/:id/unblock', unblockUser);

// ─── Reports & Logs ───────────────────────────────────────────────────────────
router.get('/reports', getReports);
router.get('/logs', getAdminLogs);

// ─── System Operations ────────────────────────────────────────────────────────
router.get('/system/health', getAdminSystemHealth);
router.post('/system/restart', restartServices);
router.delete('/cache/clear', clearCache);

// ─── Security ─────────────────────────────────────────────────────────────────
router.get('/security/events', getSecurityEvents);
router.post('/security/block-ip', blockIP);

// ─── Backups ──────────────────────────────────────────────────────────────────
router.get('/backups', getBackups);
router.post('/backups/create', createBackup);
router.delete('/backups/:id', deleteBackup);

export default router;
