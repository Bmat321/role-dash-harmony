
/* eslint-disable react-hooks/rules-of-hooks */

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Login from '@/components/Login';
import Dashboard from '@/components/Dashboard/Dashboard';
import DashboardSkeleton from '@/components/Dashboard/DashboardSkeleton';

const Index = () => {
  try {
    const { user, isLoading } = useAuth();

    console.log('Index page - user:', user, 'isLoading:', isLoading);

    if (isLoading && user) {
      // Show skeleton when user is authenticated but dashboard data is loading
      return <DashboardSkeleton />;
    }

    if (isLoading && !user) {
      // Show simple spinner when checking authentication
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      );
    }

    return user ? <Dashboard /> : <Login />;
  } catch (error) {
    console.error('Error in Index component:', error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please refresh the page to try again.</p>
        </div>
      </div>
    );
  }
};

export default Index;
