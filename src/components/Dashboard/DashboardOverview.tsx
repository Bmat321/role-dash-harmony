import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, TrendingUp, CheckCircle, Clock, DollarSign, FileText, UserPlus } from 'lucide-react';
import { useCombinedContext } from '@/contexts/AuthContext';


interface DashboardOverviewProps {
  onNavigate?: (section: string) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ onNavigate }) => {
  // const { user } = useAuth();
  const {user:useDashboardOverview,  profile } = useCombinedContext();
  const {user} = useDashboardOverview

  const getQuickActionsForRole = () => {
    switch (user?.role) {
      case 'admin':
      case 'hr':
        return [
          { icon: Users, label: 'Add Employee', color: 'text-blue-500', action: 'employees' },
          { icon: Calendar, label: 'Manage Leave', color: 'text-green-500', action: 'leave' },
          { icon: TrendingUp, label: 'View Reports', color: 'text-purple-500', action: 'reports' },
          { icon: UserPlus, label: 'Recruitment', color: 'text-orange-500', action: 'recruitment' },
        ];
      
      case 'md':
      case 'teamlead':
        return [
          { icon: Users, label: 'View Team', color: 'text-blue-500', action: 'employees' },
          { icon: Calendar, label: 'Leave Requests', color: 'text-green-500', action: 'leave' },
          { icon: TrendingUp, label: 'Team Reports', color: 'text-purple-500', action: 'reports' },
          { icon: CheckCircle, label: 'Appraisals', color: 'text-orange-500', action: 'appraisal' },
        ];
      
      case 'employee':
        return [
          { icon: Clock, label: 'Check Attendance', color: 'text-blue-500', action: 'attendance' },
          { icon: Calendar, label: 'Request Leave', color: 'text-green-500', action: 'leave' },
          { icon: DollarSign, label: 'View Payroll', color: 'text-purple-500', action: 'payroll' },
          { icon: FileText, label: 'My Documents', color: 'text-orange-500', action: 'documents' },
        ];
      
      default:
        return [
          { icon: Users, label: 'Add Employee', color: 'text-blue-500', action: 'employees' },
          { icon: Calendar, label: 'Request Leave', color: 'text-green-500', action: 'leave' },
          { icon: TrendingUp, label: 'View Reports', color: 'text-purple-500', action: 'reports' },
          { icon: CheckCircle, label: 'Complete Appraisal', color: 'text-orange-500', action: 'appraisal' },
        ];
    }
  };

  const quickActions = getQuickActionsForRole();

  const getWelcomeMessage = () => {
    const firstName = user?.firstName || 'User';
    switch (user?.role) {
      case 'admin':
        return `Welcome back, ${firstName}! System overview at your fingertips.`;
      case 'hr':
        return `Welcome back, ${firstName}! Manage your HR operations efficiently.`;
      case 'md':
        return `Welcome back, ${firstName}! Keep track of your team's progress.`;
      case 'teamlead':
        return `Welcome back, ${firstName}! Lead your team to success.`;
      case 'employee':
        return `Welcome back, ${firstName}! Your personal dashboard is ready.`;
      default:
        return `Welcome back, ${firstName}! Your HRIS dashboard is ready.`;
    }
  };

  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      onNavigate(action);
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600">{getWelcomeMessage()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Employees</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">245</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Leave</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 pending approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Appraisals Due</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">+15% from last week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest updates from your team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">New employee onboarded</p>
                  <p className="text-xs text-gray-500">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Leave request approved</p>
                  <p className="text-xs text-gray-500">4 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Appraisal submitted</p>
                  <p className="text-xs text-gray-500">1 day ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and shortcuts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button 
                    key={action.label} 
                    className="p-4 border rounded-lg hover:bg-gray-50 text-left transition-colors"
                    onClick={() => handleQuickAction(action.action)}
                  >
                    <Icon className={`h-6 w-6 mb-2 ${action.color}`} />
                    <div className="text-sm font-medium">{action.label}</div>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
