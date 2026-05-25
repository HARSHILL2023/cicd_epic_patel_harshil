// src/app.js
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';
import knowledgeRoutes from './routes/knowledge.routes.js';
import { notFoundHandler, errorHandler } from './middleware/error.middleware.js';

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

const isProduction = process.env.NODE_ENV === 'production';
app.use(morgan(isProduction ? 'combined' : 'dev'));

// ==========================================
// 2. Body Parsers
// ==========================================
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 3. Rate Limiting
// ==========================================
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again after 15 minutes.',
    data: null,
    error: { message: 'Rate limit exceeded' }
  }
});
app.use('/api/', apiLimiter);

// ==========================================
// 4. Core Routes
// ==========================================
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/knowledge', knowledgeRoutes);

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
