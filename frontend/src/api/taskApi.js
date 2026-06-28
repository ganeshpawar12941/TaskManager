/**
 * src/api/taskApi.js
 *
 * Task API service — wraps all Axios calls to the backend task endpoints.
 * Components and hooks should import from here, not call axios directly.
 *
 * All functions return the `data` property of the axios response
 * (the standardized API response object from the backend).
 */

import axiosInstance from './axiosInstance';

const TASKS_ENDPOINT = '/tasks';

// ─── Task API Methods ──────────────────────────────────────────────────────────

const TaskAPI = {
  /**
   * Fetch all tasks with optional query parameters for filtering/sorting/pagination.
   *
   * @param {object} params - Query parameters (status, priority, search, sort, page, limit)
   * @returns {Promise<{ success, data, meta }>}
   * @placeholder - Will be fully utilized once business logic is implemented
   */
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(TASKS_ENDPOINT, { params });
    return response.data;
  },

  /**
   * Fetch a single task by its ID.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<{ success, data }>}
   */
  getById: async (id) => {
    const response = await axiosInstance.get(`${TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Create a new task.
   *
   * @param {object} taskData - Task payload { title, description, status, priority, dueDate, tags }
   * @returns {Promise<{ success, data }>}
   */
  create: async (taskData) => {
    const response = await axiosInstance.post(TASKS_ENDPOINT, taskData);
    return response.data;
  },

  /**
   * Fully replace a task (PUT).
   *
   * @param {string} id - MongoDB ObjectId string
   * @param {object} taskData - Full task payload
   * @returns {Promise<{ success, data }>}
   */
  update: async (id, taskData) => {
    const response = await axiosInstance.put(`${TASKS_ENDPOINT}/${id}`, taskData);
    return response.data;
  },

  /**
   * Partially update a task (PATCH).
   *
   * @param {string} id - MongoDB ObjectId string
   * @param {object} partialData - Partial task payload
   * @returns {Promise<{ success, data }>}
   */
  patch: async (id, partialData) => {
    const response = await axiosInstance.patch(`${TASKS_ENDPOINT}/${id}`, partialData);
    return response.data;
  },

  /**
   * Delete a task by ID.
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<{ success, message }>}
   */
  delete: async (id) => {
    const response = await axiosInstance.delete(`${TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  /**
   * Archive a task (soft delete).
   *
   * @param {string} id - MongoDB ObjectId string
   * @returns {Promise<{ success, data }>}
   */
  archive: async (id) => {
    const response = await axiosInstance.patch(`${TASKS_ENDPOINT}/${id}/archive`);
    return response.data;
  },

  /**
   * Get task statistics (counts by status, priority, overdue).
   *
   * @returns {Promise<{ success, data }>}
   */
  getStats: async () => {
    const response = await axiosInstance.get(`${TASKS_ENDPOINT}/stats`);
    return response.data;
  },

  /**
   * Bulk delete multiple tasks by their IDs.
   *
   * @param {string[]} ids - Array of MongoDB ObjectId strings
   * @returns {Promise<{ success, data }>}
   */
  bulkDelete: async (ids) => {
    const response = await axiosInstance.delete(`${TASKS_ENDPOINT}/bulk`, {
      data: { ids },
    });
    return response.data;
  },
};

export default TaskAPI;
