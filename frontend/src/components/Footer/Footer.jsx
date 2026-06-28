/**
 * src/components/Footer/Footer.jsx
 *
 * Application footer with copyright, links, and tech stack badges.
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-100 dark:border-slate-800 bg-white dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">

          {/* Brand */}
          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <span className="font-semibold text-gray-900 dark:text-white">
              Task<span className="text-primary-500">Tracker</span>
            </span>
            <span className="text-gray-300 dark:text-slate-600">·</span>
            <span className="text-sm">© {year} All rights reserved.</span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm">
            <Link
              to={ROUTES.HOME}
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to={ROUTES.TASKS}
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              All Tasks
            </Link>
            <Link
              to={ROUTES.NEW_TASK}
              className="text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              New Task
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
