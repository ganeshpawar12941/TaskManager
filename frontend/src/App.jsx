/**
 * src/App.jsx
 *
 * Root application component.
 * Defines the client-side routing structure using React Router v6.
 *
 * Route Map:
 *   /                  → HomePage        (dashboard/landing)
 *   /tasks             → TasksPage       (full task list with search/filter/sort)
 *   /tasks/new         → CreateTaskPage  (create new task form)
 *   /tasks/:id         → TaskDetailPage  (single task view)
 *   /tasks/:id/edit    → EditTaskPage    (edit task form)
 *   *                  → NotFoundPage    (404)
 */

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PageLoader from './components/common/PageLoader';

// Lazy-loaded pages for code splitting / faster initial load
const HomePage       = lazy(() => import('./pages/HomePage'));
const TasksPage      = lazy(() => import('./pages/TasksPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));
const EditTaskPage   = lazy(() => import('./pages/EditTaskPage'));
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'));

/**
 * App Component
 * Top-level layout wrapper with navbar, main content area, and footer.
 */
const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      {/* ── Global Navigation ──────────────────────────────────────────── */}
      <Navbar />

      {/* ── Main Content ───────────────────────────────────────────────── */}
      <main className="flex-1">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/"               element={<HomePage />} />
            <Route path="/tasks"          element={<TasksPage />} />
            <Route path="/tasks/new"      element={<CreateTaskPage />} />
            <Route path="/tasks/:id"      element={<TaskDetailPage />} />
            <Route path="/tasks/:id/edit" element={<EditTaskPage />} />
            <Route path="*"               element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────── */}
      <Footer />
    </div>
  );
};

export default App;
