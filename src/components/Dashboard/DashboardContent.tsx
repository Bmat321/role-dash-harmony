import React from 'react';
import Dashboard from './Dashboard';
import Employees from '../Employees/Employees';
import Attendance from '../Attendance/Attendance';
import LeaveManagement from '../Leave/LeaveManagement';
import Payroll from '../Payroll/Payroll';
import Performance from '../Performance/Performance';
import Recruitment from '../Recruitment/Recruitment';
import Documents from '../Documents/Documents';
import Handover from '../Handover/Handover';
import TimeTracking from '../TimeTracking/TimeTracking';
import Reports from '../Reports/Reports';
import Settings from '../Settings/Settings';
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
      return <Dashboard />;
    case 'employees':
      return <Employees />;
    case 'attendance':
      return <Attendance />;
    case 'leave':
      return <LeaveManagement />;
    case 'loan':
      return <LoanManagement />;
    case 'appraisal':
      return <AppraisalManagement />;
    case 'payroll':
      return <Payroll />;
    case 'performance':
      return <Performance />;
    case 'recruitment':
      return <Recruitment />;
    case 'documents':
      return <Documents />;
    case 'handover':
      return <Handover />;
    case 'time-tracking':
      return <TimeTracking />;
    case 'reports':
      return <Reports />;
    case 'settings':
      return <Settings />;
    default:
      return <div>Content for {activeItem}</div>;
  }
};

export default DashboardContent;
