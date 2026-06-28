/**
 * src/routes/taskRoutes.js
 *
 * Express Router for Task resource endpoints.
 * Applies validation middleware before controllers.
 *
 * Base path: /api/v1/tasks (mounted in server.js)
 *
 * Route Map:
 *   GET    /                → getAllTasks    (list with filter/search/sort/pagination)
 *   POST   /                → createTask
 *   GET    /stats           → getTaskStats  (must come BEFORE /:id)
 *   DELETE /bulk            → bulkDeleteTasks
 *   GET    /:id             → getTaskById
 *   PUT    /:id             → updateTask    (full replace)
 *   PATCH  /:id             → patchTask     (partial update)
 *   DELETE /:id             → deleteTask
 *   PATCH  /:id/archive     → archiveTask
 */

'use strict';

const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const validateRequest = require('../middleware/validateRequest');
const {
  createTaskValidator,
  updateTaskValidator,
  patchTaskValidator,
  getTaskByIdValidator,
  deleteTaskValidator,
  listTasksValidator,
} = require('../validators/taskValidator');

// ─── Collection Routes ─────────────────────────────────────────────────────────

router
  .route('/')
  .get(listTasksValidator, validateRequest, taskController.getAllTasks)
  .post(createTaskValidator, validateRequest, taskController.createTask);

// ─── Special Named Routes (must come BEFORE /:id) ─────────────────────────────

// Task statistics
router.get('/stats', taskController.getTaskStats);

// Bulk delete
router.delete('/bulk', taskController.bulkDeleteTasks);

// ─── Single Resource Routes ────────────────────────────────────────────────────

router
  .route('/:id')
  .get(getTaskByIdValidator, validateRequest, taskController.getTaskById)
  .put(updateTaskValidator, validateRequest, taskController.updateTask)
  .patch(patchTaskValidator, validateRequest, taskController.patchTask)
  .delete(deleteTaskValidator, validateRequest, taskController.deleteTask);

// Archive route
router.patch(
  '/:id/archive',
  getTaskByIdValidator,
  validateRequest,
  taskController.archiveTask
);

module.exports = router;
