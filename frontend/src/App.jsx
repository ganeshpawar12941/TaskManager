import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import PageLoader from './components/common/PageLoader';

const HomePage       = lazy(() => import('./pages/HomePage'));
const TasksPage      = lazy(() => import('./pages/TasksPage'));
const CreateTaskPage = lazy(() => import('./pages/CreateTaskPage'));
const TaskDetailPage = lazy(() => import('./pages/TaskDetailPage'));
const EditTaskPage   = lazy(() => import('./pages/EditTaskPage'));
const NotFoundPage   = lazy(() => import('./pages/NotFoundPage'));

const App = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <Navbar />
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
      <Footer />
    </div>
  );
};

export default App;
