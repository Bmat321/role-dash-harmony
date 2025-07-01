
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Slider } from '@/components/ui/slider';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Award, Send, Eye, Calendar, Target, BarChart } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface AppraisalCriteria {
  id: string;
  category: string;
  objective: string;
  kpi: string;
  measurement: string;
  maxMarks: number;
  score?: number;
}

interface Appraisal {
  id: string;
  employeeId: string;
  employeeName: string;
  period: 'monthly' | 'quarterly' | 'bi-annually' | 'annually';
  department: string;
  status: 'draft' | 'sent' | 'completed' | 'overdue';
  totalScore: number;
  maxScore: number;
  createdDate: string;
  dueDate: string;
  criteria: AppraisalCriteria[];
}

const defaultCriteria: AppraisalCriteria[] = [
  {
    id: '1',
    category: 'OBJECTIVES',
    objective: 'Unit Objective',
    kpi: 'Timely and Accurate fulfilment of all visa and immigration requests as received via email; Track all sales',
    measurement: 'Show evidence on daily report on HRIS, Weekly Visa and Immigration request fulfilment data and sales. MIS tracking report. 1 negative mark per missed/ delayed requests due to human error.',
    maxMarks: 20
  },
  {
    id: '2',
    category: 'OBJECTIVES',
    objective: 'Mandatory Sales Requirement',
    kpi: 'Close sale/ contribute an initiative that generates revenue. (Show evidence of total individual sales)',
    measurement: '(Show evidence of total individual sales)',
    maxMarks: 15
  },
  {
    id: '3',
    category: 'FINANCIAL',
    objective: 'Satisfactory service to internal customer',
    kpi: 'Early submission of time bound tasks, Availability via SMS, CUG, Whatsapp, 3CX, when required. Immediate acceptable feedback/ dissemination of relevant info to all concerned. Satisfactory and Timely responses to internal requests.',
    measurement: 'Daily Minutes of meeting/ Weekly Sales Activity/ Monthly Accounts Management/ Quarterly Board Report report submission. Show screen shots of time stamps and link to weekly reports on concave.',
    maxMarks: 10
  },
  {
    id: '4',
    category: 'FINANCIAL',
    objective: 'Must keep the external client complaint volume down for the entire year',
    kpi: 'Must keep the external client complaint volume down for the entire year. Manage internal or external issues, generate QA investigation report and follow through till resolved',
    measurement: 'Show QA investigation report of all incidents. Evidence of feedback link for process and corrective trainings, Minimum of 2 internal/ external commendations per appraisal period',
    maxMarks: 10
  },
  {
    id: '5',
    category: 'FINANCIAL',
    objective: 'Followed up via calls, messages, emails etc and responded according to SLA',
    kpi: 'Followed up via calls, messages, emails etc and responded according to SLA. Kept to agreed terms, implementation of signed contract and agreed timelines',
    measurement: 'Minimum of 80% customer satisfaction ratings. Show evidence of 100% vendor/ supplier visit reports/ Audit reports/ renewal reports/ vendor quarterly evaluation report',
    maxMarks: 10
  },
  {
    id: '6',
    category: 'CUSTOMER SERVICE',
    objective: 'Adherence to SOPs, documentation of processes, back up of key positions',
    kpi: 'Strict adherence to SOPs/ stipulated guidelines on reports, Up to date documentation in line with expectations, Documented leave reliever training and demonstrated ability to take ownership of tasks and persons assigned',
    measurement: 'Show evidence of SOPs on flow charts, Identify CHOICE and Mission Statement. Show minimum of three self driven initiatives within appraisal period that demonstrated any of our CHOICE core values.',
    maxMarks: 5
  },
  {
    id: '7',
    category: 'CUSTOMER SERVICE',
    objective: 'Punctuality and availability',
    kpi: 'Resumption as stated in departmental calendar/ as directed at client\'s office, at internal/ external meetings and at training sessions',
    measurement: 'Average of daily attendance score from the Time and Attendance biometric machine, also from the HRIS. Evidence of training feedback form of all scheduled trainings',
    maxMarks: 5
  },
  {
    id: '8',
    category: 'CUSTOMER SERVICE',
    objective: 'Prime responsibilities and duties',
    kpi: 'Prime Responsibilities and Duties (As listed in Job Description)',
    measurement: 'Average of monthly evaluation scores/ QA biannual scores attained within appraisal period',
    maxMarks: 10
  },
  {
    id: '9',
    category: 'INTERNAL PROCESS',
    objective: 'Leadership Evaluation and knowledge sharing',
    kpi: 'Compliance with BTM Culture tests- Annual Customer service certificate, Quarterly English and Geography tests',
    measurement: 'Show certificates and screen shots of quarterly English test, annual Customer service training, annual Business Ethics training and bi-annual Geography tests',
    maxMarks: 5
  },
  {
    id: '10',
    category: 'INTERNAL PROCESS',
    objective: 'Individual/ Self Driven Role Related Training',
    kpi: 'Identify, attend and document self driven role related trainings, webinars and conferences as assigned or listed in the training calendar/ Personal Brand Positioning across digital platforms',
    measurement: 'Show evidence of 8 hours of training per appraisal period and 16 hours for the entire year or show links to 8 BTM related brand awareness published work on social media per appraisal period and 16 hours/ 16 BTM related posts on personal SM handle for the entire year.',
    maxMarks: 10
  }
];

const AppraisalManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [newAppraisal, setNewAppraisal] = useState({
    employeeId: '',
    period: 'quarterly' as Appraisal['period'],
    department: '',
    dueDate: ''
  });
  const [scoringAppraisal, setScoringAppraisal] = useState<Appraisal | null>(null);

  const canCreateAppraisal = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';

  const handleCreateAppraisal = () => {
    if (!newAppraisal.employeeId || !newAppraisal.department || !newAppraisal.dueDate) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const appraisal: Appraisal = {
      id: Date.now().toString(),
      employeeId: newAppraisal.employeeId,
      employeeName: `Employee ${newAppraisal.employeeId}`,
      period: newAppraisal.period,
      department: newAppraisal.department,
      status: 'draft',
      totalScore: 0,
      maxScore: 100,
      createdDate: new Date().toISOString().split('T')[0],
      dueDate: newAppraisal.dueDate,
      criteria: defaultCriteria.map(c => ({ ...c, score: 0 }))
    };

    setAppraisals(prev => [appraisal, ...prev]);
    setNewAppraisal({
      employeeId: '',
      period: 'quarterly',
      department: '',
      dueDate: ''
    });

    toast({
      title: "Appraisal Created",
      description: "New appraisal has been created successfully",
    });
  };

  const handleScoreChange = (criteriaId: string, score: number) => {
    if (!scoringAppraisal) return;

    const updatedCriteria = scoringAppraisal.criteria.map(c => 
      c.id === criteriaId ? { ...c, score } : c
    );

    const totalScore = updatedCriteria.reduce((sum, c) => sum + (c.score || 0), 0);
    
    setScoringAppraisal({
      ...scoringAppraisal,
      criteria: updatedCriteria,
      totalScore
    });
  };

  const handleSendAppraisal = (appraisalId: string) => {
    setAppraisals(prev => prev.map(a => 
      a.id === appraisalId 
        ? { ...a, status: 'sent' as const }
        : a
    ));

    toast({
      title: "Appraisal Sent",
      description: "Appraisal has been sent to the employee",
    });
  };

  const getStatusColor = (status: Appraisal['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Appraisal Management</h2>
          <p className="text-gray-600">Manage employee performance appraisals</p>
        </div>
        {canCreateAppraisal && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Appraisal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Appraisal</DialogTitle>
                <DialogDescription>Set up a new performance appraisal</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Employee ID</Label>
                  <Input
                    value={newAppraisal.employeeId}
                    onChange={(e) => setNewAppraisal(prev => ({ ...prev, employeeId: e.target.value }))}
                    placeholder="Enter employee ID"
                  />
                </div>
                <div>
                  <Label>Period</Label>
                  <Select value={newAppraisal.period} onValueChange={(value: Appraisal['period']) => setNewAppraisal(prev => ({ ...prev, period: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="bi-annually">Bi-Annually</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Department</Label>
                  <Input
                    value={newAppraisal.department}
                    onChange={(e) => setNewAppraisal(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Enter department"
                  />
                </div>
                <div>
                  <Label>Due Date</Label>
                  <Input
                    type="date"
                    value={newAppraisal.dueDate}
                    onChange={(e) => setNewAppraisal(prev => ({ ...prev, dueDate: e.target.value }))}
                  />
                </div>
                <Button onClick={handleCreateAppraisal} className="w-full">
                  Create Appraisal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="appraisals">Appraisals</TabsTrigger>
          {canCreateAppraisal && <TabsTrigger value="scoring">Scoring</TabsTrigger>}
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Appraisals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{appraisals.length}</div>
                <p className="text-xs text-gray-500">All time</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appraisals.filter(a => a.status === 'sent').length}
                </div>
                <p className="text-xs text-gray-500">Awaiting completion</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {appraisals.filter(a => a.status === 'completed').length}
                </div>
                <p className="text-xs text-gray-500">This period</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-gray-500">Team average</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appraisals">
          <Card>
            <CardHeader>
              <CardTitle>Appraisal List</CardTitle>
              <CardDescription>Manage all employee appraisals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Period</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appraisals.map((appraisal) => (
                    <TableRow key={appraisal.id}>
                      <TableCell className="font-medium">{appraisal.employeeName}</TableCell>
                      <TableCell>{appraisal.department}</TableCell>
                      <TableCell className="capitalize">{appraisal.period}</TableCell>
                      <TableCell>
                        <span className={getScoreColor(appraisal.totalScore, appraisal.maxScore)}>
                          {appraisal.totalScore}/{appraisal.maxScore}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(appraisal.status)}>
                          {appraisal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{new Date(appraisal.dueDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => setScoringAppraisal(appraisal)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canCreateAppraisal && appraisal.status === 'draft' && (
                            <Button size="sm" onClick={() => handleSendAppraisal(appraisal.id)}>
                              <Send className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {canCreateAppraisal && (
          <TabsContent value="scoring">
            {scoringAppraisal ? (
              <Card>
                <CardHeader>
                  <CardTitle>Score Appraisal - {scoringAppraisal.employeeName}</CardTitle>
                  <CardDescription>
                    {scoringAppraisal.period} appraisal for {scoringAppraisal.department} department
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">
                        {scoringAppraisal.totalScore}
                      </div>
                      <div className="text-sm text-gray-500">Total Score</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold">{scoringAppraisal.maxScore}</div>
                      <div className="text-sm text-gray-500">Maximum Score</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.round((scoringAppraisal.totalScore / scoringAppraisal.maxScore) * 100)}%
                      </div>
                      <div className="text-sm text-gray-500">Percentage</div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {scoringAppraisal.criteria.map((criteria) => (
                      <div key={criteria.id} className="border rounded-lg p-4 space-y-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline">{criteria.category}</Badge>
                              <span className="font-medium">Max: {criteria.maxMarks} marks</span>
                            </div>
                            <h4 className="font-semibold mb-2">{criteria.objective}</h4>
                            <p className="text-sm text-gray-600 mb-2">{criteria.kpi}</p>
                            <p className="text-xs text-gray-500">{criteria.measurement}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <Label>Score: {criteria.score || 0}/{criteria.maxMarks}</Label>
                            <span className="text-sm text-gray-500">
                              {Math.round(((criteria.score || 0) / criteria.maxMarks) * 100)}%
                            </span>
                          </div>
                          <Slider
                            value={[criteria.score || 0]}
                            onValueChange={(value) => handleScoreChange(criteria.id, value[0])}
                            max={criteria.maxMarks}
                            min={0}
                            step={0.5}
                            className="w-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t">
                    <Button variant="outline" onClick={() => setScoringAppraisal(null)}>
                      Back to List
                    </Button>
                    <Button onClick={() => {
                      setAppraisals(prev => prev.map(a => 
                        a.id === scoringAppraisal.id ? scoringAppraisal : a
                      ));
                      setScoringAppraisal(null);
                      toast({
                        title: "Appraisal Updated",
                        description: "Scores have been saved successfully",
                      });
                    }}>
                      Save Scores
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="text-center py-8">
                  <Award className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-500">Select an appraisal from the list to start scoring</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        )}

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart className="h-5 w-5 mr-2" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Excellent (90-100%)</span>
                    <span className="font-bold text-green-600">25%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Good (80-89%)</span>
                    <span className="font-bold text-blue-600">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average (70-79%)</span>
                    <span className="font-bold text-yellow-600">20%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Below Average (&lt;70%)</span>
                    <span className="font-bold text-red-600">10%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Department Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Sales</span>
                    <span className="font-bold">88%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Marketing</span>
                    <span className="font-bold">85%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>IT</span>
                    <span className="font-bold">92%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>HR</span>
                    <span className="font-bold">87%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppraisalManagement;
