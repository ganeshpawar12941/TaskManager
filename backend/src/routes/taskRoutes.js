

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


router
  .route('/')
  .get(listTasksValidator, validateRequest, taskController.getAllTasks)
  .post(createTaskValidator, validateRequest, taskController.createTask);


// Task statistics
router.get('/stats', taskController.getTaskStats);

// Bulk delete
router.delete('/bulk', taskController.bulkDeleteTasks);


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
