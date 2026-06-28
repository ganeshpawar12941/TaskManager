import React, { createContext, useContext, useReducer, useCallback } from 'react';
import toast from 'react-hot-toast';
import TaskAPI from '../api/taskApi';

const TaskContext = createContext(null);

export const TASK_ACTIONS = {
  SET_LOADING:    'SET_LOADING',
  SET_ERROR:      'SET_ERROR',
  SET_TASKS:      'SET_TASKS',
  SET_TASK:       'SET_TASK',
  ADD_TASK:       'ADD_TASK',
  UPDATE_TASK:    'UPDATE_TASK',
  DELETE_TASK:    'DELETE_TASK',
  SET_STATS:      'SET_STATS',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS:    'SET_FILTERS',
  CLEAR_ERROR:    'CLEAR_ERROR',
  RESET:          'RESET',
};

const initialState = {
  tasks:       [],
  task:        null,
  stats:       null,
  loading:     false,
  error:       null,
  pagination: {
    total:      0,
    page:       1,
    limit:      10,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  },
  filters: {
    search:   '',
    status:   '',
    priority: '',
    sort:     '-createdAt',
  },
};

const taskReducer = (state, action) => {
  switch (action.type) {
    case TASK_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case TASK_ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };

    case TASK_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null };

    case TASK_ACTIONS.SET_TASKS:
      return { ...state, loading: false, tasks: action.payload };

    case TASK_ACTIONS.SET_TASK:
      return { ...state, loading: false, task: action.payload };

    case TASK_ACTIONS.ADD_TASK:
      return {
        ...state,
        loading: false,
        tasks: [action.payload, ...state.tasks],
      };

    case TASK_ACTIONS.UPDATE_TASK:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        task: state.task?.id === action.payload.id ? action.payload : state.task,
      };

    case TASK_ACTIONS.DELETE_TASK:
      return {
        ...state,
        loading: false,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };

    case TASK_ACTIONS.SET_STATS:
      return { ...state, stats: action.payload };

    case TASK_ACTIONS.SET_PAGINATION:
      return { ...state, pagination: action.payload };

    case TASK_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case TASK_ACTIONS.RESET:
      return initialState;

    default:
      return state;
  }
};

export const TaskProvider = ({ children }) => {
  const [state, dispatch] = useReducer(taskReducer, initialState);

  const fetchTasks = useCallback(async (params = {}) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await TaskAPI.getAll(params);
      dispatch({ type: TASK_ACTIONS.SET_TASKS, payload: res.data || [] });
      if (res.meta?.pagination) {
        dispatch({ type: TASK_ACTIONS.SET_PAGINATION, payload: res.meta.pagination });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch tasks';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: msg });
    }
  }, []);

  const fetchTaskById = useCallback(async (id) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await TaskAPI.getById(id);
      dispatch({ type: TASK_ACTIONS.SET_TASK, payload: res.data });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to fetch task';
      dispatch({ type: TASK_ACTIONS.SET_ERROR, payload: msg });
      throw err;
    }
  }, []);

  const createTask = useCallback(async (taskData) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await TaskAPI.create(taskData);
      dispatch({ type: TASK_ACTIONS.ADD_TASK, payload: res.data });
      toast.success('Task created successfully!');
      return res.data;
    } catch (err) {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: false });
      const msg = err.response?.data?.message || 'Failed to create task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const updateTask = useCallback(async (id, taskData) => {
    dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: true });
    try {
      const res = await TaskAPI.update(id, taskData);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: res.data });
      toast.success('Task updated successfully!');
      return res.data;
    } catch (err) {
      dispatch({ type: TASK_ACTIONS.SET_LOADING, payload: false });
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const patchTask = useCallback(async (id, partialData) => {
    try {
      const res = await TaskAPI.patch(id, partialData);
      dispatch({ type: TASK_ACTIONS.UPDATE_TASK, payload: res.data });
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const deleteTask = useCallback(async (id) => {
    try {
      await TaskAPI.delete(id);
      dispatch({ type: TASK_ACTIONS.DELETE_TASK, payload: id });
      toast.success('Task deleted successfully.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete task';
      toast.error(msg);
      throw err;
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await TaskAPI.getStats();
      dispatch({ type: TASK_ACTIONS.SET_STATS, payload: res.data });
      return res.data;
    } catch (err) {
      console.error('Failed to fetch stats:', err.message);
    }
  }, []);

  const setFilters = useCallback((newFilters) => {
    dispatch({ type: TASK_ACTIONS.SET_FILTERS, payload: newFilters });
  }, []);

  const value = {
    tasks:      state.tasks,
    task:       state.task,
    stats:      state.stats,
    loading:    state.loading,
    error:      state.error,
    pagination: state.pagination,
    filters:    state.filters,
    fetchTasks,
    fetchTaskById,
    createTask,
    updateTask,
    patchTask,
    deleteTask,
    fetchStats,
    setFilters,
    dispatch,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a <TaskProvider>');
  }
  return context;
};

export default TaskContext;
