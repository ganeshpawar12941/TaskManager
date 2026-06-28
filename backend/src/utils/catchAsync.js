

'use strict';

/**
 * Wraps an async function and forwards any errors to Express error middleware.
 *
 * @param {Function} fn - Async express route handler
 * @returns {Function} Express middleware with error handling
 */
const catchAsync = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

module.exports = catchAsync;
