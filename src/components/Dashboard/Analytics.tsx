
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, ComposedChart } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';
import { useIsMobile } from '@/hooks/use-mobile';
import { TrendingUp, TrendingDown, Users, Building, Calendar, DollarSign, Award, BookOpen, Activity, CreditCard, AlertTriangle } from 'lucide-react';

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

  // Mock data for existing analytics features
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

  // New Loan Analytics Data
  const loanIssuedOverTime = [
    { month: 'Jan', issued: 45000, repaid: 38000, outstanding: 7000 },
    { month: 'Feb', issued: 52000, repaid: 42000, outstanding: 10000 },
    { month: 'Mar', issued: 38000, repaid: 55000, outstanding: -17000 },
    { month: 'Apr', issued: 61000, repaid: 48000, outstanding: 13000 },
    { month: 'May', issued: 43000, repaid: 51000, outstanding: -8000 },
    { month: 'Jun', issued: 58000, repaid: 45000, outstanding: 13000 },
  ];

  const loansByDepartment = [
    { department: 'Engineering', totalLoans: 125000, outstandingBalance: 35000, employeeCount: 45 },
    { department: 'Sales', totalLoans: 89000, outstandingBalance: 28000, employeeCount: 35 },
    { department: 'Marketing', totalLoans: 67000, outstandingBalance: 22000, employeeCount: 25 },
    { department: 'HR', totalLoans: 34000, outstandingBalance: 12000, employeeCount: 15 },
    { department: 'Finance', totalLoans: 52000, outstandingBalance: 18000, employeeCount: 20 },
  ];

  const loanTypeDistribution = [
    { type: 'Personal', amount: 185000, count: 45, fill: '#3B82F6' },
    { type: 'Emergency', amount: 95000, count: 28, fill: '#EF4444' },
    { type: 'Education', amount: 125000, count: 22, fill: '#10B981' },
    { type: 'Medical', amount: 67000, count: 18, fill: '#F59E0B' },
    { type: 'Housing', amount: 245000, count: 15, fill: '#8B5CF6' },
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
    issued: { label: 'Loans Issued', color: '#3B82F6' },
    repaid: { label: 'Loans Repaid', color: '#10B981' },
    outstanding: { label: 'Outstanding Balance', color: '#EF4444' },
    totalLoans: { label: 'Total Loans', color: '#6D28D9' },
    outstandingBalance: { label: 'Outstanding', color: '#EF4444' },
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Analytics</h1>
        <p className="text-gray-600">Detailed insights and analytics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 lg:gap-6">
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
            <CardTitle className="text-xs lg:text-sm font-medium">Active Loans</CardTitle>
            <CreditCard className="h-3 w-3 lg:h-4 lg:w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">$715K outstanding</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs lg:text-sm font-medium">Loan Recovery</CardTitle>
            <TrendingUp className="h-3 w-3 lg:h-4 lg:w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-lg lg:text-2xl font-bold">94.2%</div>
            <p className="text-xs text-muted-foreground">On-time repayment</p>
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

      {/* Loan Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Loan Trends Over Time
            </CardTitle>
            <CardDescription className="text-sm">Track loans issued vs repaid monthly</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={loanIssuedOverTime} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="issued" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="repaid" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Line type="monotone" dataKey="outstanding" stroke="#EF4444" strokeWidth={3} />
                </ComposedChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <Building className="h-5 w-5" />
              Loans by Department
            </CardTitle>
            <CardDescription className="text-sm">Outstanding loan balances per department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={loansByDepartment} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" fontSize={12} />
                  <YAxis fontSize={12} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="totalLoans" fill="#6D28D9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="outstandingBalance" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Loan Types and Salary Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Loan Types Distribution
            </CardTitle>
            <CardDescription className="text-sm">Breakdown of loan types and amounts</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={loanTypeDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ type, amount }) => `${type}: $${(amount/1000).toFixed(0)}K`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="amount"
                  >
                    {loanTypeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

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
      </div>

      {/* Leave Types and Department Distribution */}
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
