/**
 * src/utils/apiResponse.js
 *
 * Utility helpers for sending consistent JSON API responses.
 * All controller responses should use these helpers.
 */

'use strict';

/**
 * Sends a standardized success response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g., 200, 201)
 * @param {string} message - Human-readable success message
 * @param {*} [data=null] - Response payload
 * @param {object} [meta={}] - Optional metadata (pagination, counts, etc.)
 */
const sendSuccess = (res, statusCode = 200, message = 'Success', data = null, meta = {}) => {
  const response = {
    success: true,
    message,
    ...(data !== null && { data }),
    ...(Object.keys(meta).length > 0 && { meta }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Sends a standardized error response.
 *
 * @param {import('express').Response} res - Express response object
 * @param {number} statusCode - HTTP status code (e.g., 400, 404, 500)
 * @param {string} message - Human-readable error message
 * @param {*} [errors=null] - Detailed error information (e.g., validation errors)
 */
const sendError = (res, statusCode = 500, message = 'Internal Server Error', errors = null) => {
  const response = {
    success: false,
    message,
    ...(errors !== null && { errors }),
    timestamp: new Date().toISOString(),
  };

  return res.status(statusCode).json(response);
};

/**
 * Sends a 201 Created response with the newly created resource.
 *
 * @param {import('express').Response} res
 * @param {string} message
 * @param {*} data
 */
const sendCreated = (res, message = 'Resource created successfully', data = null) => {
  return sendSuccess(res, 201, message, data);
};

/**
 * Sends a paginated list response.
 *
 * @param {import('express').Response} res
 * @param {*[]} data - Array of items
 * @param {number} total - Total number of items (before pagination)
 * @param {number} page - Current page number
 * @param {number} limit - Items per page
 * @param {string} [message='Data retrieved successfully']
 */
const sendPaginated = (res, data, total, page, limit, message = 'Data retrieved successfully') => {
  const totalPages = Math.ceil(total / limit);

  return sendSuccess(res, 200, message, data, {
    pagination: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  });
};

module.exports = {
  sendSuccess,
  sendError,
  sendCreated,
  sendPaginated,
};
