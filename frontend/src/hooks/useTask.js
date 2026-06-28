import { useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';

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

  useEffect(() => {
    if (!id) return;
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
