

'use strict';

const Task = require('../models/Task');
const AppError = require('../utils/AppError');
const QueryBuilder = require('../utils/queryBuilder');

/**
 * Task Service
 * Provides CRUD operations and query features for the Task model.
 */
const TaskService = {
  /**
   * Retrieve all tasks with support for filtering, searching, sorting,
   * and pagination via query parameters.
   *
   * @param {object} queryParams - Express req.query object
   * @returns {Promise<{tasks: Task[], total: number, page: number, limit: number}>}
   */
  async getAllTasks(queryParams) {
    const features = new QueryBuilder(Task.find({ isArchived: false }), queryParams)
      .filter()
      .search()
      .sort()
      .limitFields()
      .paginate();

    const tasks = await features.query;
    const total = await features.countTotal();

    const page = parseInt(queryParams.page, 10) || 1;
    const limit = parseInt(queryParams.limit, 10) || 10;

    return { tasks, total, page, limit };
  },

  /**
   * Retrieve a single task by its MongoDB ObjectId.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<Task>}
   * @throws {AppError} 404 if not found
   */
  async getTaskById(id) {
    const task = await Task.findById(id);
    if (!task) {
      throw new AppError(`Task with id "${id}" not found`, 404);
    }
    return task;
  },

  /**
   * Create a new task document.
   *
   * @param {object} taskData - Validated task payload
   * @returns {Promise<Task>}
   */
  async createTask(taskData) {
    const task = await Task.create(taskData);
    return task;
  },

  /**
   * Fully replace a task's fields (PUT semantics).
   *
   * @param {string} id - MongoDB ObjectId string
   * @param {object} taskData - Validated task payload
   * @returns {Promise<Task>}
   * @throws {AppError} 404 if not found
   */
  async updateTask(id, taskData) {
    const task = await Task.findByIdAndUpdate(id, taskData, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      throw new AppError(`Task with id "${id}" not found`, 404);
    }
    return task;
  },

  /**
   * Partially update a task's fields (PATCH semantics).
   *
   * @param {string} id - MongoDB ObjectId string
   * @param {object} partialData - Partial task payload
   * @returns {Promise<Task>}
   * @throws {AppError} 404 if not found
   */
  async patchTask(id, partialData) {
    const task = await Task.findByIdAndUpdate(id, partialData, {
      new: true,
      runValidators: true,
    });
    if (!task) {
      throw new AppError(`Task with id "${id}" not found`, 404);
    }
    return task;
  },

  /**
   * Delete a task by its MongoDB ObjectId.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<void>}
   * @throws {AppError} 404 if not found
   */
  async deleteTask(id) {
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      throw new AppError(`Task with id "${id}" not found`, 404);
    }
    return task;
  },

  /**
   * Get aggregate statistics about tasks grouped by status and priority.
   *
   * @returns {Promise<object>}
   */
  async getTaskStats() {
    const [statusCounts, priorityCountsResult, overdueCount] = await Promise.all([
      Task.getStatusCounts(),
      Task.aggregate([
        { $match: { isArchived: false } },
        {
          $group: {
            _id: '$priority',
            count: { $sum: 1 },
          },
        },
      ]),
      Task.countDocuments({
        isArchived: false,
        status: { $ne: 'completed' },
        dueDate: { $lt: new Date() },
      }),
    ]);

    const byPriority = { low: 0, medium: 0, high: 0 };
    priorityCountsResult.forEach((item) => {
      if (item._id in byPriority) {
        byPriority[item._id] = item.count;
      }
    });

    const total = statusCounts.todo + statusCounts['in-progress'] + statusCounts.completed;

    return {
      total,
      byStatus: statusCounts,
      byPriority,
      overdue: overdueCount,
    };
  },

  /**
   * Archive a task by setting isArchived to true.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<Task>}
   */
  async archiveTask(id) {
    return this.patchTask(id, { isArchived: true });
  },

  /**
   * Bulk delete multiple tasks by their IDs.
   *
   * @param {string[]} ids - Array of MongoDB ObjectId strings
   * @returns {Promise<{ deletedCount: number }>}
   */
  async bulkDeleteTasks(ids) {
    const result = await Task.deleteMany({ _id: { $in: ids } });
    return { deletedCount: result.deletedCount };
  },
};

module.exports = TaskService;
