
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import RoleBadge from '@/components/RoleBadge';
import { LogOut, Bell, Settings } from 'lucide-react';

const DashboardHeader: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {user.role === 'admin' && 'System Administration'}
            {user.role === 'hr' && 'HR Dashboard'}
            {user.role === 'manager' && 'Team Management'}
            {user.role === 'employee' && 'Employee Portal'}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome back, {user.name}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <div className="flex items-center justify-end space-x-2">
                <RoleBadge role={user.role} size="sm" />
              </div>
            </div>
            <Avatar>
              <AvatarFallback className="bg-primary-100 text-primary-700">
                {getInitials(user.firstName)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="text-red-600 border-red-200 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
