/**
 * src/utils/formatters.js
 *
 * Utility functions for formatting dates, text, and status/priority labels.
 * Uses date-fns for date manipulation.
 */

import {
  format,
  formatDistanceToNow,
  isPast,
  isToday,
  isTomorrow,
  parseISO,
  differenceInDays,
} from 'date-fns';

// ─── Date Formatters ───────────────────────────────────────────────────────────

/**
 * Format a date string or Date object for display.
 *
 * @param {string|Date|null} date
 * @param {string} [fmt='MMM dd, yyyy']
 * @returns {string}
 */
export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
  } catch {
    return '—';
  }
};

/**
 * Returns a relative time string (e.g., "3 days ago", "in 2 hours").
 *
 * @param {string|Date|null} date
 * @returns {string}
 */
export const formatRelative = (date) => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
};

/**
 * Returns a human-friendly due date label.
 *
 * @param {string|Date|null} dueDate
 * @returns {string}
 */
export const formatDueDate = (dueDate) => {
  if (!dueDate) return 'No due date';
  try {
    const d = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate;
    if (isToday(d))    return 'Due Today';
    if (isTomorrow(d)) return 'Due Tomorrow';
    if (isPast(d))     return `Overdue by ${Math.abs(differenceInDays(d, new Date()))} day(s)`;
    return `Due ${format(d, 'MMM dd, yyyy')}`;
  } catch {
    return '—';
  }
};

/**
 * Returns true if the given date is in the past.
 *
 * @param {string|Date|null} date
 * @returns {boolean}
 */
export const isOverdue = (date) => {
  if (!date) return false;
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isPast(d) && !isToday(d);
  } catch {
    return false;
  }
};

// ─── Text Formatters ───────────────────────────────────────────────────────────

/**
 * Truncates a string to the given max length and appends '...'.
 *
 * @param {string} str
 * @param {number} [maxLength=80]
 * @returns {string}
 */
export const truncate = (str, maxLength = 80) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

/**
 * Capitalizes the first letter of a string.
 *
 * @param {string} str
 * @returns {string}
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Converts a kebab-case string to Title Case.
 * e.g., 'in-progress' → 'In Progress'
 *
 * @param {string} str
 * @returns {string}
 */
export const kebabToTitle = (str) => {
  if (!str) return '';
  return str
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');
};

// ─── Status / Priority Label Formatters ───────────────────────────────────────

/**
 * Returns the display label for a task status.
 *
 * @param {string} status
 * @returns {string}
 */
export const formatStatus = (status) => {
  const map = {
    todo:          'To Do',
    'in-progress': 'In Progress',
    completed:     'Completed',
  };
  return map[status] || kebabToTitle(status);
};

/**
 * Returns the display label for a task priority.
 *
 * @param {string} priority
 * @returns {string}
 */
export const formatPriority = (priority) => {
  return capitalize(priority || '');
};

// ─── Number Formatters ─────────────────────────────────────────────────────────

/**
 * Formats a number with a compact notation (e.g., 1234 → '1.2K').
 *
 * @param {number} num
 * @returns {string}
 */
export const formatCount = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};

/**
 * Formats a date with time.
 *
 * @param {string|Date|null} date
 * @param {string} [fmt='MMM dd, yyyy, hh:mm a']
 * @returns {string}
 */
export const formatDateTime = (date, fmt = 'MMM dd, yyyy, hh:mm a') => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
  } catch {
    return '—';
  }
};

