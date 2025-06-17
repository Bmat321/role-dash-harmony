
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployees } from '@/hooks/useEmployees';
import StatsCard from './StatsCard';
import EmployeeTable from './EmployeeTable';
import { Users, UserCheck, UserPlus, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const { employees, stats, isLoading } = useEmployees();

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user || !stats) return null;

  const renderDashboard = () => {
    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Total Employees"
            value={stats.totalEmployees}
            icon={Users}
            trend={{ value: "12%", isPositive: true }}
          />
          <StatsCard
            title="Active Employees"
            value={stats.activeEmployees}
            icon={UserCheck}
            trend={{ value: "8%", isPositive: true }}
          />
          <StatsCard
            title="New Hires"
            value={stats.newHires}
            icon={UserPlus}
            trend={{ value: "25%", isPositive: true }}
          />
          <StatsCard
            title="Departments"
            value={Object.keys(stats.departments).length}
            icon={Building}
          />
        </div>

        {/* Department Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Distribution</CardTitle>
              <CardDescription>Employee count by department</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(stats.departments).map(([dept, count]) => (
                <div key={dept} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{dept}</span>
                    <span className="text-sm text-gray-500">{count} employees</span>
                  </div>
                  <Progress 
                    value={(count / stats.totalEmployees) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Role Distribution</CardTitle>
              <CardDescription>Employee count by role</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(stats.roleDistribution).map(([role, count]) => (
                <div key={role} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">{role}</span>
                    <span className="text-sm text-gray-500">{count} employees</span>
                  </div>
                  <Progress 
                    value={(count / stats.totalEmployees) * 100} 
                    className="h-2"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">New employee onboarded</p>
                  <p className="text-xs text-gray-500">Alice Smith joined Marketing team</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Leave request approved</p>
                  <p className="text-xs text-gray-500">Jane Doe's vacation approved for next week</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-4 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Performance review due</p>
                  <p className="text-xs text-gray-500">3 employees have pending reviews</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderEmployees = () => {
    return <EmployeeTable employees={employees} />;
  };

  const renderPlaceholder = (title: string, description: string) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">This feature is coming soon...</p>
        </CardContent>
      </Card>
    );
  };

  switch (activeTab) {
    case 'dashboard':
      return renderDashboard();
    case 'employees':
    case 'team':
    case 'profile':
      return renderEmployees();
    case 'analytics':
      return renderPlaceholder('Analytics', 'Advanced analytics and insights');
    case 'reports':
      return renderPlaceholder('Reports', 'Generate and view reports');
    case 'attendance':
      return renderPlaceholder('Attendance', 'Track and manage attendance');
    case 'leave':
      return renderPlaceholder('Leave Management', 'Manage leave requests and balances');
    case 'payroll':
      return renderPlaceholder('Payroll', 'View payroll information');
    case 'settings':
      return renderPlaceholder('Settings', 'System configuration and settings');
    default:
      return renderDashboard();
  }
};

export default DashboardContent;
