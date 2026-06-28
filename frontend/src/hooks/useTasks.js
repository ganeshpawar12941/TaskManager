import { useEffect, useCallback, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';

const useTasks = (initialParams = {}) => {
  const { tasks, loading, error, pagination, filters, fetchTasks, setFilters } =
    useTaskContext();

  const hasFetchedRef = useRef(false);

  const buildQueryParams = useCallback(() => {
    const params = { ...initialParams };
    if (filters.search)   params.search   = filters.search;
    if (filters.status)   params.status   = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.sort)     params.sort     = filters.sort;
    if (pagination.page)  params.page     = pagination.page;
    return params;
  }, [filters, pagination.page, initialParams]);

  useEffect(() => {
    const params = buildQueryParams();
    fetchTasks(params);
  }, [filters, buildQueryParams, fetchTasks]);

  const refetch = useCallback(() => {
    const params = buildQueryParams();
    return fetchTasks(params);
  }, [buildQueryParams, fetchTasks]);

  return {
    tasks,
    loading,
    error,
    pagination,
    filters,
    refetch,
    setFilters,
  };
};

export default useTasks;
