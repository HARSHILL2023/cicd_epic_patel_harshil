import dotenv from 'dotenv';
import app from './src/app.js';
import connectDB from './src/config/db.js';

dotenv.config();

// Handle uncaught exceptions globally to prevent silent corruption
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception caught! Shutting down server...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

/**
 * Boots the server and establishes connection to the database.
 */
const startServer = async () => {
  // Connect to the database
  await connectDB();

  const PORT = process.env.PORT || 5000;

  const server = app.listen(PORT, () => {
    console.log(`[Server] CI/CD & Infrastructure API running in [${process.env.NODE_ENV || 'development'}] mode on port ${PORT}`);
  });

  // Handle unhandled promise rejections globally
  process.on('unhandledRejection', (err) => {
    console.error('CRITICAL: Unhandled Rejection caught! Initiating graceful shutdown...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

// Start the server
startServer();
