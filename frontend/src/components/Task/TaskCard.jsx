/**
 * src/components/Task/TaskCard.jsx
 *
 * Card component for displaying a single task in the task list grid.
 * Shows title, description, status badge, priority badge, due date,
 * tags, and edit/delete action buttons.
 *
 * @placeholder - Interaction handlers to be implemented with business logic
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import Badge from '../common/Badge';
import ConfirmDialog from '../common/ConfirmDialog';
import { formatDueDate, truncate, isOverdue } from '../../utils/formatters';
import { ROUTES } from '../../utils/constants';
import { useTaskContext } from '../../context/TaskContext';

// ─── Icons ─────────────────────────────────────────────────────────────────────
const EditIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const TrashIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

// ─── TaskCard ──────────────────────────────────────────────────────────────────

/**
 * TaskCard Component
 *
 * @param {object} props
 * @param {object} props.task - Task document from the API
 */
const TaskCard = ({ task }) => {
  const navigate = useNavigate();
  const { deleteTask, patchTask } = useTaskContext();

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);

  const overdue = isOverdue(task.dueDate) && task.status !== 'completed';

  // ─── Handlers (placeholders — business logic to be implemented) ───────────

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleMarkComplete = async () => {
    // TODO: Implement optimistic update
    setIsCompleting(true);
    try {
      await patchTask(task.id, { status: 'completed' });
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <>
      <article
        className={clsx(
          'card-hover p-5 group flex flex-col gap-3 animate-fade-in',
          task.status === 'completed' && 'opacity-75'
        )}
        aria-label={`Task: ${task.title}`}
      >
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Link
              to={ROUTES.TASK_DETAIL(task.id)}
              id={`task-card-title-${task.id}`}
              className={clsx(
                'block font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-400',
                'transition-colors line-clamp-2',
                task.status === 'completed' && 'line-through text-gray-500 dark:text-gray-400'
              )}
            >
              {task.title}
            </Link>
          </div>

          {/* Quick Complete Button */}
          {task.status !== 'completed' && (
            <button
              onClick={handleMarkComplete}
              disabled={isCompleting}
              id={`task-complete-btn-${task.id}`}
              title="Mark as completed"
              className="flex-shrink-0 w-7 h-7 rounded-lg border-2 border-gray-200 dark:border-slate-600 flex items-center justify-center text-gray-400 hover:border-green-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200 opacity-0 group-hover:opacity-100"
              aria-label="Mark as completed"
            >
              <CheckIcon />
            </button>
          )}
        </div>

        {/* ── Description ────────────────────────────────────────────── */}
        {task.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* ── Badges ─────────────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="status" value={task.status} />
          <Badge variant="priority" value={task.priority} showDot />
        </div>

        {/* ── Tags ───────────────────────────────────────────────────── */}
        {task.tags && task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="tag" value={tag} />
            ))}
            {task.tags.length > 3 && (
              <span className="badge bg-gray-50 text-gray-500 border-gray-100 dark:bg-slate-700 dark:text-gray-400 dark:border-slate-600">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-700 mt-auto">
          {/* Due Date */}
          <div
            className={clsx(
              'flex items-center gap-1.5 text-xs',
              overdue
                ? 'text-red-500 dark:text-red-400 font-medium'
                : 'text-gray-400 dark:text-gray-500'
            )}
          >
            <CalendarIcon />
            <span>{formatDueDate(task.dueDate)}</span>
            {overdue && <span className="font-bold">!</span>}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Link
              to={ROUTES.EDIT_TASK(task.id)}
              id={`task-edit-btn-${task.id}`}
              className="btn-icon btn-sm text-gray-400 hover:text-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/20"
              title="Edit task"
              aria-label={`Edit "${task.title}"`}
            >
              <EditIcon />
            </Link>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              id={`task-delete-btn-${task.id}`}
              className="btn-icon btn-sm text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              title="Delete task"
              aria-label={`Delete "${task.title}"`}
            >
              <TrashIcon />
            </button>
          </div>
        </div>
      </article>

      {/* Delete Confirmation */}
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
    </>
  );
};

export default TaskCard;
