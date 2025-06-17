
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: 'active' | 'inactive' | 'terminated';
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-green-500 text-white hover:bg-green-600',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-yellow-500 text-white hover:bg-yellow-600',
  },
  terminated: {
    label: 'Terminated',
    className: 'bg-red-500 text-white hover:bg-red-600',
  },
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      className={`${config.className} ${size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-3 py-1' : ''}`}
    >
      {config.label}
    </Badge>
  );
};

export default StatusBadge;
