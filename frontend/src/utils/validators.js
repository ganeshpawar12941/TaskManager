import { FIELD_LIMITS } from './constants';

export const validateTitle = (value) => {
  if (!value || !value.trim()) return 'Title is required';
  if (value.trim().length < FIELD_LIMITS.TITLE_MIN)
    return `Title must be at least ${FIELD_LIMITS.TITLE_MIN} characters`;
  if (value.trim().length > FIELD_LIMITS.TITLE_MAX)
    return `Title cannot exceed ${FIELD_LIMITS.TITLE_MAX} characters`;
  return undefined;
};

export const validateDescription = (value) => {
  if (!value) return undefined;
  if (value.length > FIELD_LIMITS.DESCRIPTION_MAX)
    return `Description cannot exceed ${FIELD_LIMITS.DESCRIPTION_MAX} characters`;
  return undefined;
};

export const validateStatus = (value) => {
  const valid = ['todo', 'in-progress', 'completed'];
  if (value && !valid.includes(value)) return 'Invalid status value';
  return undefined;
};

export const validatePriority = (value) => {
  const valid = ['low', 'medium', 'high'];
  if (value && !valid.includes(value)) return 'Invalid priority value';
  return undefined;
};

export const validateDueDate = (value) => {
  if (!value) return undefined;
  const date = new Date(value);
  if (isNaN(date.getTime())) return 'Invalid date format';
  return undefined;
};

export const validateTags = (tags) => {
  if (!tags || !Array.isArray(tags)) return undefined;
  if (tags.length > FIELD_LIMITS.TAGS_MAX)
    return `You can add at most ${FIELD_LIMITS.TAGS_MAX} tags`;
  if (tags.some((tag) => typeof tag !== 'string' || tag.trim().length === 0))
    return 'Each tag must be a non-empty string';
  return undefined;
};

export const validateTaskForm = (formData) => {
  const errors = {};

  const titleErr    = validateTitle(formData.title);
  const descErr     = validateDescription(formData.description);
  const statusErr   = validateStatus(formData.status);
  const priorityErr = validatePriority(formData.priority);
  const dueDateErr  = validateDueDate(formData.dueDate);
  const tagsErr     = validateTags(formData.tags);

  if (titleErr)    errors.title       = titleErr;
  if (descErr)     errors.description = descErr;
  if (statusErr)   errors.status      = statusErr;
  if (priorityErr) errors.priority    = priorityErr;
  if (dueDateErr)  errors.dueDate     = dueDateErr;
  if (tagsErr)     errors.tags        = tagsErr;

  return errors;
};

export const isFormValid = (errors) => Object.keys(errors).length === 0;
