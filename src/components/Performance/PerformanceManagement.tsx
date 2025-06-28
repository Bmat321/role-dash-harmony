import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Target, TrendingUp, Award, FileText, Plus, Search } from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PerformanceReview {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewPeriod: string;
  status: 'draft' | 'pending' | 'completed' | 'overdue';
  overallRating: number;
  goals: Goal[];
  reviewDate: string;
  reviewerId: string;
  reviewerName: string;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
  progress: number;
  category: 'performance' | 'development' | 'behavioral';
}

type GoalCategory = 'performance' | 'development' | 'behavioral';

const PerformanceManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('reviews');
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [newGoal, setNewGoal] = useState({
    title: '',
    description: '',
    category: 'performance' as GoalCategory,
    targetDate: ''
  });
  const { toast } = useToast();

  const mockReviews: PerformanceReview[] = [
    {
      id: '1',
      employeeId: '4',
      employeeName: 'Jane Doe',
      reviewPeriod: 'Q4 2024',
      status: 'completed',
      overallRating: 4.2,
      goals: [],
      reviewDate: '2024-12-15',
      reviewerId: '3',
      reviewerName: 'Mike Wilson'
    },
    {
      id: '2',
      employeeId: '5',
      employeeName: 'Alice Smith',
      reviewPeriod: 'Q4 2024',
      status: 'pending',
      overallRating: 0,
      goals: [],
      reviewDate: '2024-12-20',
      reviewerId: '2',
      reviewerName: 'Sarah Johnson'
    }
  ];

  const mockGoals: Goal[] = [
    {
      id: '1',
      title: 'Complete React Certification',
      description: 'Obtain React developer certification to enhance frontend skills',
      targetDate: '2024-12-30',
      status: 'in-progress',
      progress: 65,
      category: 'development'
    },
    {
      id: '2',
      title: 'Improve Code Review Quality',
      description: 'Provide more detailed and constructive code reviews',
      targetDate: '2024-12-15',
      status: 'completed',
      progress: 100,
      category: 'performance'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleCreateGoal = () => {
    if (!newGoal.title || !newGoal.description || !newGoal.targetDate) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Goal Created",
      description: "New performance goal has been created successfully",
    });

    setNewGoal({
      title: '',
      description: '',
      category: 'performance',
      targetDate: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Performance Management</h2>
          <p className="text-gray-600">Track goals, conduct reviews, and manage performance</p>
        </div>
        <div className="flex gap-2">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Review
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="goals">Goals</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-gray-500">+4 from last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-gray-500">Due this month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2</div>
                <p className="text-xs text-gray-500">+0.3 improvement</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Reviews</CardTitle>
              <CardDescription>Performance reviews for all employees</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <div key={review.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{review.employeeName}</h4>
                        <Badge className={getStatusColor(review.status)}>
                          {review.status}
                        </Badge>
                        <span className="text-sm text-gray-500">{review.reviewPeriod}</span>
                      </div>
                      <p className="text-sm text-gray-600">
                        Reviewer: {review.reviewerName} • Due: {format(new Date(review.reviewDate), 'MMM dd, yyyy')}
                      </p>
                      {review.overallRating > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-sm">Rating:</span>
                          <div className="flex items-center">
                            <span className="font-medium">{review.overallRating}/5</span>
                            <Progress value={review.overallRating * 20} className="w-20 ml-2" />
                          </div>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      <FileText className="h-4 w-4 mr-2" />
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="goals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Set New Goal</CardTitle>
              <CardDescription>Create performance and development goals</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Goal Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter goal title"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={newGoal.category} onValueChange={(value: GoalCategory) => setNewGoal({...newGoal, category: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="performance">Performance</SelectItem>
                      <SelectItem value="development">Development</SelectItem>
                      <SelectItem value="behavioral">Behavioral</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the goal and success criteria"
                  value={newGoal.description}
                  onChange={(e) => setNewGoal({...newGoal, description: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Select target date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        setNewGoal({...newGoal, targetDate: date ? date.toISOString() : ''});
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <Button onClick={handleCreateGoal} className="w-full">
                <Target className="h-4 w-4 mr-2" />
                Create Goal
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Goals</CardTitle>
              <CardDescription>Track progress on current goals</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockGoals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{goal.title}</h4>
                          <Badge variant="outline" className="capitalize">
                            {goal.category}
                          </Badge>
                          <Badge className={getStatusColor(goal.status)}>
                            {goal.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{goal.description}</p>
                        <p className="text-xs text-gray-500">
                          Target: {format(new Date(goal.targetDate), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Progress:</span>
                      <Progress value={goal.progress} className="flex-1" />
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Performance Trend
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">+15%</div>
                <p className="text-xs text-gray-500">vs last quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Target className="h-4 w-4" />
                  Goals Achieved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-gray-500">Success rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Award className="h-4 w-4" />
                  Top Performers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-gray-500">Excellence rating</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Review Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">94%</div>
                <p className="text-xs text-gray-500">On-time completion</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Review Templates</CardTitle>
              <CardDescription>Pre-built templates for different types of reviews</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Annual Performance Review</h4>
                  <p className="text-sm text-gray-600 mb-3">Comprehensive yearly evaluation covering all aspects of performance</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Quarterly Check-in</h4>
                  <p className="text-sm text-gray-600 mb-3">Quick quarterly review to track progress and set goals</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">Probationary Review</h4>
                  <p className="text-sm text-gray-600 mb-3">Evaluation template for employees in probationary period</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
                <div className="p-4 border rounded-lg">
                  <h4 className="font-medium mb-2">360-Degree Feedback</h4>
                  <p className="text-sm text-gray-600 mb-3">Multi-source feedback including peers, subordinates, and managers</p>
                  <Button variant="outline" size="sm">Use Template</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PerformanceManagement;
