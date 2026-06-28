/**
 * src/pages/NotFoundPage.jsx
 *
 * Visually engaging 404 error page.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

const HomeIcon = () => (
  <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16">
      {/* 404 Text */}
      <h1 className="text-9xl font-black text-primary-500 tracking-widest animate-pulse">
        404
      </h1>
      
      {/* Visual Indicator */}
      <div className="bg-primary-500 text-white px-2 text-sm rounded rotate-12 absolute -mt-16 select-none font-semibold">
        Page Not Found
      </div>

      <div className="mt-8 space-y-3">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
          Lost in Space?
        </h2>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto text-sm sm:text-base">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
      </div>

      {/* Action buttons */}
      <div className="mt-8 flex flex-col sm:flex-row gap-3">
        <Link
          to={ROUTES.HOME}
          id="not-found-home-btn"
          className="btn-primary"
        >
          <HomeIcon />
          Go to Dashboard
        </Link>
        <Link
          to={ROUTES.TASKS}
          id="not-found-tasks-btn"
          className="btn-secondary"
        >
          View All Tasks
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
