import React from 'react';
import TaskCard from './TaskCard';
import { TaskListSkeleton } from '../common/Skeleton';
import EmptyState from '../common/EmptyState';
import ErrorMessage from '../common/ErrorMessage';
import { ROUTES, EMPTY_STATE } from '../../utils/constants';

const TaskList = ({
  tasks,
  loading,
  error,
  onRetry,
  isFiltered = false,
  onClearFilters,
}) => {
  if (loading) {
    return <TaskListSkeleton count={6} />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={onRetry}
        className="my-8"
      />
    );
  }

  if (!tasks || tasks.length === 0) {
    if (isFiltered) {
      return (
        <EmptyState
          title={EMPTY_STATE.filtered.title}
          description={EMPTY_STATE.filtered.description}
          action={
            onClearFilters
              ? { label: EMPTY_STATE.filtered.action, onClick: onClearFilters }
              : undefined
          }
          variant="filtered"
        />
      );
    }
    return (
      <EmptyState
        title={EMPTY_STATE.tasks.title}
        description={EMPTY_STATE.tasks.description}
        action={{ label: EMPTY_STATE.tasks.action, to: ROUTES.NEW_TASK }}
        variant="default"
      />
    );
  }

  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      role="list"
      aria-label="Task list"
    >
      {tasks.map((task) => (
        <div key={task.id} role="listitem">
          <TaskCard task={task} />
        </div>
      ))}
    </div>
  );
};

export default TaskList;
