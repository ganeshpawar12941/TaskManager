import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import Badge from '../components/common/Badge';
import PageLoader from '../components/common/PageLoader';
import ErrorMessage from '../components/common/ErrorMessage';
import ConfirmDialog from '../components/common/ConfirmDialog';
import { formatDueDate, formatDateTime, isOverdue } from '../utils/formatters';
import { ROUTES } from '../utils/constants';

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 6v6l4 2" />
  </svg>
);

const TaskDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, loading, error, fetchTaskById, deleteTask, patchTask } = useTaskContext();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    fetchTaskById(id);
  }, [id, fetchTaskById]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(id);
      navigate(ROUTES.TASKS);
    } catch (err) {
      setIsDeleting(false);
    }
  };

  const handleMarkComplete = async () => {
    setIsCompleting(true);
    try {
      await patchTask(id, { status: 'completed' });
    } finally {
      setIsCompleting(false);
    }
  };

  if (loading && !task) {
    return <PageLoader message="Loading task details..." />;
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-12">
        <ErrorMessage
          message={error}
          onRetry={() => fetchTaskById(id)}
        />
        <div className="mt-4 text-center">
          <Link to={ROUTES.TASKS} className="text-primary-600 dark:text-primary-400 hover:underline">
            &larr; Back to Tasks
          </Link>
        </div>
      </div>
    );
  }

  if (!task) return null;

  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <Link
          to={ROUTES.TASKS}
          id="task-detail-back-btn"
          className="btn-ghost text-gray-500 hover:text-gray-900 dark:hover:text-white"
        >
          <ChevronLeftIcon />
          Tasks List
        </Link>
        <div className="flex items-center gap-2">
          {task.status !== 'completed' && (
            <button
              onClick={handleMarkComplete}
              disabled={isCompleting}
              id="task-detail-complete-btn"
              className="btn-success btn-sm"
            >
              <CheckIcon />
              {isCompleting ? 'Completing...' : 'Complete'}
            </button>
          )}
          <Link
            to={ROUTES.EDIT_TASK(task.id)}
            id="task-detail-edit-btn"
            className="btn-secondary btn-sm"
          >
            <EditIcon />
            Edit
          </Link>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            id="task-detail-delete-btn"
            className="btn-danger btn-sm"
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card p-6 sm:p-8 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="status" value={task.status} />
              <Badge variant="priority" value={task.priority} showDot />
              {overdue && (
                <span className="badge bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800 animate-pulse">
                  Overdue
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              {task.title}
            </h1>

            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                Description
              </h3>
              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed text-base">
                {task.description || (
                  <span className="text-gray-400 italic">No description provided for this task.</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6 space-y-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-slate-800 pb-3">
            Task Metadata
          </h2>

          <div className="flex items-start gap-3">
            <CalendarIcon className="mt-0.5" />
            <div>
              <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Due Date
              </h4>
              <p className={`text-sm font-medium mt-0.5 ${overdue ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
                {formatDueDate(task.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ClockIcon className="mt-0.5" />
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Created At
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                  {formatDateTime(task.createdAt)}
                </p>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  Last Updated
                </h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
                  {formatDateTime(task.updatedAt)}
                </p>
              </div>
              {task.completedAt && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                    Completed At
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-0.5">
                    {formatDateTime(task.completedAt)}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
              Tags
            </h4>
            {task.tags && task.tags.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tag) => (
                  <Badge key={tag} variant="tag" value={tag} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400 italic">No tags</p>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Task"
        message={`Are you sure you want to delete "${task.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isLoading={isDeleting}
        variant="danger"
      />
    </div>
  );
};

export default TaskDetailPage;
