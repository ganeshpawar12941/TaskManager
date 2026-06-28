import React, { useEffect, useRef } from 'react';
import clsx from 'clsx';

const SIZE_CLASSES = {
  sm:   'max-w-md',
  md:   'max-w-lg',
  lg:   'max-w-2xl',
  xl:   'max-w-4xl',
  full: 'max-w-full mx-4',
};

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  closable = true,
  className = '',
}) => {
  const overlayRef = useRef(null);
  const dialogRef  = useRef(null);

  useEffect(() => {
    if (!isOpen || !closable) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose, closable]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (closable && e.target === overlayRef.current) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={dialogRef}
        className={clsx(
          'relative w-full bg-white dark:bg-slate-800 rounded-2xl shadow-xl',
          'border border-gray-100 dark:border-slate-700',
          'animate-scale-in',
          SIZE_CLASSES[size] || SIZE_CLASSES.md,
          className
        )}
      >
        {(title || closable) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-slate-700">
            {title && (
              <h2
                id="modal-title"
                className="text-lg font-semibold text-gray-900 dark:text-white"
              >
                {title}
              </h2>
            )}
            {closable && (
              <button
                onClick={onClose}
                id="modal-close-btn"
                className="btn-icon text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 ml-auto"
                aria-label="Close modal"
              >
                <XIcon />
              </button>
            )}
          </div>
        )}

        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
