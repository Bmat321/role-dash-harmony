import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Home, 
  Users, 
  BarChart, 
  Calendar, 
  FileText, 
  Settings,
  User,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  UserPlus,
  Target,
  Briefcase,
  FolderOpen,
  Timer,
  Menu,
  Award,
  FileUp,
  LayoutDashboard,
  Users as UsersIcon,
  Clock as ClockIcon,
  Calendar as CalendarIcon,
  DollarSign as DollarSignIcon,
  TrendingUp as TrendingUpIcon,
  FileText as FileTextIcon,
  UserPlus as UserPlusIcon,
  FileText as FileTextIcon2,
  FileText as FileTextIcon3,
  Timer as TimerIcon,
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  CreditCard as CreditCardIcon
} from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CollapsibleSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  onMobileToggle: () => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ 
  activeTab, 
  setActiveTab, 
  isMobileOpen, 
  onMobileToggle 
}) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();

  if (!user) return null;

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'employees', icon: UsersIcon, label: 'Employees' },
    { id: 'attendance', icon: ClockIcon, label: 'Attendance' },
    { id: 'leave', icon: CalendarIcon, label: 'Leave Management' },
    { id: 'loan', icon: DollarSignIcon, label: 'Loan Management' },
    { id: 'payroll', icon: CreditCardIcon, label: 'Payroll' },
    { id: 'performance', icon: TrendingUpIcon, label: 'Performance' },
    { id: 'appraisal', icon: FileTextIcon, label: 'Appraisal' },
    { id: 'recruitment', icon: UserPlusIcon, label: 'Recruitment' },
    { id: 'documents', icon: FileTextIcon, label: 'Documents' },
    { id: 'handover', icon: FileTextIcon2, label: 'Handover' },
    { id: 'time-tracking', icon: TimerIcon, label: 'Time Tracking' },
    { id: 'reports', icon: BarChartIcon, label: 'Reports' },
    { id: 'settings', icon: SettingsIcon, label: 'Settings' },
  ];

  const toggleSidebar = () => {
    if (isMobile) {
      onMobileToggle();
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  const handleItemClick = (itemId: string) => {
    setActiveTab(itemId);
    if (isMobile) {
      onMobileToggle();
    }
  };

  // Mobile overlay
  if (isMobile && isMobileOpen) {
    return (
      <>
        {/* Overlay */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
        
        {/* Mobile Sidebar */}
        <div className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-700 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-lg font-bold text-white">HRIS</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileToggle}
                className="text-gray-300 hover:text-white hover:bg-gray-800"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <nav className="p-4">
            <div className="space-y-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Button
                    key={item.id}
                    variant={activeTab === item.id ? "secondary" : "ghost"}
                    className={`w-full justify-start ${
                      activeTab === item.id 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-800'
                    }`}
                    onClick={() => handleItemClick(item.id)}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.label}
                  </Button>
                );
              })}
            </div>
          </nav>
        </div>
      </>
    );
  }

  // Desktop/tablet sidebar
  return (
    <div className={`hidden lg:flex flex-col bg-gray-900 border-r border-gray-700 h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold text-white">HRIS</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={`text-gray-300 hover:text-white hover:bg-gray-800 ${isCollapsed ? 'mx-auto' : ''}`}
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full ${isCollapsed ? 'justify-center px-2' : 'justify-start'} ${
                  activeTab === item.id 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
                onClick={() => handleItemClick(item.id)}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`h-4 w-4 ${!isCollapsed ? 'mr-3' : ''}`} />
                {!isCollapsed && item.label}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default CollapsibleSidebar;
