/**
 * src/utils/catchAsync.js
 *
 * Higher-order function that wraps async route handlers to catch
 * rejected promises and forward them to Express's next() error handler,
 * eliminating the need for try/catch in every controller.
 *
 * Usage:
 *   router.get('/route', catchAsync(async (req, res, next) => {
 *     // async logic here — errors are auto-forwarded
 *   }));
 */

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
