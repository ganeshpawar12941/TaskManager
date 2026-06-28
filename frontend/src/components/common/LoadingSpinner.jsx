/**
 * src/components/common/LoadingSpinner.jsx
 *
 * Reusable inline loading spinner with configurable size and color.
 *
 * Usage:
 *   <LoadingSpinner size="sm" />
 *   <LoadingSpinner size="lg" color="white" />
 */

import React from 'react';
import clsx from 'clsx';

const SIZE_CLASSES = {
  xs:  'w-3 h-3 border-2',
  sm:  'w-5 h-5 border-2',
  md:  'w-8 h-8 border-[3px]',
  lg:  'w-12 h-12 border-4',
  xl:  'w-16 h-16 border-4',
};

const COLOR_CLASSES = {
  primary: 'border-primary-500',
  white:   'border-white',
  gray:    'border-gray-400',
  green:   'border-green-500',
  red:     'border-red-500',
};

/**
 * LoadingSpinner
 *
 * @param {object} props
 * @param {'xs'|'sm'|'md'|'lg'|'xl'} [props.size='md']
 * @param {'primary'|'white'|'gray'|'green'|'red'} [props.color='primary']
 * @param {string} [props.className]
 * @param {string} [props.label='Loading...']
 */
const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  className = '',
  label = 'Loading...',
}) => {
  return (
    <div
      role="status"
      aria-label={label}
      className={clsx('inline-flex items-center justify-center', className)}
    >
      <div
        className={clsx(
          'rounded-full border-gray-200 dark:border-slate-600',
          'border-t-transparent animate-spin',
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
        )}
        style={{
          borderTopColor:
            color === 'primary' ? '#6366f1'
            : color === 'white' ? '#ffffff'
            : color === 'gray'  ? '#9ca3af'
            : color === 'green' ? '#22c55e'
            : color === 'red'   ? '#ef4444'
            : '#6366f1',
        }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
};

export default LoadingSpinner;
