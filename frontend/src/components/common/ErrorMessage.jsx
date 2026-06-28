/**
 * src/components/common/ErrorMessage.jsx
 *
 * Displays an inline error banner with an optional retry action.
 *
 * Usage:
 *   <ErrorMessage message="Failed to load tasks" onRetry={refetch} />
 */

import React from 'react';

const AlertCircleIcon = () => (
  <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
  </svg>
);

/**
 * ErrorMessage Component
 *
 * @param {object} props
 * @param {string} [props.message]
 * @param {Function} [props.onRetry]
 * @param {string} [props.retryLabel='Try Again']
 * @param {string} [props.className]
 */
const ErrorMessage = ({
  message = 'Something went wrong. Please try again.',
  onRetry,
  retryLabel = 'Try Again',
  className = '',
}) => {
  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 ${className}`}
    >
      <AlertCircleIcon />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          id="error-retry-btn"
          className="text-sm font-medium underline underline-offset-2 hover:no-underline flex-shrink-0"
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
