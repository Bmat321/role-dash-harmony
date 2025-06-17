
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import DashboardHeader from './DashboardHeader';
import Sidebar from './Sidebar';
import DashboardContent from './DashboardContent';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6">
          <DashboardContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
