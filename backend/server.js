'use strict';

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const connectDB = require('./src/config/db');
const taskRoutes = require('./src/routes/taskRoutes');
const { notFound, errorHandler } = require('./src/middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api', limiter);

app.use(compression());
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Task Tracker API is running',
    version: '1.0.0',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API Health OK',
    dbState: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  });
});

app.use('/api/v1/tasks', taskRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api/v1`);
  console.log(`Health Check: http://localhost:${PORT}/api/health`);
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Closing server gracefully...');
  server.close(() => {
    mongoose.connection.close(false, () => {
      console.log('MongoDB connection closed.');
      process.exit(0);
    });
  });
});

module.exports = app;
