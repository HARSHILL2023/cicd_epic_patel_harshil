const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// ==========================================
// 1. Global Pre-Middlewares
// ==========================================

// Enable Helmet to set security HTTP headers
app.use(helmet());

// Enable Cross-Origin Resource Sharing (CORS)
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Setup Request Logger (Morgan) in development/production friendly mode
const isProduction = process.env.NODE_ENV === 'production';
app.use(morgan(isProduction ? 'combined' : 'dev'));

// Parse incoming JSON payloads (capped at standard size limits for safety)
app.use(express.json({ limit: '10mb' }));

// Parse url-encoded payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ==========================================
// 2. Health Check & Core Base Route
// ==========================================

// Base server health verification endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CI/CD & Infrastructure Knowledge API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

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
      // Stack trace hidden in production for security
      stack: isProduction ? undefined : err.stack
    }
  });
});

module.exports = app;
