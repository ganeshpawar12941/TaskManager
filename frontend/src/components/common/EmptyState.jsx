/**
 * src/components/common/EmptyState.jsx
 *
 * Displays a friendly empty state illustration with a title, description,
 * and an optional action button. Used when task lists are empty.
 *
 * Usage:
 *   <EmptyState
 *     title="No tasks yet"
 *     description="Create your first task to get started."
 *     action={{ label: 'Create Task', onClick: () => navigate('/tasks/new') }}
 *   />
 */

import React from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';

// Illustration: Clipboard with checkmark
const EmptyIllustration = ({ className }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="80" fill="#EEF2FF" />
    <rect x="65" y="55" width="70" height="90" rx="8" fill="#C7D2FE" />
    <rect x="75" y="70" width="50" height="6" rx="3" fill="#6366F1" opacity="0.5" />
    <rect x="75" y="86" width="50" height="6" rx="3" fill="#6366F1" opacity="0.4" />
    <rect x="75" y="102" width="35" height="6" rx="3" fill="#6366F1" opacity="0.3" />
    <rect x="80" y="48" width="40" height="14" rx="4" fill="#818CF8" />
    <circle cx="130" cy="135" r="22" fill="#22c55e" />
    <path
      d="M122 135l5 5 11-11"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const FilterEmptyIllustration = ({ className }) => (
  <svg
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-hidden="true"
  >
    <circle cx="100" cy="100" r="80" fill="#FEF3C7" />
    <circle cx="100" cy="90" r="35" stroke="#F59E0B" strokeWidth="5" fill="none" />
    <path
      d="M125 115l20 20"
      stroke="#F59E0B"
      strokeWidth="5"
      strokeLinecap="round"
    />
    <path
      d="M88 90l8 8 16-16"
      stroke="#F59E0B"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      opacity="0.4"
    />
  </svg>
);

/**
 * EmptyState Component
 *
 * @param {object} props
 * @param {string} [props.title]
 * @param {string} [props.description]
 * @param {{ label: string, to?: string, onClick?: Function }} [props.action]
 * @param {'default'|'filtered'} [props.variant='default']
 * @param {string} [props.className]
 */
const EmptyState = ({
  title = 'Nothing here yet',
  description = '',
  action,
  variant = 'default',
  className = '',
}) => {
  return (
    <div
      className={clsx(
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className
      )}
      role="status"
      aria-label={title}
    >
      {/* Illustration */}
      {variant === 'filtered' ? (
        <FilterEmptyIllustration className="w-36 h-36 mb-6" />
      ) : (
        <EmptyIllustration className="w-36 h-36 mb-6" />
      )}

      {/* Text */}
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <>
          {action.to ? (
            <Link to={action.to} className="btn-primary" id="empty-state-action-btn">
              {action.label}
            </Link>
          ) : (
            <button
              onClick={action.onClick}
              className="btn-primary"
              id="empty-state-action-btn"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default EmptyState;
