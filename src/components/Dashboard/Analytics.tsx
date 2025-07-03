
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ComposedChart } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, TrendingDown, Users, Building, Calendar, DollarSign, Award, BookOpen, Activity } from 'lucide-react';

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

  // Mock data for new analytics features
  const salaryDistributionByDept = [
    { department: 'Engineering', avgSalary: 85000, minSalary: 65000, maxSalary: 120000, employees: 45 },
    { department: 'Marketing', avgSalary: 68000, minSalary: 45000, maxSalary: 95000, employees: 25 },
    { department: 'Sales', avgSalary: 72000, minSalary: 50000, maxSalary: 110000, employees: 35 },
    { department: 'HR', avgSalary: 65000, minSalary: 48000, maxSalary: 85000, employees: 15 },
    { department: 'Finance', avgSalary: 78000, minSalary: 55000, maxSalary: 105000, employees: 20 },
  ];

  const salaryDistributionByRole = [
    { role: 'Admin', avgSalary: 95000, count: 5, fill: '#6D28D9' },
    { role: 'Manager', avgSalary: 88000, count: 20, fill: '#1E40AF' },
    { role: 'Team Lead', avgSalary: 82000, count: 15, fill: '#059669' },
    { role: 'HR', avgSalary: 68000, count: 12, fill: '#0D9488' },
    { role: 'Employee', avgSalary: 65000, count: 148, fill: '#4B5563' },
  ];

  const leaveTypesData = [
    { type: 'Vacation', used: 245, total: 400, fill: '#3B82F6' },
    { type: 'Sick', used: 89, total: 200, fill: '#EF4444' },
    { type: 'Personal', used: 156, total: 300, fill: '#10B981' },
    { type: 'Maternity', used: 45, total: 60, fill: '#F59E0B' },
    { type: 'Emergency', used: 23, total: 50, fill: '#8B5CF6' },
  ];

  const skillsInventoryData = [
    { skill: 'JavaScript', proficient: 85, intermediate: 45, beginner: 25, total: 155 },
    { skill: 'Python', proficient: 65, intermediate: 35, beginner: 15, total: 115 },
    { skill: 'Project Management', proficient: 45, intermediate: 60, beginner: 30, total: 135 },
    { skill: 'Data Analysis', proficient: 35, intermediate: 55, beginner: 40, total: 130 },
    { skill: 'Digital Marketing', proficient: 25, intermediate: 35, beginner: 20, total: 80 },
    { skill: 'UI/UX Design', proficient: 20, intermediate: 40, beginner: 25, total: 85 },
  ];

  const topSkillsGaps = [
    { skill: 'Cloud Computing', demand: 85, supply: 25, gap: 60 },
    { skill: 'Machine Learning', demand: 70, supply: 20, gap: 50 },
    { skill: 'Cybersecurity', demand: 65, supply: 18, gap: 47 },
    { skill: 'DevOps', demand: 60, supply: 22, gap: 38 },
    { skill: 'Mobile Development', demand: 55, supply: 28, gap: 27 },
  ];

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
    proficient: { label: 'Proficient', color: '#10B981' },
    intermediate: { label: 'Intermediate', color: '#F59E0B' },
    beginner: { label: 'Beginner', color: '#EF4444' },
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
            <CardTitle className="text-xs lg:text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">$75,200</div>
            <p className="text-xs text-muted-foreground">+3.5% YoY</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Skills Coverage</CardTitle>
            <Award className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Critical skills met</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Leave Utilization</CardTitle>
            <Activity className="h-3 w-3 lg:h-4 lg:w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">64%</div>
            <p className="text-xs text-muted-foreground">Of allocated leave</p>
          </CardContent>
        </Card>
      </div>

      {/* Salary Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Salary Distribution by Department
            </CardTitle>
            <CardDescription className="text-sm">Average salary ranges across departments</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={salaryDistributionByDept} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgSalary" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="maxSalary" stroke="#10B981" strokeWidth={2} />
                  <Line type="monotone" dataKey="minSalary" stroke="#EF4444" strokeWidth={2} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Salary Distribution by Role
            </CardTitle>
            <CardDescription className="text-sm">Average compensation by role level</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salaryDistributionByRole} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="avgSalary" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Leave Types and Skills Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Leave Types Distribution
            </CardTitle>
            <CardDescription className="text-sm">Leave usage patterns across different types</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={leaveTypesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="type" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="total" fill="#E5E7EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="used" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Skills Inventory Overview
            </CardTitle>
            <CardDescription className="text-sm">Workforce skill proficiency levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsInventoryData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="proficient" stackId="skills" fill="#10B981" />
                  <Bar dataKey="intermediate" stackId="skills" fill="#F59E0B" />
                  <Bar dataKey="beginner" stackId="skills" fill="#EF4444" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Skills Gap Analysis and Department Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Skills Gap Analysis</CardTitle>
            <CardDescription className="text-sm">Critical skill shortages requiring attention</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSkillsGaps} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" fontSize={12} />
                  <YAxis dataKey="skill" type="category" fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="gap" fill="#EF4444" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Department Distribution</CardTitle>
            <CardDescription className="text-sm">Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={departmentData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ department, employees }) => `${department}: ${employees}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="employees"
                  >
                    {departmentData.map((entry, index) => (
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
