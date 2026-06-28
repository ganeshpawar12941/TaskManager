import axiosInstance from './axiosInstance';

const TASKS_ENDPOINT = '/tasks';

const TaskAPI = {
  getAll: async (params = {}) => {
    const response = await axiosInstance.get(TASKS_ENDPOINT, { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await axiosInstance.get(`${TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  create: async (taskData) => {
    const response = await axiosInstance.post(TASKS_ENDPOINT, taskData);
    return response.data;
  },

  update: async (id, taskData) => {
    const response = await axiosInstance.put(`${TASKS_ENDPOINT}/${id}`, taskData);
    return response.data;
  },

  patch: async (id, partialData) => {
    const response = await axiosInstance.patch(`${TASKS_ENDPOINT}/${id}`, partialData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axiosInstance.delete(`${TASKS_ENDPOINT}/${id}`);
    return response.data;
  },

  archive: async (id) => {
    const response = await axiosInstance.patch(`${TASKS_ENDPOINT}/${id}/archive`);
    return response.data;
  },

  getStats: async () => {
    const response = await axiosInstance.get(`${TASKS_ENDPOINT}/stats`);
    return response.data;
  },

  bulkDelete: async (ids) => {
    const response = await axiosInstance.delete(`${TASKS_ENDPOINT}/bulk`, {
      data: { ids },
    });
    return response.data;
  },
};

export default TaskAPI;
