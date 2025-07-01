import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useEmployees } from '@/hooks/useEmployees';
import { useIsMobile } from '@/hooks/use-mobile';
import StatsCard from './StatsCard';
import EmployeeTable from './EmployeeTable';
import Analytics from './Analytics';
import Reports from './Reports';
import UpcomingLeave from './UpcomingLeave';
import DepartmentRoleStats from './DepartmentRoleStats';
import UserInvitation from '@/components/Admin/UserInvitation';
import ProfilePictureUpload from '@/components/Profile/ProfilePictureUpload';
import EmployeeManagement from '@/components/Employee/EmployeeManagement';
import AttendanceManagement from '@/components/Attendance/AttendanceManagement';
import LeaveManagement from '@/components/Leave/LeaveManagement';
import PayrollManagement from '@/components/Payroll/PayrollManagement';
import SystemSettings from '@/components/Settings/SystemSettings';
import PerformanceManagement from '@/components/Performance/PerformanceManagement';
import RecruitmentManagement from '@/components/Recruitment/RecruitmentManagement';
import DocumentManagement from '@/components/Documents/DocumentManagement';
import TimeTrackingManagement from '@/components/TimeTracking/TimeTrackingManagement';
import AppraisalManagement from '@/components/Appraisal/AppraisalManagement';
import HandoverManagement from '@/components/Handover/HandoverManagement';
import { Users, UserCheck, UserPlus, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  const { user } = useAuth();
  const { employees, stats, isLoading } = useEmployees();
  const isMobile = useIsMobile();

  if (isLoading) {
    return (
      <div className="p-3 lg:p-6 space-y-4 lg:space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

  const getUserFullName = () => {
    if (user.firstName && user.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user.name || user.email || 'User';
  };

  const renderDashboard = () => {
    return (
      <div className="space-y-4 lg:space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
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

        {/* Department and Role Distribution */}
        <DepartmentRoleStats stats={stats} />

        {/* Upcoming Leave - Show on desktop, hide on mobile dashboard */}
        {!isMobile && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Upcoming Leave</CardTitle>
              <CardDescription>Team leave schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingLeave />
            </CardContent>
          </Card>
        )}

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Recent Activity</CardTitle>
            <CardDescription className="text-sm">Latest updates and notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 lg:space-y-4">
              <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-green-50 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">New employee onboarded</p>
                  <p className="text-xs text-gray-500 truncate">Alice Smith joined Marketing team</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-blue-50 rounded-lg">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Leave request approved</p>
                  <p className="text-xs text-gray-500 truncate">Jane Doe's vacation approved for next week</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 lg:space-x-4 p-3 lg:p-4 bg-yellow-50 rounded-lg">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">Performance review due</p>
                  <p className="text-xs text-gray-500 truncate">3 employees have pending reviews</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  switch (activeTab) {
    case 'dashboard':
      return (
        <div className="p-3 lg:p-6">
          {renderDashboard()}
        </div>
      );
    case 'upcoming-leave':
      return (
        <div className="p-3 lg:p-6">
          <UpcomingLeave />
        </div>
      );
    case 'invitations':
      return (
        <div className="p-3 lg:p-6">
          <UserInvitation />
        </div>
      );
    case 'employees':
      return (
        <div className="p-3 lg:p-6">
          <EmployeeManagement />
        </div>
      );
    case 'team':
    case 'profile':
      return (
        <div className="p-3 lg:p-6 space-y-6">
          {activeTab === 'profile' && (
            <ProfilePictureUpload 
              userName={getUserFullName()} 
              hasUploadedBefore={false}
            />
          )}
          <EmployeeTable employees={employees} />
        </div>
      );
    case 'analytics':
      return (
        <div className="p-3 lg:p-6">
          <Analytics />
        </div>
      );
    case 'reports':
      return (
        <div className="p-3 lg:p-6">
          <Reports />
        </div>
      );
    case 'attendance':
      return (
        <div className="p-3 lg:p-6">
          <AttendanceManagement />
        </div>
      );
    case 'leave':
      return (
        <div className="p-3 lg:p-6">
          <LeaveManagement />
        </div>
      );
    case 'payroll':
      return (
        <div className="p-3 lg:p-6">
          <PayrollManagement />
        </div>
      );
    case 'performance':
      return (
        <div className="p-3 lg:p-6">
          <PerformanceManagement />
        </div>
      );
    case 'recruitment':
      return (
        <div className="p-3 lg:p-6">
          <RecruitmentManagement />
        </div>
      );
    case 'documents':
      return (
        <div className="p-3 lg:p-6">
          <DocumentManagement />
        </div>
      );
    case 'time-tracking':
      return (
        <div className="p-3 lg:p-6">
          <TimeTrackingManagement />
        </div>
      );
    case 'appraisal':
      return (
        <div className="p-3 lg:p-6">
          <AppraisalManagement />
        </div>
      );
    case 'handover':
      return (
        <div className="p-3 lg:p-6">
          <HandoverManagement />
        </div>
      );
    case 'settings':
      return (
        <div className="p-3 lg:p-6">
          <SystemSettings />
        </div>
      );
    default:
      return (
        <div className="p-3 lg:p-6">
          {renderDashboard()}
        </div>
      );
  }
};

export default DashboardContent;
