/**
 * src/pages/HomePage.jsx
 *
 * Dashboard / landing page of the Task Tracker application.
 * Shows high-level statistics (total, completed, in-progress, pending, overdue)
 * and lists recent/urgent tasks with quick actions.
 */

import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import StatCard from '../components/Task/StatCard';
import TaskList from '../components/Task/TaskList';
import { ROUTES } from '../utils/constants';

// ─── Icons for Dashboard Stats ────────────────────────────────────────────────
const TotalIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
  </svg>
);

const TodoIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const InProgressIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 8H18.5" />
  </svg>
);

const CompletedIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const OverdueIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// ─── HomePage ──────────────────────────────────────────────────────────────────
const HomePage = () => {
  const { tasks, stats, loading, error, fetchTasks, fetchStats } = useTaskContext();

  // Fetch stats and top 6 urgent tasks on mount
  useEffect(() => {
    fetchStats();
    fetchTasks({ sort: 'dueDate', limit: 6 });
  }, [fetchStats, fetchTasks]);

  // Calculate completion percentage
  const totalTasks = stats?.total || 0;
  const completedTasks = stats?.byStatus?.completed || 0;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* ── Welcome Section ──────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            Task Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1.5">
            Welcome back! Here is a summary of your tasks and projects.
          </p>
        </div>
        <Link
          to={ROUTES.NEW_TASK}
          id="dashboard-new-task-btn"
          className="btn-primary self-start md:self-auto"
        >
          <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Create Task
        </Link>
      </div>

      {/* ── Stats Summary Row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Tasks"
          value={totalTasks}
          icon={<TotalIcon />}
          colorClass="bg-blue-50 dark:bg-blue-900/20"
          iconColorClass="text-blue-600 dark:text-blue-400"
          loading={loading && !stats}
        />
        <StatCard
          title="To Do"
          value={stats?.byStatus?.todo ?? 0}
          icon={<TodoIcon />}
          colorClass="bg-yellow-50 dark:bg-yellow-900/20"
          iconColorClass="text-yellow-600 dark:text-yellow-400"
          loading={loading && !stats}
        />
        <StatCard
          title="In Progress"
          value={stats?.byStatus?.['in-progress'] ?? 0}
          icon={<InProgressIcon />}
          colorClass="bg-purple-50 dark:bg-purple-900/20"
          iconColorClass="text-purple-600 dark:text-purple-400"
          loading={loading && !stats}
        />
        <StatCard
          title="Completed"
          value={completedTasks}
          icon={<CompletedIcon />}
          colorClass="bg-green-50 dark:bg-green-900/20"
          iconColorClass="text-green-600 dark:text-green-400"
          loading={loading && !stats}
        />
        <StatCard
          title="Overdue"
          value={stats?.overdue ?? 0}
          icon={<OverdueIcon />}
          colorClass={stats?.overdue > 0 ? "bg-red-100 dark:bg-red-900/30" : "bg-red-50 dark:bg-red-900/10"}
          iconColorClass="text-red-600 dark:text-red-400"
          trend={stats?.overdue > 0 ? 'Requires attention!' : 'All clear'}
          loading={loading && !stats}
          className={stats?.overdue > 0 ? 'border border-red-200 dark:border-red-800' : ''}
        />
      </div>

      {/* ── Completion Progress Bar ──────────────────────────────────────── */}
      {totalTasks > 0 && (
        <div className="card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Task Completion</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              You have completed <span className="font-semibold text-green-600 dark:text-green-400">{completedTasks}</span> out of{' '}
              <span className="font-semibold">{totalTasks}</span> assigned tasks.
            </p>
          </div>
          <div className="flex-1 max-w-lg w-full space-y-2">
            <div className="flex justify-between items-center text-sm font-semibold">
              <span className="text-gray-500 dark:text-gray-400">Progress</span>
              <span className="text-primary-600 dark:text-primary-400">{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-slate-700 h-3.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-primary-500 to-green-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Recent / Urgent Tasks Section ────────────────────────────────── */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Urgent Tasks</h2>
          <Link
            to={ROUTES.TASKS}
            className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
          >
            View All Tasks &rarr;
          </Link>
        </div>

        <TaskList
          tasks={tasks}
          loading={loading && tasks.length === 0}
          error={error}
          onRetry={() => {
            fetchStats();
            fetchTasks({ sort: 'dueDate', limit: 6 });
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
