/**
 * src/utils/AppError.js
 *
 * Custom application error class that extends the native Error.
 * Adds HTTP status code and operational flag for structured error handling.
 *
 * Usage:
 *   throw new AppError('Task not found', 404);
 */

'use strict';

class AppError extends Error {
  /**
   * @param {string} message - Human-readable error message
   * @param {number} statusCode - HTTP status code
   */
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    /**
     * Operational errors are expected errors we handle gracefully.
     * Programmer errors (bugs) will not have this flag.
     */
    this.isOperational = true;

    // Captures the stack trace, excluding the constructor call
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
