/**
 * src/components/common/Skeleton.jsx
 *
 * Skeleton loading placeholder components for task cards and lists.
 *
 * Usage:
 *   <TaskCardSkeleton />
 *   <TaskListSkeleton count={5} />
 */

import React from 'react';

// ─── Single Card Skeleton ─────────────────────────────────────────────────────
export const TaskCardSkeleton = () => (
  <div className="card p-5 animate-pulse">
    {/* Header */}
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1 mr-4">
        <div className="skeleton h-5 w-3/4 rounded mb-2" />
        <div className="skeleton h-4 w-full rounded mb-1" />
        <div className="skeleton h-4 w-2/3 rounded" />
      </div>
      <div className="skeleton w-8 h-8 rounded-lg flex-shrink-0" />
    </div>

    {/* Badges */}
    <div className="flex gap-2 mb-3">
      <div className="skeleton h-5 w-16 rounded-full" />
      <div className="skeleton h-5 w-14 rounded-full" />
    </div>

    {/* Footer */}
    <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700">
      <div className="skeleton h-4 w-24 rounded" />
      <div className="flex gap-2">
        <div className="skeleton w-7 h-7 rounded-lg" />
        <div className="skeleton w-7 h-7 rounded-lg" />
      </div>
    </div>
  </div>
);

// ─── List of Skeletons ─────────────────────────────────────────────────────────
export const TaskListSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <TaskCardSkeleton key={i} />
    ))}
  </div>
);

// ─── Stats Card Skeleton ───────────────────────────────────────────────────────
export const StatCardSkeleton = () => (
  <div className="card p-5 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="skeleton w-10 h-10 rounded-xl" />
      <div className="skeleton h-4 w-20 rounded" />
    </div>
    <div className="skeleton h-8 w-12 rounded" />
  </div>
);

export const StatsRowSkeleton = ({ count = 4 }) => (
  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <StatCardSkeleton key={i} />
    ))}
  </div>
);

export default TaskCardSkeleton;
