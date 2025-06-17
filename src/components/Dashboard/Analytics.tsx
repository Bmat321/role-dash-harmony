
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart } from 'recharts';
import { useEmployees } from '@/hooks/useEmployees';
import { TrendingUp, TrendingDown, Users, Building, Calendar, DollarSign } from 'lucide-react';

const Analytics: React.FC = () => {
  const { employees, stats } = useEmployees();

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

  const salaryData = departmentData.map(dept => ({
    department: dept.department,
    avgSalary: Math.floor(Math.random() * 40000) + 60000,
  }));

  const chartConfig = {
    employees: { label: 'Employees', color: '#3B82F6' },
    hires: { label: 'New Hires', color: '#10B981' },
    terminations: { label: 'Terminations', color: '#EF4444' },
    attendance: { label: 'Attendance %', color: '#8B5CF6' },
    avgSalary: { label: 'Average Salary', color: '#F59E0B' },
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Employee Growth</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+12.5%</div>
            <p className="text-xs text-muted-foreground">vs last quarter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turnover Rate</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8.2%</div>
            <p className="text-xs text-muted-foreground">-2.1% from last year</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">95.4%</div>
            <p className="text-xs text-muted-foreground">+1.2% this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Salary</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$75,200</div>
            <p className="text-xs text-muted-foreground">+3.5% YoY</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={departmentData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="department" />
                  <YAxis />
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
            <CardTitle>Role Distribution</CardTitle>
            <CardDescription>Employee breakdown by role</CardDescription>
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

        {/* Hiring Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Hiring vs Termination Trends</CardTitle>
            <CardDescription>Monthly hiring and termination data</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hiringTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="hires" fill="#10B981" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="terminations" fill="#EF4444" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Trends</CardTitle>
            <CardDescription>Monthly attendance percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis domain={[90, 100]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area 
                    type="monotone" 
                    dataKey="attendance" 
                    stroke="#8B5CF6" 
                    fill="#8B5CF6" 
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Salary Analysis */}
      <Card>
        <CardHeader>
          <CardTitle>Average Salary by Department</CardTitle>
          <CardDescription>Comparative salary analysis across departments</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salaryData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="department" type="category" />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value) => [`$${value.toLocaleString()}`, 'Average Salary']}
                />
                <Bar dataKey="avgSalary" fill="#F59E0B" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      {/* Insights Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Key Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• Engineering has the highest headcount (35%)</p>
            <p className="text-sm">• New hire rate increased by 25% this quarter</p>
            <p className="text-sm">• Attendance improved by 1.2% month-over-month</p>
            <p className="text-sm">• IT department has highest average salary</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-yellow-600">Areas for Attention</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• Sales department turnover above average</p>
            <p className="text-sm">• March showed higher termination rates</p>
            <p className="text-sm">• Consider salary review for Marketing team</p>
            <p className="text-sm">• Remote work affecting attendance patterns</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Recommendations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm">• Implement retention program for Sales</p>
            <p className="text-sm">• Expand Engineering team by 20%</p>
            <p className="text-sm">• Review compensation packages quarterly</p>
            <p className="text-sm">• Introduce flexible work arrangements</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
