/**
 * src/controllers/taskController.js
 *
 * Express route controller for the Task resource.
 * Delegates all database operations to TaskService.
 * Uses catchAsync for consistent async error handling.
 *
 * RESTful Endpoints:
 *   GET    /api/v1/tasks          → getAllTasks
 *   POST   /api/v1/tasks          → createTask
 *   GET    /api/v1/tasks/stats    → getTaskStats
 *   GET    /api/v1/tasks/:id      → getTaskById
 *   PUT    /api/v1/tasks/:id      → updateTask
 *   PATCH  /api/v1/tasks/:id      → patchTask
 *   DELETE /api/v1/tasks/:id      → deleteTask
 *   PATCH  /api/v1/tasks/:id/archive → archiveTask
 *   DELETE /api/v1/tasks/bulk     → bulkDeleteTasks
 */

'use strict';

const mongoose = require('mongoose');
const TaskService = require('../services/taskService');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/AppError');
const { sendSuccess, sendCreated, sendPaginated } = require('../utils/apiResponse');

// ─── Task Controllers ──────────────────────────────────────────────────────────

/**
 * GET /api/v1/tasks
 * Retrieves all tasks with optional filtering, searching, sorting, and pagination.
 */
const getAllTasks = catchAsync(async (req, res, next) => {
  const { tasks, total, page, limit } = await TaskService.getAllTasks(req.query);
  sendPaginated(res, tasks, total, page, limit, 'Tasks retrieved successfully');
});

/**
 * POST /api/v1/tasks
 * Creates a new task from the validated request body.
 */
const createTask = catchAsync(async (req, res, next) => {
  const task = await TaskService.createTask(req.body);
  sendCreated(res, 'Task created successfully', task);
});

/**
 * GET /api/v1/tasks/stats
 * Returns aggregate statistics: counts by status, priority, overdue count.
 */
const getTaskStats = catchAsync(async (req, res, next) => {
  const stats = await TaskService.getTaskStats();
  sendSuccess(res, 200, 'Task statistics retrieved successfully', stats);
});

/**
 * GET /api/v1/tasks/:id
 * Retrieves a single task by its MongoDB ObjectId.
 */
const getTaskById = catchAsync(async (req, res, next) => {
  const task = await TaskService.getTaskById(req.params.id);
  sendSuccess(res, 200, 'Task retrieved successfully', task);
});

/**
 * PUT /api/v1/tasks/:id
 * Fully replaces a task's fields (PUT semantics).
 */
const updateTask = catchAsync(async (req, res, next) => {
  const task = await TaskService.updateTask(req.params.id, req.body);
  sendSuccess(res, 200, 'Task updated successfully', task);
});

/**
 * PATCH /api/v1/tasks/:id
 * Partially updates a task (PATCH semantics).
 */
const patchTask = catchAsync(async (req, res, next) => {
  const task = await TaskService.patchTask(req.params.id, req.body);
  sendSuccess(res, 200, 'Task updated successfully', task);
});

/**
 * DELETE /api/v1/tasks/:id
 * Permanently deletes a task by its MongoDB ObjectId.
 */
const deleteTask = catchAsync(async (req, res, next) => {
  await TaskService.deleteTask(req.params.id);
  sendSuccess(res, 200, 'Task deleted successfully', null);
});

/**
 * PATCH /api/v1/tasks/:id/archive
 * Archives a task (soft delete via isArchived flag).
 */
const archiveTask = catchAsync(async (req, res, next) => {
  const task = await TaskService.archiveTask(req.params.id);
  sendSuccess(res, 200, 'Task archived successfully', task);
});

/**
 * DELETE /api/v1/tasks/bulk
 * Permanently deletes multiple tasks by their IDs (sent in req.body.ids).
 */
const bulkDeleteTasks = catchAsync(async (req, res, next) => {
  const { ids } = req.body;
  
  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    throw new AppError('Please provide an array of task IDs to delete', 400);
  }

  const allValid = ids.every((id) => mongoose.Types.ObjectId.isValid(id));
  if (!allValid) {
    throw new AppError('One or more task IDs are invalid MongoDB ObjectIds', 400);
  }

  const result = await TaskService.bulkDeleteTasks(ids);
  sendSuccess(res, 200, `${result.deletedCount} task(s) deleted successfully`, result);
});

module.exports = {
  getAllTasks,
  createTask,
  getTaskStats,
  getTaskById,
  updateTask,
  patchTask,
  deleteTask,
  archiveTask,
  bulkDeleteTasks,
};
