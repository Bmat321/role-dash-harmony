
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
  Menu,
  X
} from 'lucide-react';

interface CollapsibleSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

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
          { id: 'invitations', label: 'User Invitations', icon: User },
          { id: 'analytics', label: 'Analytics', icon: BarChart },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];
      
      case 'hr':
        return [
          ...baseItems,
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Management', icon: Calendar },
          { id: 'reports', label: 'HR Reports', icon: FileText },
        ];
      
      case 'manager':
        return [
          ...baseItems,
          { id: 'team', label: 'My Team', icon: Users },
          { id: 'attendance', label: 'Team Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Requests', icon: Calendar },
          { id: 'reports', label: 'Team Reports', icon: FileText },
        ];
      
      case 'employee':
        return [
          ...baseItems,
          { id: 'profile', label: 'My Profile', icon: User },
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
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileSidebar = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <Button
        variant="ghost"
        size="sm"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={toggleMobileSidebar}
      >
        {isMobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div className={`
        ${isCollapsed ? 'w-16' : 'w-64'} 
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        fixed md:relative h-screen bg-white border-r border-gray-200 transition-all duration-300 z-40
      `}>
        {/* Header */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">H</span>
                </div>
                <span className="text-xl font-bold text-gray-900">HRIS</span>
              </div>
            )}
            
            {/* Desktop Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="hidden md:flex p-1"
              onClick={toggleSidebar}
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="px-2 pb-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant={activeTab === item.id ? "secondary" : "ghost"}
                  className={`
                    w-full justify-start relative group
                    ${activeTab === item.id 
                      ? 'bg-primary-50 text-primary-700 border-primary-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                    ${isCollapsed ? 'px-3' : 'px-3'}
                  `}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileOpen(false);
                  }}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`h-4 w-4 ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                  {!isCollapsed && <span className="truncate">{item.label}</span>}
                  
                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50">
                      {item.label}
                    </div>
                  )}
                </Button>
              );
            })}
          </div>
        </nav>
      </div>
    </>
  );
};

export default CollapsibleSidebar;
