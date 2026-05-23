import mongoose from 'mongoose';

/**
 * Configures and establishes connection to MongoDB using Mongoose.
 * Sets up listeners for connection events.
 */
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;

    if (!mongoURI) {
      console.error('CRITICAL: MONGODB_URI environment variable is missing.');
      process.exit(1);
    }

    // Connect with Mongoose
    const conn = await mongoose.connect(mongoURI);

    console.log(`[Database] MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);

    // Register event listeners for ongoing connection states
    mongoose.connection.on('error', (err) => {
      console.error(`[Database] MongoDB runtime connection error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('[Database] MongoDB connection disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('[Database] MongoDB connection successfully reconnected.');
    });
  } catch (error) {
    console.error(`[Database] MongoDB connection attempt failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
