import React from 'react';

const PageLoader = () => {
  return (
    <div
      className="flex items-center justify-center min-h-[60vh]"
      role="status"
      aria-label="Loading page..."
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-gray-100 dark:border-slate-700" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary-500 animate-spin" />
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
