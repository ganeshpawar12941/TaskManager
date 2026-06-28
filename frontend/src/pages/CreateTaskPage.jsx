/**
 * src/pages/CreateTaskPage.jsx
 *
 * Page for creating a new task.
 * Integrates the TaskForm component.
 */

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import TaskForm from '../components/Task/TaskForm';
import { ROUTES } from '../utils/constants';

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const CreateTaskPage = () => {
  const navigate = useNavigate();
  const { createTask, loading } = useTaskContext();

  const handleSubmit = async (taskData) => {
    try {
      await createTask(taskData);
      navigate(ROUTES.TASKS);
    } catch (err) {
      // Errors are handled inside TaskContext/toast, nothing else needed here
    }
  };

  const handleCancel = () => {
    navigate(-1); // Back to previous page
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* ── Breadcrumbs / Back button ──────────────────────────────────── */}
      <div>
        <button
          onClick={handleCancel}
          id="create-task-back-btn"
          className="btn-ghost text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeftIcon />
          Back to Tasks
        </button>
      </div>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">
          Create New Task
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Add a new task to your dashboard and assign status, priority, and due dates.
        </p>
      </div>

      {/* ── Form Card ──────────────────────────────────────────────────── */}
      <div className="card p-6 sm:p-8">
        <TaskForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={loading}
          mode="create"
        />
      </div>
    </div>
  );
};

export default CreateTaskPage;
