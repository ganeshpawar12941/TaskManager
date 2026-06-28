/**
 * src/middleware/validateRequest.js
 *
 * Express middleware that checks the result of express-validator chains
 * and responds with a 422 Unprocessable Entity error if any validations failed.
 *
 * Should be placed AFTER the validation chain arrays in route definitions:
 *   router.post('/', createTaskValidator, validateRequest, taskController.create)
 */

'use strict';

const { validationResult } = require('express-validator');

/**
 * Extracts validation errors and sends a structured 422 response if any exist.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((err) => ({
      field: err.path || err.param,
      message: err.msg,
      value: err.value,
    }));

    return res.status(422).json({
      success: false,
      message: 'Validation failed. Please check your input.',
      errors: formattedErrors,
      timestamp: new Date().toISOString(),
    });
  }

  next();
};

module.exports = validateRequest;
