
import React from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
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
  Building,
  TrendingUp,
  Target,
  CreditCard,
  FileCheck,
  UserCheck,
  Menu,
  X,
  LogOut,
  ChevronDown
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: number;
}

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
  const { user, logout } = useAuth();

  if (!user) return null;

  const getMenuItems = (): MenuItem[] => {
    const baseItems: MenuItem[] = [
      { id: 'dashboard', label: 'Dashboard', icon: Home },
    ];

    switch (user.role) {
      case 'admin':
        return [
          ...baseItems,
          { id: 'employees', label: 'Employee Management', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Management', icon: Calendar },
          { id: 'loan', label: 'Loan Management', icon: CreditCard },
          { id: 'appraisal', label: 'Performance Review', icon: Target },
          { id: 'payroll', label: 'Payroll Management', icon: DollarSign },
          { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
          { id: 'handover', label: 'Handover Management', icon: FileCheck },
          { id: 'handover-approval', label: 'Handover Approval', icon: FileText, badge: 3 },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'time-tracking', label: 'Time Tracking', icon: Clock },
          { id: 'analytics', label: 'Analytics', icon: BarChart },
          { id: 'reports', label: 'Reports', icon: TrendingUp },
          { id: 'settings', label: 'System Settings', icon: Settings },
        ];
      
      case 'hr':
        return [
          ...baseItems,
          { id: 'employees', label: 'Employees', icon: Users },
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Management', icon: Calendar },
          { id: 'loan', label: 'Loan Management', icon: CreditCard },
          { id: 'appraisal', label: 'Performance Review', icon: Target },
          { id: 'payroll', label: 'Payroll Management', icon: DollarSign },
          { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
          { id: 'handover-approval', label: 'Handover Approval', icon: FileText, badge: 2 },
          { id: 'documents', label: 'Documents', icon: FileText },
          { id: 'reports', label: 'HR Reports', icon: TrendingUp },
          { id: 'analytics', label: 'Analytics', icon: BarChart },
        ];
      
      case 'manager':
      case 'team_lead':
        return [
          ...baseItems,
          { id: 'employees', label: 'My Team', icon: Users },
          { id: 'attendance', label: 'Team Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Requests', icon: Calendar },
          { id: 'appraisal', label: 'Performance Review', icon: Target },
          { id: 'handover-approval', label: 'Handover Approval', icon: FileText, badge: 1 },
          { id: 'reports', label: 'Team Reports', icon: TrendingUp },
          { id: 'analytics', label: 'Analytics', icon: BarChart },
        ];
      
      case 'employee':
        return [
          ...baseItems,
          { id: 'attendance', label: 'My Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Balance', icon: Calendar },
          { id: 'loan', label: 'My Loans', icon: CreditCard },
          { id: 'appraisal', label: 'My Reviews', icon: Target },
          { id: 'payroll', label: 'Payroll', icon: DollarSign },
          { id: 'handover', label: 'Handover Reports', icon: FileCheck },
          { id: 'time-tracking', label: 'Time Tracking', icon: Clock },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const handleLogout = () => {
    logout();
  };

  const handleProfileClick = () => {
    setActiveTab('profile');
  };

  const handleSettingsClick = () => {
    setActiveTab('settings');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onMobileToggle}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-0
        w-64 bg-gray-900 border-r border-gray-700 
        transform ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 transition-transform duration-200 ease-in-out
        flex flex-col
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-white">HRIS</span>
          </div>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden text-gray-400 hover:text-white hover:bg-gray-800"
            onClick={onMobileToggle}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-4">
          <div className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  className={`w-full justify-start relative ${
                    activeTab === item.id 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-800'
                  }`}
                  onClick={() => {
                    setActiveTab(item.id);
                    // Close mobile sidebar when item is selected
                    if (isMobileOpen) {
                      onMobileToggle();
                    }
                  }}
                >
                  <Icon className="mr-3 h-4 w-4" />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge 
                      variant="secondary" 
                      className="ml-2 bg-red-100 text-red-800 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </div>
        </ScrollArea>

        {/* User Profile Section */}
        <div className="border-t border-gray-700 p-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 text-gray-300 hover:text-white hover:bg-gray-800">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-300" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-white">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-400 capitalize">
                      {user.role?.replace('_', ' ')}
                    </div>
                  </div>
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </>
  );
};

export default CollapsibleSidebar;
