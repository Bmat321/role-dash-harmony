
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useEmployees } from '@/hooks/useEmployees';
import { useToast } from '@/hooks/use-toast';
import { 
  FileText, 
  Download, 
  Calendar, 
  Users, 
  Building, 
  TrendingUp,
  Clock,
  DollarSign,
  Filter,
  RefreshCw
} from 'lucide-react';

const Reports: React.FC = () => {
  const { employees, stats } = useEmployees();
  const { toast } = useToast();
  const [selectedReport, setSelectedReport] = useState('employee-summary');
  const [dateRange, setDateRange] = useState('last-30-days');
  const [department, setDepartment] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'employee-summary',
      title: 'Employee Summary Report',
      description: 'Comprehensive overview of all employees',
      icon: Users,
      category: 'HR'
    },
    {
      id: 'department-analysis',
      title: 'Department Analysis',
      description: 'Detailed breakdown by department',
      icon: Building,
      category: 'Analytics'
    },
    {
      id: 'attendance-report',
      title: 'Attendance Report',
      description: 'Employee attendance patterns and trends',
      icon: Clock,
      category: 'Operations'
    },
    {
      id: 'payroll-summary',
      title: 'Payroll Summary',
      description: 'Salary and compensation analysis',
      icon: DollarSign,
      category: 'Finance'
    },
    {
      id: 'performance-metrics',
      title: 'Performance Metrics',
      description: 'Key performance indicators and trends',
      icon: TrendingUp,
      category: 'Analytics'
    }
  ];

  const generateReport = async () => {
    setIsGenerating(true);
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const selectedReportData = reportTypes.find(r => r.id === selectedReport);
    
    toast({
      title: "Report Generated Successfully",
      description: `${selectedReportData?.title} has been generated and is ready for download.`,
    });
    
    setIsGenerating(false);
  };

  const exportReport = (format: 'pdf' | 'excel' | 'csv') => {
    const selectedReportData = reportTypes.find(r => r.id === selectedReport);
    toast({
      title: `Exporting to ${format.toUpperCase()}`,
      description: `${selectedReportData?.title} will be downloaded shortly.`,
    });
  };

  const quickStats = [
    { label: 'Total Reports Generated', value: '1,247', change: '+12%' },
    { label: 'This Month', value: '84', change: '+8%' },
    { label: 'Avg Generation Time', value: '2.3s', change: '-15%' },
    { label: 'Export Success Rate', value: '99.8%', change: '+0.2%' }
  ];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <Badge variant="secondary" className="text-green-600">
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report Configuration */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Report Configuration
                </CardTitle>
                <CardDescription>
                  Configure your report parameters
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="report-type">Report Type</Label>
                  <Select value={selectedReport} onValueChange={setSelectedReport}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-range">Date Range</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select date range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last-7-days">Last 7 days</SelectItem>
                      <SelectItem value="last-30-days">Last 30 days</SelectItem>
                      <SelectItem value="last-quarter">Last Quarter</SelectItem>
                      <SelectItem value="last-year">Last Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department</Label>
                  <Select value={department} onValueChange={setDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {Object.keys(stats?.departments || {}).map((dept) => (
                        <SelectItem key={dept} value={dept.toLowerCase()}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={generateReport} 
                  className="w-full" 
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <FileText className="h-4 w-4 mr-2" />
                      Generate Report
                    </>
                  )}
                </Button>

                <div className="space-y-2">
                  <Label>Export Options</Label>
                  <div className="flex flex-col gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => exportReport('pdf')}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as PDF
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => exportReport('excel')}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as Excel
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => exportReport('csv')}
                      className="justify-start"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Export as CSV
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Reports */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Available Reports</CardTitle>
                <CardDescription>
                  Choose from our comprehensive report library
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTypes.map((report) => {
                    const Icon = report.icon;
                    return (
                      <Card 
                        key={report.id} 
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedReport === report.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => setSelectedReport(report.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${
                              selectedReport === report.id 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-sm">{report.title}</h3>
                                <Badge variant="outline" className="text-xs">
                                  {report.category}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {report.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Scheduled Reports</CardTitle>
              <CardDescription>
                Manage your automated report schedules
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Weekly Employee Summary', frequency: 'Every Monday 9:00 AM', status: 'Active' },
                  { name: 'Monthly Department Analysis', frequency: '1st of every month', status: 'Active' },
                  { name: 'Quarterly Performance Review', frequency: 'Every 3 months', status: 'Paused' }
                ].map((schedule, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{schedule.name}</h4>
                      <p className="text-sm text-muted-foreground">{schedule.frequency}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={schedule.status === 'Active' ? 'default' : 'secondary'}>
                        {schedule.status}
                      </Badge>
                      <Button variant="outline" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Report History</CardTitle>
              <CardDescription>
                View and download previously generated reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Employee Summary Report', date: '2024-06-15', type: 'PDF', size: '2.3 MB' },
                  { name: 'Department Analysis', date: '2024-06-14', type: 'Excel', size: '1.8 MB' },
                  { name: 'Attendance Report', date: '2024-06-13', type: 'CSV', size: '890 KB' },
                  { name: 'Payroll Summary', date: '2024-06-12', type: 'PDF', size: '1.2 MB' }
                ].map((report, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {report.date} • {report.type} • {report.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;
