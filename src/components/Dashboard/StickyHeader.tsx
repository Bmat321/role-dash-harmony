
import React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import RoleBadge from '@/components/RoleBadge';
import NotificationCenter from './NotificationCenter';
import { LogOut, Settings } from 'lucide-react';

const StickyHeader: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 md:px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
            {user.role === 'admin' && 'System Administration'}
            {user.role === 'hr' && 'HR Dashboard'}
            {user.role === 'manager' && 'Team Management'}
            {user.role === 'employee' && 'Employee Portal'}
          </h1>
          <p className="text-sm text-gray-600 mt-1 hidden md:block">
            Welcome back, {user.name}
          </p>
        </div>
        
        <div className="flex items-center space-x-2 md:space-x-4">
          <NotificationCenter />
          
          <Button variant="ghost" size="sm" className="hidden md:flex">
            <Settings className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-3">
            <div className="text-right hidden md:block">
              <p className="text-sm font-medium text-gray-900">{user.name}</p>
              <div className="flex items-center justify-end space-x-2">
                <RoleBadge role={user.role} size="sm" />
              </div>
            </div>
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-primary-100 text-primary-700 text-sm">
                {getInitials(user.firstName)}
              </AvatarFallback>
            </Avatar>
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={logout}
            className="text-red-600 border-red-200 hover:bg-red-50 hidden md:flex"
          >
            <LogOut className="h-4 w-4 mr-1" />
            Logout
          </Button>
          
          {/* Mobile logout */}
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={logout}
            className="md:hidden text-red-600"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default StickyHeader;
