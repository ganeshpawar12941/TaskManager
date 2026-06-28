/**
 * src/validators/taskValidator.js
 *
 * Input validation rules for Task API endpoints using express-validator.
 * Each exported array contains validation chains to be used as route middleware.
 *
 * Usage:
 *   router.post('/', createTaskValidator, validateRequest, controller.create);
 */

'use strict';

const { body, param, query } = require('express-validator');
const { TASK_STATUSES, TASK_PRIORITIES } = require('../models/Task');

// ─── Shared Field Validators ───────────────────────────────────────────────────

const titleValidator = body('title')
  .trim()
  .notEmpty()
  .withMessage('Title is required')
  .isLength({ min: 3, max: 150 })
  .withMessage('Title must be between 3 and 150 characters');

const descriptionValidator = body('description')
  .optional({ nullable: true })
  .trim()
  .isLength({ max: 1000 })
  .withMessage('Description cannot exceed 1000 characters');

const statusValidator = body('status')
  .optional()
  .isIn(TASK_STATUSES)
  .withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`);

const priorityValidator = body('priority')
  .optional()
  .isIn(TASK_PRIORITIES)
  .withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`);

const dueDateValidator = body('dueDate')
  .optional({ nullable: true })
  .isISO8601()
  .withMessage('Due date must be a valid ISO 8601 date string')
  .toDate();

const tagsValidator = body('tags')
  .optional()
  .isArray({ max: 10 })
  .withMessage('Tags must be an array with at most 10 items')
  .custom((tags) => {
    if (!tags.every((tag) => typeof tag === 'string' && tag.trim().length > 0)) {
      throw new Error('Each tag must be a non-empty string');
    }
    return true;
  });

const mongoIdValidator = (location = 'params', fieldName = 'id') => {
  const validators = { params: param, query, body };
  return validators[location](fieldName)
    .isMongoId()
    .withMessage(`${fieldName} must be a valid MongoDB ObjectId`);
};

// ─── Validator Arrays (for use as route middleware) ────────────────────────────

/**
 * Validation rules for POST /api/v1/tasks (Create Task)
 */
const createTaskValidator = [
  titleValidator,
  descriptionValidator,
  statusValidator,
  priorityValidator,
  dueDateValidator,
  tagsValidator,
];

/**
 * Validation rules for PUT /api/v1/tasks/:id (Full Update)
 */
const updateTaskValidator = [
  mongoIdValidator('params', 'id'),
  titleValidator,
  descriptionValidator,
  statusValidator,
  priorityValidator,
  dueDateValidator,
  tagsValidator,
];

/**
 * Validation rules for PATCH /api/v1/tasks/:id (Partial Update)
 */
const patchTaskValidator = [
  mongoIdValidator('params', 'id'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 150 })
    .withMessage('Title must be between 3 and 150 characters'),
  descriptionValidator,
  statusValidator,
  priorityValidator,
  dueDateValidator,
  tagsValidator,
  body('isArchived')
    .optional()
    .isBoolean()
    .withMessage('isArchived must be a boolean value'),
];

/**
 * Validation rules for GET /api/v1/tasks/:id
 */
const getTaskByIdValidator = [mongoIdValidator('params', 'id')];

/**
 * Validation rules for DELETE /api/v1/tasks/:id
 */
const deleteTaskValidator = [mongoIdValidator('params', 'id')];

/**
 * Validation rules for GET /api/v1/tasks (List with filters)
 */
const listTasksValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer')
    .toInt(),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100')
    .toInt(),
  query('status').optional().isIn(TASK_STATUSES).withMessage(`Status must be one of: ${TASK_STATUSES.join(', ')}`),
  query('priority').optional().isIn(TASK_PRIORITIES).withMessage(`Priority must be one of: ${TASK_PRIORITIES.join(', ')}`),
  query('search').optional().trim().isLength({ max: 100 }).withMessage('Search term cannot exceed 100 characters'),
  query('sort').optional().trim().isLength({ max: 100 }).withMessage('Sort parameter is too long'),
];

module.exports = {
  createTaskValidator,
  updateTaskValidator,
  patchTaskValidator,
  getTaskByIdValidator,
  deleteTaskValidator,
  listTasksValidator,
};
