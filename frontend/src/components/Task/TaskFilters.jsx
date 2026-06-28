/**
 * src/components/Task/TaskFilters.jsx
 *
 * Filter, search, and sort bar for the task list.
 * Includes a search input, status filter, priority filter, and sort selector.
 * Emits changes to the parent via onFiltersChange.
 *
 * @placeholder - Debounced search and URL query sync to be implemented
 */

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { TASK_STATUSES, TASK_PRIORITIES, SORT_OPTIONS } from '../../utils/constants';
import useDebounce from '../../hooks/useDebounce';

// ─── Icons ─────────────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="11" cy="11" r="7" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <circle cx="12" cy="12" r="10" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 9l-6 6M9 9l6 6" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
  </svg>
);

const SortIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
  </svg>
);

// ─── TaskFilters ───────────────────────────────────────────────────────────────

/**
 * TaskFilters Component
 *
 * @param {object} props
 * @param {object} props.filters - Current filter state { search, status, priority, sort }
 * @param {Function} props.onFiltersChange - Called with updated filters object
 * @param {number} [props.totalCount] - Total number of tasks (for display)
 */
const TaskFilters = ({ filters, onFiltersChange, totalCount }) => {
  const [searchInput, setSearchInput] = useState(filters.search || '');

  // Debounce search input before applying to filters
  const debouncedSearch = useDebounce(searchInput, 400);

  useEffect(() => {
    if (debouncedSearch !== (filters.search || '')) {
      onFiltersChange({ ...filters, search: debouncedSearch });
    }
  }, [debouncedSearch, filters, onFiltersChange]);

  const handleSearchChange = (value) => {
    setSearchInput(value);
  };

  const handleFilterChange = (field, value) => {
    onFiltersChange({ ...filters, [field]: value });
  };

  const handleClearAll = () => {
    setSearchInput('');
    onFiltersChange({ search: '', status: '', priority: '', sort: '-createdAt' });
  };

  const hasActiveFilters =
    filters.search || filters.status || filters.priority || filters.sort !== '-createdAt';

  return (
    <div className="space-y-3">
      {/* ── Search Bar ────────────────────────────────────────────────── */}
      <div className="relative">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <SearchIcon />
        </div>
        <input
          id="task-search-input"
          type="search"
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search tasks by title or description..."
          className="input pl-10 pr-10"
          aria-label="Search tasks"
        />
        {searchInput && (
          <button
            onClick={() => handleSearchChange('')}
            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Clear search"
          >
            <XCircleIcon />
          </button>
        )}
      </div>

      {/* ── Filter Row ────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Filter icon label */}
        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
          <FilterIcon />
          <span className="hidden sm:inline">Filters:</span>
        </div>

        {/* Status Filter */}
        <select
          id="task-status-filter"
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="select w-auto flex-1 sm:flex-none min-w-[120px]"
          aria-label="Filter by status"
        >
          <option value="">All Statuses</option>
          {TASK_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {/* Priority Filter */}
        <select
          id="task-priority-filter"
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="select w-auto flex-1 sm:flex-none min-w-[130px]"
          aria-label="Filter by priority"
        >
          <option value="">All Priorities</option>
          {TASK_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>

        {/* Sort Selector */}
        <div className="flex items-center gap-1.5 flex-1 sm:flex-none min-w-[160px]">
          <SortIcon className="text-gray-500 dark:text-gray-400 flex-shrink-0" />
          <select
            id="task-sort-selector"
            value={filters.sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
            className="select w-full"
            aria-label="Sort tasks"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            id="clear-filters-btn"
            onClick={handleClearAll}
            className="btn-ghost btn-sm text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
          >
            <XCircleIcon />
            Clear
          </button>
        )}

        {/* Task Count */}
        {typeof totalCount === 'number' && (
          <span className="ml-auto text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">{totalCount}</span> task{totalCount !== 1 ? 's' : ''}
          </span>
        )}
      </div>
    </div>
  );
};

export default TaskFilters;
