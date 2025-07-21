
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

interface EmployeePerformanceChartProps {
  employeeId: string;
  employeeName: string;
}

const EmployeePerformanceChart: React.FC<EmployeePerformanceChartProps> = ({ employeeId, employeeName }) => {
  // Mock performance data based on attendance
  const performanceData = [
    { month: 'Jan', attendance: 95, performance: 88, productivity: 92 },
    { month: 'Feb', attendance: 98, performance: 91, productivity: 94 },
    { month: 'Mar', attendance: 92, performance: 85, productivity: 89 },
    { month: 'Apr', attendance: 100, performance: 95, productivity: 97 },
    { month: 'May', attendance: 96, performance: 89, productivity: 93 },
    { month: 'Jun', attendance: 99, performance: 94, productivity: 96 },
    { month: 'Jul', attendance: 94, performance: 87, productivity: 91 },
    { month: 'Aug', attendance: 97, performance: 92, productivity: 95 },
    { month: 'Sep', attendance: 98, performance: 93, productivity: 96 },
    { month: 'Oct', attendance: 95, performance: 88, productivity: 92 },
    { month: 'Nov', attendance: 99, performance: 95, productivity: 97 },
    { month: 'Dec', attendance: 96, performance: 90, productivity: 94 },
  ];

  const chartConfig = {
    attendance: {
      label: "Attendance %",
      color: "hsl(var(--chart-1))",
    },
    performance: {
      label: "Performance Score",
      color: "hsl(var(--chart-2))",
    },
    productivity: {
      label: "Productivity %",
      color: "hsl(var(--chart-3))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance Analytics</CardTitle>
        <CardDescription>
          {employeeName}'s attendance-based performance trends over the last 12 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[400px]">
          <BarChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar 
              dataKey="attendance" 
              fill="var(--color-attendance)" 
              name="Attendance %" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="performance" 
              fill="var(--color-performance)" 
              name="Performance Score" 
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              dataKey="productivity" 
              fill="var(--color-productivity)" 
              name="Productivity %" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
        
        {/* Performance Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-green-50 rounded-lg">
            <div className="text-sm text-green-600 font-medium">Average Attendance</div>
            <div className="text-2xl font-bold text-green-700">96.6%</div>
            <div className="text-xs text-green-600">Above company average</div>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg">
            <div className="text-sm text-blue-600 font-medium">Performance Score</div>
            <div className="text-2xl font-bold text-blue-700">90.8</div>
            <div className="text-xs text-blue-600">Excellent rating</div>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <div className="text-sm text-purple-600 font-medium">Productivity</div>
            <div className="text-2xl font-bold text-purple-700">93.8%</div>
            <div className="text-xs text-purple-600">High performer</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmployeePerformanceChart;
