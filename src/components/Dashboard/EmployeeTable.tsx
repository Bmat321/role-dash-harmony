
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Employee } from '@/types/employee';
import RoleBadge from '@/components/RoleBadge';
import StatusBadge from '@/components/StatusBadge';
import { useCombinedContext } from '@/contexts/AuthContext';

interface EmployeeTableProps {
  employees: Employee[];
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  const { user: userContext } = useCombinedContext();
  const { user } = userContext;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getFilteredEmployees = () => {
    if (!user) return [];
    
    switch (user.role) {
      case 'admin':
      case 'hr':
        return employees;
      case 'md':
        // In a real app, filter by managerId or department
        return employees.filter(emp => emp.department === user.department);
      case 'employee':
        return employees.filter(emp => emp.id === user._id);
      default:
        return [];
    }
  };

  const filteredEmployees = getFilteredEmployees();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Directory</CardTitle>
        <CardDescription>
          {user?.role === 'employee' 
            ? 'Your profile information' 
            : `Managing ${filteredEmployees.length} employees`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Hire Date</TableHead>
              {(user?.role === 'admin' || user?.role === 'hr') && (
                <TableHead>Salary</TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary-100 text-primary-700">
                        {getInitials(employee.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{employee.name}</div>
                      <div className="text-sm text-gray-500">{employee.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <RoleBadge role={employee.role} size="sm" />
                </TableCell>
                <TableCell>
                  <div>
                    <div className="font-medium">{employee.department}</div>
                    <div className="text-sm text-gray-500">{employee.position}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={employee.status} size="sm" />
                </TableCell>
                <TableCell className="text-sm">
                  {new Date(employee.hireDate).toLocaleDateString()}
                </TableCell>
                {(user?.role === 'admin' || user?.role === 'hr') && (
                  <TableCell className="font-medium">
                    ${employee.salary?.toLocaleString()}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default EmployeeTable;
