/**
 * src/hooks/useTask.js
 *
 * Custom hook for fetching and managing a single task by ID.
 * Used in TaskDetailPage and EditTaskPage.
 *
 * Usage:
 *   const { task, loading, error, updateTask, deleteTask } = useTask(id);
 */

import { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

/**
 * useTask
 *
 * @param {string} id - MongoDB ObjectId of the task to fetch
 * @returns {{ task, loading, error, updateTask, patchTask, deleteTask }}
 */
const useTask = (id) => {
  const {
    task,
    loading,
    error,
    fetchTaskById,
    updateTask,
    patchTask,
    deleteTask,
  } = useTaskContext();

  // ─── Fetch single task on mount or when ID changes ───────────────────────
  useEffect(() => {
    if (!id) return;
    // TODO: Add cleanup / cancel pending request on unmount
    fetchTaskById(id);
  }, [id, fetchTaskById]);

  return {
    task,
    loading,
    error,
    updateTask,
    patchTask,
    deleteTask,
  };
};

export default useTask;
