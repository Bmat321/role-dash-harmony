
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { User } from '@/types/auth';

interface RoleBadgeProps {
  role: User['role'];
  size?: 'sm' | 'md' | 'lg';
}
const roleConfig = {
  admin: {
    label: 'admin',
    className: 'bg-admin text-white hover:bg-admin/90',
  },
  hr: {
    label: 'hr',
    className: 'bg-hr text-white hover:bg-hr/90',
  },
  md: {
    label: 'md',
    className: 'bg-md text-white hover:bg-md/90',
  },
  teamlead: {
    label: 'teamlead',
    className: 'bg-teamlead text-white hover:bg-teamlead/90',
  },
  employee: {
    label: 'employee',
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
