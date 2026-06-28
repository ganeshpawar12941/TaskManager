import React from 'react';
import clsx from 'clsx';
import { STATUS_BADGE_CLASSES, PRIORITY_BADGE_CLASSES, PRIORITY_DOT_COLORS } from '../../utils/constants';
import { formatStatus, formatPriority } from '../../utils/formatters';

const Badge = ({ variant, value, className = '', showDot = false }) => {
  if (variant === 'status') {
    return (
      <span className={clsx(STATUS_BADGE_CLASSES[value] || 'badge', className)}>
        {formatStatus(value)}
      </span>
    );
  }

  if (variant === 'priority') {
    return (
      <span className={clsx(PRIORITY_BADGE_CLASSES[value] || 'badge', className)}>
        {showDot && (
          <span
            className={clsx('w-1.5 h-1.5 rounded-full', PRIORITY_DOT_COLORS[value] || 'bg-gray-400')}
            aria-hidden="true"
          />
        )}
        {formatPriority(value)}
      </span>
    );
  }

  if (variant === 'tag') {
    return (
      <span
        className={clsx(
          'badge bg-gray-100 text-gray-600 border-gray-200',
          'dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600',
          className
        )}
      >
        # {value}
      </span>
    );
  }

  return (
    <span className={clsx('badge', className)}>
      {value}
    </span>
  );
};

export default Badge;
