
import React from 'react';
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
  X,
  Shield,
  UserCheck,
  TrendingUp,
  Briefcase,
  FolderOpen,
  FileTransfer,
  MapPin,
  CreditCard,
  Award,
  ClipboardCheck
} from 'lucide-react';

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
          { id: 'attendance', label: 'Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Management', icon: Calendar },
          { id: 'loan', label: 'Loan Management', icon: CreditCard },
          { id: 'appraisal', label: 'Appraisal Management', icon: Award },
          { id: 'appraisal-approval', label: 'Appraisal Approval', icon: ClipboardCheck },
          { id: 'payroll', label: 'Payroll Management', icon: DollarSign },
          { id: 'performance', label: 'Performance Management', icon: TrendingUp },
          { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
          { id: 'documents', label: 'Document Management', icon: FolderOpen },
          { id: 'handover', label: 'Handover Management', icon: FileTransfer },
          { id: 'handover-approval', label: 'Handover Approval', icon: Shield },
          { id: 'time-tracking', label: 'Time Tracking', icon: MapPin },
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
          { id: 'loan', label: 'Loan Management', icon: CreditCard },
          { id: 'appraisal', label: 'Appraisal Management', icon: Award },
          { id: 'payroll', label: 'Payroll Management', icon: DollarSign },
          { id: 'performance', label: 'Performance Management', icon: TrendingUp },
          { id: 'recruitment', label: 'Recruitment', icon: UserCheck },
          { id: 'documents', label: 'Document Management', icon: FolderOpen },
          { id: 'handover', label: 'Handover Management', icon: FileTransfer },
          { id: 'handover-approval', label: 'Handover Approval', icon: Shield },
          { id: 'time-tracking', label: 'Time Tracking', icon: MapPin },
          { id: 'reports', label: 'HR Reports', icon: FileText },
        ];
      
      case 'manager':
      case 'team_lead':
        return [
          ...baseItems,
          { id: 'employees', label: 'My Team', icon: Users },
          { id: 'attendance', label: 'Team Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Requests', icon: Calendar },
          { id: 'loan', label: 'Loan Requests', icon: CreditCard },
          { id: 'appraisal', label: 'Appraisal Management', icon: Award },
          { id: 'appraisal-approval', label: 'Appraisal Approval', icon: ClipboardCheck },
          { id: 'handover', label: 'Handover Management', icon: FileTransfer },
          { id: 'handover-approval', label: 'Handover Approval', icon: Shield },
          { id: 'time-tracking', label: 'Team Time Tracking', icon: MapPin },
          { id: 'reports', label: 'Team Reports', icon: FileText },
        ];
      
      case 'employee':
        return [
          ...baseItems,
          { id: 'profile', label: 'My Profile', icon: User },
          { id: 'attendance', label: 'My Attendance', icon: Clock },
          { id: 'leave', label: 'Leave Balance', icon: Calendar },
          { id: 'loan', label: 'My Loans', icon: CreditCard },
          { id: 'appraisal', label: 'My Appraisals', icon: Award },
          { id: 'payroll', label: 'Payroll', icon: DollarSign },
          { id: 'documents', label: 'My Documents', icon: FolderOpen },
          { id: 'handover', label: 'Handover Tasks', icon: FileTransfer },
          { id: 'time-tracking', label: 'Time Tracking', icon: MapPin },
        ];
      
      default:
        return baseItems;
    }
  };

  const menuItems = getMenuItems();

  const sidebarContent = (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-xl font-bold text-gray-900">HRIS</span>
          </div>
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onMobileToggle}
            className="lg:hidden"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start text-left ${
                  activeTab === item.id 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => {
                  setActiveTab(item.id);
                  onMobileToggle(); // Close mobile sidebar when item is selected
                }}
              >
                <Icon className="mr-3 h-4 w-4" />
                {item.label}
              </Button>
            );
          })}
        </div>
      </nav>
    </div>
  );

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" 
          onClick={onMobileToggle}
        />
      )}
      
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 
        transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {sidebarContent}
      </div>
    </>
  );
};

export default CollapsibleSidebar;
