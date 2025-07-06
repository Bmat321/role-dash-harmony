import React from 'react';
import CollapsibleSidebar from './CollapsibleSidebar';
import StickyHeader from './StickyHeader';
import DashboardOverview from './DashboardOverview';

interface DashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ 
  activeTab, 
  setActiveTab, 
  isMobileOpen, 
  onMobileToggle 
}) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />;
      case 'employees':
        return <div>Employees Content</div>;
      case 'attendance':
        return <div>Attendance Content</div>;
      case 'leave':
        return <div>Leave Management Content</div>;
      case 'loan':
        return <div>Loan Management Content</div>;
      case 'appraisal':
        return <div>Appraisal Management Content</div>;
      case 'appraisal-approval':
        return <div>Appraisal Approval Content</div>;
      case 'payroll':
        return <div>Payroll Management Content</div>;
      case 'performance':
        return <div>Performance Management Content</div>;
      case 'recruitment':
        return <div>Recruitment Content</div>;
      case 'documents':
        return <div>Document Management Content</div>;
      case 'handover':
        return <div>Handover Management Content</div>;
      case 'handover-approval':
        return <div>Handover Approval Content</div>;
      case 'time-tracking':
        return <div>Time Tracking Content</div>;
      case 'analytics':
        return <div>Analytics Content</div>;
      case 'reports':
        return <div>Reports Content</div>;
      case 'settings':
        return <div>Settings Content</div>;
      case 'profile':
        return <div>Profile Content</div>;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <CollapsibleSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isMobileOpen={isMobileOpen}
        onMobileToggle={onMobileToggle}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <StickyHeader 
          onMobileMenuToggle={onMobileToggle}
          onTabChange={setActiveTab}
        />
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default DashboardContent;
