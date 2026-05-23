import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRoutes from './routes/health.routes.js';
import authRoutes from './routes/auth.routes.js';

const app = express();

// ==========================================
// 1. Global Pre-Middlewares
// ==========================================
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
const isProduction = process.env.NODE_ENV === 'production';
app.use(morgan(isProduction ? 'combined' : 'dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 2. Core Routes
// ==========================================
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/auth', authRoutes);

// Base welcome route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to the CI/CD & Infrastructure Knowledge Platform API'
  });
});

// ==========================================
// 3. Fallback Route & 404 Handling
// ==========================================
app.use((req, res, next) => {
  const error = new Error(`Cannot find requested route ${req.originalUrl} on this server`);
  error.status = 404;
  next(error);
});

// ==========================================
// 4. Centralized Error Handling Middleware
// ==========================================
app.use((err, req, res, next) => {
  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      status: statusCode,
      stack: isProduction ? undefined : err.stack
    }
  });
});

export default app;
