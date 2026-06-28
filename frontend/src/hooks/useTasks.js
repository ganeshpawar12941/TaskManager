/**
 * src/hooks/useTasks.js
 *
 * Custom hook for fetching and managing the task list.
 * Supports search, filter, sort, and pagination query parameters.
 * Automatically re-fetches when filter/sort state changes.
 *
 * Usage:
 *   const { tasks, loading, error, pagination, refetch } = useTasks();
 */

import { useEffect, useCallback, useRef } from 'react';
import { useTaskContext } from '../context/TaskContext';

/**
 * useTasks
 *
 * @param {object} [initialParams={}] - Initial query parameters
 * @returns {{ tasks, loading, error, pagination, filters, refetch, setFilters }}
 */
const useTasks = (initialParams = {}) => {
  const { tasks, loading, error, pagination, filters, fetchTasks, setFilters } =
    useTaskContext();

  // Track whether this is the initial mount to avoid double-fetch in Strict Mode
  const hasFetchedRef = useRef(false);

  // ─── Build query params from filters ────────────────────────────────────
  const buildQueryParams = useCallback(() => {
    const params = { ...initialParams };
    if (filters.search)   params.search   = filters.search;
    if (filters.status)   params.status   = filters.status;
    if (filters.priority) params.priority = filters.priority;
    if (filters.sort)     params.sort     = filters.sort;
    if (pagination.page)  params.page     = pagination.page;
    return params;
  }, [filters, pagination.page, initialParams]);

  // ─── Fetch on mount and when filters change ──────────────────────────────
  useEffect(() => {
    // TODO: implement debounce for search filter changes
    const params = buildQueryParams();
    fetchTasks(params);
  }, [filters, buildQueryParams, fetchTasks]);

  // ─── Manual refetch ──────────────────────────────────────────────────────
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
