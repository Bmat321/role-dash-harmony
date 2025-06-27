
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Clock, Play, Pause, Square, CalendarIcon, Timer, TrendingUp, Users } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface TimeEntry {
  id: string;
  employeeId: string;
  employeeName: string;
  project: string;
  task: string;
  startTime: string;
  endTime: string;
  duration: number; // in minutes
  date: string;
  status: 'active' | 'completed' | 'pending';
  description?: string;
}

interface Project {
  id: string;
  name: string;
  client: string;
  status: 'active' | 'completed' | 'on-hold';
  totalHours: number;
  budgetHours: number;
  team: string[];
}

const TimeTrackingManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('tracker');
  const [isTracking, setIsTracking] = useState(false);
  const [currentTask, setCurrentTask] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedProject, setSelectedProject] = useState('');
  const { toast } = useToast();

  const mockTimeEntries: TimeEntry[] = [
    {
      id: '1',
      employeeId: '4',
      employeeName: 'Jane Doe',
      project: 'Website Redesign',
      task: 'Frontend Development',
      startTime: '09:00',
      endTime: '12:30',
      duration: 210,
      date: '2024-12-20',
      status: 'completed',
      description: 'Implemented new navigation component'
    },
    {
      id: '2',
      employeeId: '4',
      employeeName: 'Jane Doe',
      project: 'Mobile App',
      task: 'Bug Fixes',
      startTime: '13:30',
      endTime: '17:00',
      duration: 210,
      date: '2024-12-20',
      status: 'completed',
      description: 'Fixed login authentication issues'
    },
    {
      id: '3',
      employeeId: '5',
      employeeName: 'Alice Smith',
      project: 'Marketing Campaign',
      task: 'Content Creation',
      startTime: '10:00',
      endTime: '15:30',
      duration: 330,
      date: '2024-12-20',
      status: 'completed',
      description: 'Created social media content for Q1 campaign'
    }
  ];

  const mockProjects: Project[] = [
    {
      id: '1',
      name: 'Website Redesign',
      client: 'TechCorp Inc.',
      status: 'active',
      totalHours: 145,
      budgetHours: 200,
      team: ['Jane Doe', 'Bob Wilson']
    },
    {
      id: '2',
      name: 'Mobile App',
      client: 'StartupXYZ',
      status: 'active',
      totalHours: 87,
      budgetHours: 120,
      team: ['Jane Doe', 'Mike Johnson']
    },
    {
      id: '3',
      name: 'Marketing Campaign',
      client: 'RetailCo',
      status: 'active',
      totalHours: 62,
      budgetHours: 80,
      team: ['Alice Smith', 'Sarah Johnson']
    }
  ];

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'on-hold': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleStartTracking = () => {
    if (!currentTask || !selectedProject) {
      toast({
        title: "Error",
        description: "Please select a project and enter a task description",
        variant: "destructive"
      });
      return;
    }

    setIsTracking(true);
    toast({
      title: "Time Tracking Started",
      description: `Started tracking time for: ${currentTask}`,
    });
  };

  const handleStopTracking = () => {
    setIsTracking(false);
    toast({
      title: "Time Tracking Stopped",
      description: "Time entry has been saved successfully",
    });
  };

  const getTotalHoursToday = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntries = mockTimeEntries.filter(entry => entry.date === today);
    const totalMinutes = todayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return formatDuration(totalMinutes);
  };

  const getTotalHoursWeek = () => {
    // Mock calculation for demonstration
    return "32h 15m";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Time Tracking</h2>
          <p className="text-gray-600">Track work hours, manage projects, and monitor productivity</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Timer className="h-4 w-4 mr-2" />
            Reports
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tracker">Time Tracker</TabsTrigger>
          <TabsTrigger value="entries">Time Entries</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Today's Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalHoursToday()}</div>
                <p className="text-xs text-gray-500">Logged today</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">This Week</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{getTotalHoursWeek()}</div>
                <p className="text-xs text-gray-500">Total this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Current Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isTracking ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="text-sm font-medium">
                    {isTracking ? 'Tracking Active' : 'Not Tracking'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Time Tracker
              </CardTitle>
              <CardDescription>Start tracking your work time</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockProjects.map((project) => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="task">Task Description</Label>
                  <Input
                    id="task"
                    placeholder="What are you working on?"
                    value={currentTask}
                    onChange={(e) => setCurrentTask(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-4xl font-mono font-bold mb-4">
                    {isTracking ? "01:23:45" : "00:00:00"}
                  </div>
                  <div className="flex gap-2 justify-center">
                    {!isTracking ? (
                      <Button onClick={handleStartTracking} size="lg" className="px-8">
                        <Play className="h-5 w-5 mr-2" />
                        Start Timer
                      </Button>
                    ) : (
                      <>
                        <Button variant="outline" size="lg">
                          <Pause className="h-5 w-5 mr-2" />
                          Pause
                        </Button>
                        <Button onClick={handleStopTracking} size="lg" variant="destructive">
                          <Square className="h-5 w-5 mr-2" />
                          Stop
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entries" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Time Entries</CardTitle>
              <CardDescription>View and manage your time entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockTimeEntries.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{entry.project}</h4>
                        <Badge className={getStatusColor(entry.status)}>
                          {entry.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{entry.task}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-1">
                        <span>{entry.employeeName}</span>
                        <span>{format(new Date(entry.date), 'MMM dd, yyyy')}</span>
                        <span>{entry.startTime} - {entry.endTime}</span>
                        <span className="font-medium">{formatDuration(entry.duration)}</span>
                      </div>
                      {entry.description && (
                        <p className="text-sm text-gray-600">{entry.description}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Monitor project progress and time allocation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjects.map((project) => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.client}</p>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-500">Hours Logged</div>
                        <div className="text-lg font-semibold">{project.totalHours}h</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Budget</div>
                        <div className="text-lg font-semibold">{project.budgetHours}h</div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-500">Progress</div>
                        <div className="text-lg font-semibold">
                          {Math.round((project.totalHours / project.budgetHours) * 100)}%
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min((project.totalHours / project.budgetHours) * 100, 100)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Team: {project.team.join(', ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247h</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Billable Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,089h</div>
                <p className="text-xs text-gray-500">87% utilization</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Hours/Day</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">7.8h</div>
                <p className="text-xs text-gray-500">Per employee</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Overtime Hours</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">124h</div>
                <p className="text-xs text-gray-500">This month</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Productivity Insights</CardTitle>
              <CardDescription>Key metrics and trends</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                    <h4 className="font-medium text-green-800">Productivity Up 12%</h4>
                  </div>
                  <p className="text-sm text-green-700">
                    Team productivity has increased compared to last month, with better project completion rates.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-5 w-5 text-blue-600" />
                    <h4 className="font-medium text-blue-800">Average Session: 2.3 hours</h4>
                  </div>
                  <p className="text-sm text-blue-700">
                    Employees are maintaining focused work sessions with minimal interruptions.
                  </p>
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Timer className="h-5 w-5 text-yellow-600" />
                    <h4 className="font-medium text-yellow-800">Peak Hours: 10 AM - 2 PM</h4>
                  </div>
                  <p className="text-sm text-yellow-700">
                    Most productive hours for the team. Consider scheduling important meetings outside this window.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TimeTrackingManagement;
