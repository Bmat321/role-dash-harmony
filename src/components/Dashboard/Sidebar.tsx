
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
  DollarSign
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
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

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">H</span>
          </div>
          <span className="text-xl font-bold text-gray-900">HRIS</span>
        </div>
      </div>
      
      <nav className="px-4 pb-4">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.id 
                    ? 'bg-primary-50 text-primary-700 border-primary-200' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setActiveTab(item.id)}
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
};

export default Sidebar;
