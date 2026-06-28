/**
 * src/config/db.js
 *
 * MongoDB connection configuration using Mongoose.
 * Handles connection events and retry logic.
 */

'use strict';

const mongoose = require('mongoose');

/**
 * Connects to MongoDB using the URI from environment variables.
 * Exits the process if the initial connection fails.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // Fail fast if MongoDB is not reachable (5s timeout instead of 30s default)
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 10000,
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📂 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Continuing server execution. Database operations will fail until connected.');
  }
};

// ─── Mongoose Connection Events ────────────────────────────────────────────────
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
  console.info('🔄 MongoDB reconnected');
});

module.exports = connectDB;
