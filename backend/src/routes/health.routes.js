// src/routes/health.routes.js
import express from 'express';
import { getSystemHealth, getDatabaseHealth } from '../controllers/health.controller.js';

const router = express.Router();

router.get('/system', getSystemHealth);
router.get('/database', getDatabaseHealth);

// Keep the base route for simple ping
router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;
