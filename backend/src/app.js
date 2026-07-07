// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import workflowRoutes from './routes/workflow.routes.js';
import infraRoutes from './routes/infra.routes.js';
import searchRoutes from './routes/search.routes.js';
import yamlRoutes from './routes/yaml.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import debugRoutes from './routes/debug.routes.js';
import adminRoutes from './routes/admin.routes.js';
import monitoringRoutes from './routes/monitoring.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import systemRoutes from './routes/system.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';
import { requestLogger } from './middleware/request.logger.middleware.js';

const app = express();

// ==========================================
// 1. Security and Logging Middleware
// ==========================================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Apply custom request logger
app.use(requestLogger);

// ==========================================
// 2. Body Parsers
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 3. Rate Limiting
// ==========================================
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests to the API. Please try again later.',
    data: null,
    error: { message: 'Rate limit exceeded' }
  }
});

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // strict limit for auth
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again later.',
    data: null,
    error: { message: 'Rate limit exceeded' }
  }
});

app.use('/api/', generalLimiter);
app.use('/api/v1/auth', authLimiter);


// ==========================================
// 4. Core Routes
// ==========================================
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/infra', infraRoutes);
app.use('/api/v1/search', searchRoutes);
app.use('/api/v1/yaml', yamlRoutes);
app.use('/api/v1/analytics', analyticsRoutes);
app.use('/api/v1/debug', debugRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/monitoring', monitoringRoutes);
app.use('/api/v1/system', systemRoutes);
app.use('/api/v1', notificationRoutes); // Handles /notifications, /comments, /reviews

// Base welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the CI/CD and Infrastructure Knowledge Platform API',
    data: null,
    error: null
  });
});

// ==========================================
// 5. Error Handling (must be last)
// ==========================================
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
