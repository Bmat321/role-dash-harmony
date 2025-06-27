
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import StickyHeader from './StickyHeader';
import CollapsibleSidebar from './CollapsibleSidebar';
import DashboardContent from './DashboardContent';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  if (!user) return null;

  const handleMobileMenuToggle = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CollapsibleSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={handleMobileMenuToggle}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <StickyHeader onMobileMenuToggle={handleMobileMenuToggle} />
        <main className="flex-1 overflow-auto">
          <DashboardContent activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
