/**
 * src/models/Task.js
 *
 * Mongoose schema and model for the Task resource.
 * Defines fields, types, defaults, validations, indexes, and virtuals.
 */

'use strict';

const mongoose = require('mongoose');

// ─── Constants ─────────────────────────────────────────────────────────────────
const TASK_STATUSES = ['todo', 'in-progress', 'completed'];
const TASK_PRIORITIES = ['low', 'medium', 'high'];

// ─── Task Schema ───────────────────────────────────────────────────────────────
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Task title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters long'],
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
      default: '',
    },

    status: {
      type: String,
      enum: {
        values: TASK_STATUSES,
        message: `Status must be one of: ${TASK_STATUSES.join(', ')}`,
      },
      default: 'todo',
    },

    priority: {
      type: String,
      enum: {
        values: TASK_PRIORITIES,
        message: `Priority must be one of: ${TASK_PRIORITIES.join(', ')}`,
      },
      default: 'medium',
    },

    dueDate: {
      type: Date,
      default: null,
    },

    tags: {
      type: [String],
      default: [],
      validate: {
        validator: (tags) => tags.length <= 10,
        message: 'A task can have at most 10 tags',
      },
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    // Automatically adds createdAt and updatedAt timestamps
    timestamps: true,
    // Removes the __v field from the output
    versionKey: false,
    // Transforms the output to include id and remove _id
    toJSON: {
      virtuals: true,
      transform: (doc, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
    },
  }
);

// ─── Indexes for Performance ───────────────────────────────────────────────────
taskSchema.index({ status: 1 });
taskSchema.index({ priority: 1 });
taskSchema.index({ dueDate: 1 });
taskSchema.index({ createdAt: -1 });
taskSchema.index({ title: 'text', description: 'text' }); // Full-text search

// ─── Virtuals ──────────────────────────────────────────────────────────────────

/**
 * Virtual: isOverdue
 * Returns true if the task is not completed and its due date is in the past.
 */
taskSchema.virtual('isOverdue').get(function () {
  if (!this.dueDate || this.status === 'completed') return false;
  return new Date() > new Date(this.dueDate);
});

/**
 * Virtual: daysUntilDue
 * Returns the number of days until the task is due (negative if overdue).
 */
taskSchema.virtual('daysUntilDue').get(function () {
  if (!this.dueDate) return null;
  const now = new Date();
  const due = new Date(this.dueDate);
  const diffTime = due - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// ─── Pre-save Middleware ───────────────────────────────────────────────────────

/**
 * Pre-save hook: set completedAt when status changes to 'completed'.
 */
taskSchema.pre('save', function (next) {
  if (this.isModified('status')) {
    if (this.status === 'completed' && !this.completedAt) {
      this.completedAt = new Date();
    } else if (this.status !== 'completed') {
      this.completedAt = null;
    }
  }
  // Normalize tags: lowercase, trim, deduplicate
  if (this.isModified('tags')) {
    this.tags = [...new Set(this.tags.map((tag) => tag.trim().toLowerCase()))];
  }
  next();
});

// ─── Static Methods ────────────────────────────────────────────────────────────

/**
 * Static: getStatusCounts
 * Returns a summary count of tasks by status.
 */
taskSchema.statics.getStatusCounts = async function () {
  const counts = await this.aggregate([
    { $match: { isArchived: false } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ]);

  const result = { todo: 0, 'in-progress': 0, completed: 0 };
  counts.forEach((c) => {
    if (c._id in result) {
      result[c._id] = c.count;
    }
  });
  return result;
};

// ─── Instance Methods ──────────────────────────────────────────────────────────

/**
 * Instance: markComplete
 * Marks the task as completed.
 */
taskSchema.methods.markComplete = async function () {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// ─── Export ────────────────────────────────────────────────────────────────────
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
module.exports.TASK_STATUSES = TASK_STATUSES;
module.exports.TASK_PRIORITIES = TASK_PRIORITIES;
