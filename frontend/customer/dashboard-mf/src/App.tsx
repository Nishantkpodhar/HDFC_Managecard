import React from 'react';
import { DashboardPage } from './pages/DashboardPage';
import { useAuth } from '@banking360/auth-client';

export default function App() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-gray-600">Please log in to access the dashboard</p>
        </div>
      </div>
    );
  }

  return <DashboardPage />;
}

