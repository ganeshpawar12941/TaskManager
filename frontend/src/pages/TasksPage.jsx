import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import TaskFilters from '../components/Task/TaskFilters';
import TaskList from '../components/Task/TaskList';
import { ROUTES } from '../utils/constants';

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const TasksPage = () => {
  const {
    tasks,
    loading,
    error,
    pagination,
    filters,
    fetchTasks,
    setFilters,
  } = useTaskContext();

  useEffect(() => {
    fetchTasks({ ...filters, page: 1 });
  }, [filters, fetchTasks]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({ search: '', status: '', priority: '', sort: '-createdAt' });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    fetchTasks({ ...filters, page: newPage });
  };

  const isFiltered = !!(filters.search || filters.status || filters.priority);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            All Tasks
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage, filter, and track all your tasks.
          </p>
        </div>
        <Link
          to={ROUTES.NEW_TASK}
          id="tasks-new-task-btn"
          className="btn-primary self-start sm:self-auto"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </Link>
      </div>

      <div className="card p-4">
        <TaskFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          totalCount={pagination.total}
        />
      </div>

      <TaskList
        tasks={tasks}
        loading={loading}
        error={error}
        onRetry={() => fetchTasks({ ...filters, page: pagination.page })}
        isFiltered={isFiltered}
        onClearFilters={handleClearFilters}
      />

      {!loading && !error && pagination.totalPages > 1 && (
        <nav
          className="flex items-center justify-between border-t border-gray-200 dark:border-slate-800 pt-6 mt-4"
          aria-label="Pagination Navigation"
        >
          <div className="flex-1 flex justify-between sm:justify-end gap-3">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              id="tasks-pagination-prev-btn"
              className="btn-secondary"
            >
              <ChevronLeftIcon />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
              Page <span className="font-semibold mx-1 text-gray-900 dark:text-white">{pagination.page}</span> of{' '}
              <span className="font-semibold mx-1 text-gray-900 dark:text-white">{pagination.totalPages}</span>
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.totalPages}
              id="tasks-pagination-next-btn"
              className="btn-secondary"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRightIcon />
            </button>
          </div>
        </nav>
      )}
    </div>
  );
};

export default TasksPage;
