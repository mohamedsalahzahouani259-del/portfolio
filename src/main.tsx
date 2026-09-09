import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <DataProvider>
          <NotificationProvider>
            <App />
          </NotificationProvider>
        </DataProvider>
      </AuthProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
