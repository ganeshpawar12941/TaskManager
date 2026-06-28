import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import TaskForm from '../components/Task/TaskForm';
import PageLoader from '../components/common/PageLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import { ROUTES } from '../utils/constants';

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const EditTaskPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, loading, error, fetchTaskById, updateTask } = useTaskContext();

  useEffect(() => {
    fetchTaskById(id);
  }, [id, fetchTaskById]);

  const handleSubmit = async (taskData) => {
    try {
      await updateTask(id, taskData);
      navigate(ROUTES.TASK_DETAIL(id));
    } catch (err) {
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading && (!task || task.id !== id)) {
    return <PageLoader message="Loading task details..." />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage
          message={error}
          onRetry={() => fetchTaskById(id)}
        />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <button
          onClick={handleCancel}
          id="edit-task-back-btn"
          className="btn-ghost text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeftIcon />
          Cancel and Back
        </button>
      </div>

      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Edit Task
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Modify the fields below to update this task.
        </p>
      </div>

      <div className="card p-6 sm:p-8">
        {task && task.id === id && (
          <TaskForm
            initialData={task}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            isLoading={loading}
            mode="edit"
          />
        )}
      </div>
    </div>
  );
};

export default EditTaskPage;
