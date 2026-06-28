import React from 'react';
import clsx from 'clsx';
import { StatCardSkeleton } from '../common/Skeleton';

const StatCard = ({
  title,
  value,
  icon,
  colorClass     = 'bg-primary-50 dark:bg-primary-900/20',
  iconColorClass = 'text-primary-600 dark:text-primary-400',
  trend,
  loading = false,
  className = '',
}) => {
  if (loading) return <StatCardSkeleton />;

  return (
    <div className={clsx('card p-5 flex items-center gap-4', className)}>
      <div className={clsx('flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center', colorClass)}>
        <span className={iconColorClass}>{icon}</span>
      </div>

      <div className="min-w-0">
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium truncate">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white leading-none mt-0.5">
          {value ?? '—'}
        </p>
        {trend && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{trend}</p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
