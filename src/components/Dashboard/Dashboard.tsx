
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

  const handleNavigate = (section: string) => {
    setActiveTab(section);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <CollapsibleSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileSidebarOpen}
        onMobileToggle={handleMobileMenuToggle}
      />
      
      <div className="flex-1 flex flex-col min-w-0 ml-4 lg:ml-6">
        <StickyHeader onMobileMenuToggle={handleMobileMenuToggle} />
        <main className="flex-1 overflow-auto">
          <DashboardContent activeItem={activeTab} onNavigate={handleNavigate} />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
