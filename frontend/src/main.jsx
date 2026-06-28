import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import App from './App';
import { TaskProvider } from './context/TaskContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <TaskProvider>
        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={8}
          containerStyle={{ top: 80 }}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#1e293b',
              color: '#f1f5f9',
              border: '1px solid #334155',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontFamily: 'Inter, sans-serif',
              padding: '12px 16px',
              maxWidth: '380px',
            },
            success: {
              iconTheme: { primary: '#22c55e', secondary: '#fff' },
            },
            error: {
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
            },
          }}
        />
        <App />
      </TaskProvider>
    </BrowserRouter>
  </React.StrictMode>
);
