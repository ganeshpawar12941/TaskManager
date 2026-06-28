import {
  format,
  formatDistanceToNow,
  isPast,
  isToday,
  isTomorrow,
  parseISO,
  differenceInDays,
} from 'date-fns';

export const formatDate = (date, fmt = 'MMM dd, yyyy') => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
  } catch {
    return '—';
  }
};

export const formatRelative = (date) => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return formatDistanceToNow(d, { addSuffix: true });
  } catch {
    return '—';
  }
};

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

export const isOverdue = (date) => {
  if (!date) return false;
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isPast(d) && !isToday(d);
  } catch {
    return false;
  }
};

export const truncate = (str, maxLength = 80) => {
  if (!str) return '';
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const kebabToTitle = (str) => {
  if (!str) return '';
  return str
    .split('-')
    .map((word) => capitalize(word))
    .join(' ');
};

export const formatStatus = (status) => {
  const map = {
    todo:          'To Do',
    'in-progress': 'In Progress',
    completed:     'Completed',
  };
  return map[status] || kebabToTitle(status);
};

export const formatPriority = (priority) => {
  return capitalize(priority || '');
};

export const formatCount = (num) => {
  if (num === null || num === undefined) return '0';
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return String(num);
};

export const formatDateTime = (date, fmt = 'MMM dd, yyyy, hh:mm a') => {
  if (!date) return '—';
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return format(d, fmt);
  } catch {
    return '—';
  }
};
