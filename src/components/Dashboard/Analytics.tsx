
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, TrendingDown, Users, Building, Calendar, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  const { employees, stats } = useEmployees();
  const isMobile = useIsMobile();

  // Prepare data for charts
  const departmentData = Object.entries(stats?.departments || {}).map(([name, count]) => ({
    department: name,
    employees: count,
    fill: `hsl(${Math.random() * 360}, 70%, 50%)`,
  }));

  const roleData = Object.entries(stats?.roleDistribution || {}).map(([role, count]) => ({
    role: role.charAt(0).toUpperCase() + role.slice(1),
    count,
    fill: role === 'admin' ? '#6D28D9' : role === 'hr' ? '#0D9488' : role === 'manager' ? '#1E40AF' : '#4B5563',
  }));

  // Mock data for trending charts
  const hiringTrends = [
    { month: 'Jan', hires: 12, terminations: 3 },
    { month: 'Feb', hires: 8, terminations: 1 },
    { month: 'Mar', hires: 15, terminations: 4 },
    { month: 'Apr', hires: 10, terminations: 2 },
    { month: 'May', hires: 18, terminations: 1 },
    { month: 'Jun', hires: 14, terminations: 5 },
  ];

  const attendanceData = [
    { month: 'Jan', attendance: 94.5 },
    { month: 'Feb', attendance: 96.2 },
    { month: 'Mar', attendance: 93.8 },
    { month: 'Apr', attendance: 95.1 },
    { month: 'May', attendance: 97.3 },
    { month: 'Jun', attendance: 95.8 },
  ];

  const chartConfig = {
    employees: { label: 'Employees', color: '#3B82F6' },
    hires: { label: 'New Hires', color: '#10B981' },
    terminations: { label: 'Terminations', color: '#EF4444' },
    attendance: { label: 'Attendance %', color: '#8B5CF6' },
    avgSalary: { label: 'Average Salary', color: '#F59E0B' },
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Detailed insights and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Employee Growth</CardTitle>
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">vs last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Turnover Rate</CardTitle>
            <TrendingDown className="h-3 w-3 lg:h-4 lg:w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">-2.1% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Avg. Attendance</CardTitle>
            <Calendar className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">95.4%</div>
            <p className="text-xs text-muted-foreground">+1.2% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">$75,200</div>
            <p className="text-xs text-muted-foreground">+3.5% YoY</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Department Distribution</CardTitle>
            <CardDescription className="text-sm">Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="employees" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Role Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Role Distribution</CardTitle>
            <CardDescription className="text-sm">Employee breakdown by role</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ role, count }) => `${role}: ${count}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
