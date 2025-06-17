
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/auth';

interface RoleBadgeProps {
  role: User['role'];
  size?: 'sm' | 'md' | 'lg';
}

const roleConfig = {
  admin: {
    label: 'Admin',
    className: 'bg-admin text-white hover:bg-admin/90',
  },
  hr: {
    label: 'HR',
    className: 'bg-hr text-white hover:bg-hr/90',
  },
  manager: {
    label: 'Manager',
    className: 'bg-manager text-white hover:bg-manager/90',
  },
  employee: {
    label: 'Employee',
    className: 'bg-employee text-white hover:bg-employee/90',
  },
};

const RoleBadge: React.FC<RoleBadgeProps> = ({ role, size = 'md' }) => {
  const config = roleConfig[role];
  
  return (
    <Badge 
      className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : ''}`}
    >
      {config.label}
    </Badge>
  );
};

export default RoleBadge;
