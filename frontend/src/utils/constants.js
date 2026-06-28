export const TASK_STATUSES = [
  { value: 'todo',        label: 'To Do',       color: 'blue'   },
  { value: 'in-progress', label: 'In Progress',  color: 'orange' },
  { value: 'completed',   label: 'Completed',    color: 'green'  },
];

export const TASK_PRIORITIES = [
  { value: 'low',    label: 'Low',    color: 'green'  },
  { value: 'medium', label: 'Medium', color: 'yellow' },
  { value: 'high',   label: 'High',   color: 'red'    },
];

export const SORT_OPTIONS = [
  { value: '-createdAt',  label: 'Newest First'    },
  { value: 'createdAt',   label: 'Oldest First'    },
  { value: '-dueDate',    label: 'Due Date (Latest)' },
  { value: 'dueDate',     label: 'Due Date (Earliest)' },
  { value: 'title',       label: 'Title (A-Z)'     },
  { value: '-title',      label: 'Title (Z-A)'     },
  { value: '-priority',   label: 'Priority (High)' },
  { value: 'priority',    label: 'Priority (Low)'  },
];

export const ROUTES = {
  HOME:        '/',
  TASKS:       '/tasks',
  NEW_TASK:    '/tasks/new',
  TASK_DETAIL: (id) => `/tasks/${id}`,
  EDIT_TASK:   (id) => `/tasks/${id}/edit`,
};

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

export const STATUS_BADGE_CLASSES = {
  'todo':        'badge-todo',
  'in-progress': 'badge-in-progress',
  'completed':   'badge-completed',
};

export const PRIORITY_BADGE_CLASSES = {
  'low':    'badge-low',
  'medium': 'badge-medium',
  'high':   'badge-high',
};

export const PRIORITY_DOT_COLORS = {
  'low':    'bg-green-400',
  'medium': 'bg-yellow-400',
  'high':   'bg-red-400',
};

export const EMPTY_STATE = {
  tasks: {
    title:       'No tasks yet',
    description: 'Create your first task to get started.',
    action:      'Create Task',
  },
  filtered: {
    title:       'No matching tasks',
    description: 'Try adjusting your search or filters.',
    action:      'Clear Filters',
  },
};

export const FIELD_LIMITS = {
  TITLE_MIN:       3,
  TITLE_MAX:       150,
  DESCRIPTION_MAX: 1000,
  TAGS_MAX:        10,
};

export const DATE_FORMATS = {
  DISPLAY:   'MMM dd, yyyy',
  DISPLAY_SHORT: 'MMM dd',
  INPUT:     "yyyy-MM-dd'T'HH:mm",
  RELATIVE:  'relative',
};
