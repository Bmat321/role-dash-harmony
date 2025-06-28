
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
  Menu
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

  const getMenuItems = () => {
    const baseItems = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseItems,
          { id: 'employees', label: 'Employee Management', icon: Users },
          { id: 'invitations', label: 'User Invitations', icon: UserPlus },
          { id: 'performance', label: 'Performance', icon: Target },
          { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
          { id: 'documents', label: 'Documents', icon: FolderOpen },
          { id: 'time-tracking', label: 'Time Tracking', icon: Timer },
          { id: 'analytics', label: 'Analytics', icon: BarChart },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];
      
      case 'hr':
        return [
          ...baseItems,
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'invitations', label: 'User Invitations', icon: UserPlus },
          { id: 'performance', label: 'Performance', icon: Target },
          { id: 'recruitment', label: 'Recruitment', icon: Briefcase },
          { id: 'documents', label: 'Documents', icon: FolderOpen },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Management', icon: Calendar },
          { id: 'reports', label: 'HR Reports', icon: FileText },
        ];
      
      case 'manager':
        return [
          ...baseItems,
          { id: 'team', label: 'My Team', icon: Users },
          { id: 'performance', label: 'Performance', icon: Target },
          { id: 'time-tracking', label: 'Time Tracking', icon: Timer },
          { id: 'attendance', label: 'Team Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Requests', icon: Calendar },
          { id: 'reports', label: 'Team Reports', icon: FileText },
        ];
      
      case 'employee':
        return [
          ...baseItems,
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'time-tracking', label: 'Time Tracking', icon: Timer },
          { id: 'attendance', label: 'My Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Balance', icon: Calendar },
          { id: 'payroll', label: 'Payroll', icon: DollarSign },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

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
        <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-50 lg:hidden transform transition-transform duration-300 ease-in-out">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">H</span>
                </div>
                <span className="text-lg font-bold text-gray-900">HRIS</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onMobileToggle}
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
                        ? 'bg-primary/10 text-primary border-primary/20' 
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
    <div className={`hidden lg:flex flex-col bg-white border-r border-gray-200 h-full transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">H</span>
              </div>
              <span className="text-lg font-bold text-gray-900">HRIS</span>
            </div>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleSidebar}
            className={isCollapsed ? 'mx-auto' : ''}
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
                    ? 'bg-primary/10 text-primary border-primary/20' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
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
