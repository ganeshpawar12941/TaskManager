/**
 * src/components/Task/TaskForm.jsx
 *
 * Reusable task form for both Create and Edit pages.
 * Handles all form fields: title, description, status, priority, dueDate, tags.
 * Performs frontend validation before submission.
 *
 * @placeholder - Form submission logic to be wired to context actions
 */

import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import LoadingSpinner from '../common/LoadingSpinner';
import { TASK_STATUSES, TASK_PRIORITIES, FIELD_LIMITS } from '../../utils/constants';
import { validateTaskForm, isFormValid } from '../../utils/validators';

// ─── Tag Input ─────────────────────────────────────────────────────────────────
const TagInput = ({ tags, onChange }) => {
  const [inputValue, setInputValue] = useState('');

  const addTag = (value) => {
    const trimmed = value.trim().toLowerCase();
    if (!trimmed || tags.includes(trimmed) || tags.length >= FIELD_LIMITS.TAGS_MAX) return;
    onChange([...tags, trimmed]);
    setInputValue('');
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag(inputValue);
    }
    if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags[tags.length - 1]);
    }
  };

  return (
    <div className="input flex flex-wrap gap-1.5 min-h-[44px] h-auto cursor-text" onClick={() => document.getElementById('tag-input')?.focus()}>
      {tags.map((tag) => (
        <span key={tag} className="badge bg-primary-50 text-primary-700 border-primary-100 dark:bg-primary-900/30 dark:text-primary-300 dark:border-primary-800 flex items-center gap-1">
          # {tag}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); removeTag(tag); }}
            className="hover:text-red-500 transition-colors ml-0.5"
            aria-label={`Remove tag: ${tag}`}
          >
            ×
          </button>
        </span>
      ))}
      <input
        id="tag-input"
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => { if (inputValue) addTag(inputValue); }}
        placeholder={tags.length === 0 ? 'Add tags (press Enter or comma)' : ''}
        className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm placeholder-gray-400 dark:placeholder-slate-500 p-0"
        disabled={tags.length >= FIELD_LIMITS.TAGS_MAX}
      />
    </div>
  );
};

// ─── TaskForm ──────────────────────────────────────────────────────────────────

const DEFAULT_FORM_DATA = {
  title:       '',
  description: '',
  status:      'todo',
  priority:    'medium',
  dueDate:     '',
  tags:        [],
};

/**
 * TaskForm Component
 *
 * @param {object} props
 * @param {object} [props.initialData] - Pre-populated data for edit mode
 * @param {Function} props.onSubmit - Called with validated form data
 * @param {boolean} [props.isLoading=false]
 * @param {'create'|'edit'} [props.mode='create']
 * @param {Function} [props.onCancel]
 */
const TaskForm = ({
  initialData,
  onSubmit,
  isLoading = false,
  mode = 'create',
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    ...DEFAULT_FORM_DATA,
    ...(initialData || {}),
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // Populate form when initialData changes (edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...DEFAULT_FORM_DATA,
        ...initialData,
        // Format date for datetime-local input
        dueDate: initialData.dueDate
          ? new Date(initialData.dueDate).toISOString().slice(0, 16)
          : '',
      });
    }
  }, [initialData]);

  // ─── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    // Validate on blur
    const fieldErrors = validateTaskForm(formData);
    if (fieldErrors[field]) {
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields as touched
    setTouched({ title: true, description: true, status: true, priority: true, dueDate: true, tags: true });

    const validationErrors = validateTaskForm(formData);
    setErrors(validationErrors);

    if (!isFormValid(validationErrors)) return;

    // Build payload (remove empty optional fields)
    const payload = {
      ...formData,
      dueDate: formData.dueDate || null,
      description: formData.description || '',
    };

    await onSubmit(payload);
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-label={mode === 'create' ? 'Create Task Form' : 'Edit Task Form'}
    >
      {/* ── Title ─────────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="task-title" className="label">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="task-title"
          type="text"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          onBlur={() => handleBlur('title')}
          placeholder="e.g., Design the landing page"
          className={clsx('input', touched.title && errors.title && 'input-error')}
          maxLength={FIELD_LIMITS.TITLE_MAX}
          aria-describedby={errors.title ? 'title-error' : undefined}
          aria-invalid={!!errors.title}
          disabled={isLoading}
        />
        {/* Character count */}
        <div className="flex justify-between mt-1">
          {touched.title && errors.title ? (
            <span id="title-error" className="error-msg">{errors.title}</span>
          ) : (
            <span />
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {formData.title.length}/{FIELD_LIMITS.TITLE_MAX}
          </span>
        </div>
      </div>

      {/* ── Description ───────────────────────────────────────────────── */}
      <div>
        <label htmlFor="task-description" className="label">
          Description
        </label>
        <textarea
          id="task-description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          onBlur={() => handleBlur('description')}
          placeholder="Add more details about this task..."
          className={clsx('textarea', touched.description && errors.description && 'input-error')}
          rows={4}
          maxLength={FIELD_LIMITS.DESCRIPTION_MAX}
          disabled={isLoading}
        />
        <div className="flex justify-between mt-1">
          {touched.description && errors.description && (
            <span className="error-msg">{errors.description}</span>
          )}
          <span className="text-xs text-gray-400 dark:text-gray-500 ml-auto">
            {formData.description.length}/{FIELD_LIMITS.DESCRIPTION_MAX}
          </span>
        </div>
      </div>

      {/* ── Status & Priority Row ──────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Status */}
        <div>
          <label htmlFor="task-status" className="label">Status</label>
          <select
            id="task-status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className="select"
            disabled={isLoading}
          >
            {TASK_STATUSES.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        {/* Priority */}
        <div>
          <label htmlFor="task-priority" className="label">Priority</label>
          <select
            id="task-priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="select"
            disabled={isLoading}
          >
            {TASK_PRIORITIES.map((p) => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Due Date ──────────────────────────────────────────────────── */}
      <div>
        <label htmlFor="task-due-date" className="label">Due Date</label>
        <input
          id="task-due-date"
          type="datetime-local"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          onBlur={() => handleBlur('dueDate')}
          className={clsx('input', touched.dueDate && errors.dueDate && 'input-error')}
          disabled={isLoading}
        />
        {touched.dueDate && errors.dueDate && (
          <span className="error-msg">{errors.dueDate}</span>
        )}
      </div>

      {/* ── Tags ──────────────────────────────────────────────────────── */}
      <div>
        <label className="label">
          Tags
          <span className="text-gray-400 dark:text-gray-500 font-normal ml-1">
            ({formData.tags.length}/{FIELD_LIMITS.TAGS_MAX})
          </span>
        </label>
        <TagInput
          tags={formData.tags}
          onChange={(tags) => handleChange('tags', tags)}
        />
        {touched.tags && errors.tags && (
          <span className="error-msg">{errors.tags}</span>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Press Enter or comma to add a tag. Backspace to remove the last tag.
        </p>
      </div>

      {/* ── Form Actions ───────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            id="task-form-cancel-btn"
            className="btn-secondary flex-1 sm:flex-none"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isLoading}
          id="task-form-submit-btn"
          className="btn-primary flex-1"
        >
          {isLoading ? (
            <>
              <LoadingSpinner size="sm" color="white" />
              {mode === 'create' ? 'Creating...' : 'Saving...'}
            </>
          ) : (
            mode === 'create' ? 'Create Task' : 'Save Changes'
          )}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
