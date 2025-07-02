
import React from 'react';
import DashboardOverview from './DashboardOverview';
import EmployeeManagement from '../Employee/EmployeeManagement';
import AttendanceManagement from '../Attendance/AttendanceManagement';
import LeaveManagement from '../Leave/LeaveManagement';
import PayrollManagement from '../Payroll/PayrollManagement';
import PerformanceManagement from '../Performance/PerformanceManagement';
import RecruitmentManagement from '../Recruitment/RecruitmentManagement';
import DocumentManagement from '../Documents/DocumentManagement';
import HandoverManagement from '../Handover/HandoverManagement';
import TimeTrackingManagement from '../TimeTracking/TimeTrackingManagement';
import Reports from './Reports';
import Analytics from './Analytics';
import SystemSettings from '../Settings/SystemSettings';
import { useAuth } from '@/contexts/AuthContext';
import LoanManagement from '../Loan/LoanManagement';
import AppraisalManagement from '../Appraisal/AppraisalManagement';

interface DashboardContentProps {
  activeItem: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeItem }) => {
  const { user } = useAuth();

  switch (activeItem) {
    case 'dashboard':
      return <DashboardOverview />;
    case 'employees':
      return <EmployeeManagement />;
    case 'attendance':
      return <AttendanceManagement />;
    case 'leave':
      return <LeaveManagement />;
    case 'loan':
      return <LoanManagement />;
    case 'appraisal':
      return <AppraisalManagement />;
    case 'payroll':
      return <PayrollManagement />;
    case 'performance':
      return <PerformanceManagement />;
    case 'recruitment':
      return <RecruitmentManagement />;
    case 'documents':
      return <DocumentManagement />;
    case 'handover':
      return <HandoverManagement />;
    case 'time-tracking':
      return <TimeTrackingManagement />;
    case 'analytics':
      return <Analytics />;
    case 'reports':
      return <Reports />;
    case 'settings':
      return <SystemSettings />;
    default:
      return <DashboardOverview />;
  }
};

export default DashboardContent;
