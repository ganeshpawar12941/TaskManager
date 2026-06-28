'use strict';

const AppError = require('../utils/AppError');



/**
 * Handles Mongoose CastError (invalid ObjectId)
 */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: "${err.value}". Please provide a valid MongoDB ID.`;
  return new AppError(message, 400);
};

/**
 * Handles Mongoose duplicate key error (code 11000)
 */
const handleDuplicateFieldsDB = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value: "${value}" for field "${field}". Please use a different value.`;
  return new AppError(message, 409);
};

/**
 * Handles Mongoose ValidationError
 */
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => ({
    field: el.path,
    message: el.message,
  }));
  const message = `Validation failed. Please check your input.`;
  const error = new AppError(message, 422);
  error.errors = errors;
  return error;
};

/**
 * Handles invalid JWT token
 */
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again.', 401);

/**
 * Handles expired JWT token
 */
const handleJWTExpiredError = () =>
  new AppError('Your token has expired. Please log in again.', 401);



/**
 * Development error response — includes full stack trace.
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    status: err.status,
    message: err.message,
    errors: err.errors || null,
    stack: err.stack,
  });
};


const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors || null,
    });
  } else {
    // Log the error for debugging
    console.error(' Unexpected Error:', err);
    res.status(500).json({
      success: false,
      message: 'Something went very wrong. Please try again later.',
    });
  }
};


/**
 * Express 4-argument error middleware. Must come after all routes.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = Object.create(err);
    error.message = err.message;

    // Convert known Mongoose / JWT errors to operational AppErrors
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === 'ValidationError') error = handleValidationErrorDB(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};


/**
 * Catches requests to undefined routes and forwards a 404 error.
 */
const notFound = (req, res, next) => {
  next(new AppError(`Route ${req.method} ${req.originalUrl} not found`, 404));
};

module.exports = { errorHandler, notFound };
