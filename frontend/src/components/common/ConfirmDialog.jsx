import React from 'react';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const AlertIcon = () => (
  <div className="flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-full mx-auto mb-4">
    <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  </div>
);

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
  message = 'This action cannot be undone.',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  isLoading = false,
  variant = 'danger',
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" closable={!isLoading}>
      <div className="text-center">
        <AlertIcon />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {message}
        </p>

        <div className="flex gap-3">
          <button
            id="confirm-dialog-cancel-btn"
            onClick={onClose}
            disabled={isLoading}
            className="btn-secondary flex-1"
          >
            {cancelLabel}
          </button>
          <button
            id="confirm-dialog-confirm-btn"
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 ${variant === 'danger' ? 'btn-danger' : 'btn-primary'}`}
          >
            {isLoading ? (
              <LoadingSpinner size="sm" color="white" />
            ) : (
              confirmLabel
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
