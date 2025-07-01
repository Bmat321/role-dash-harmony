
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileUp, Download, Eye, Calendar, Clock, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface HandoverReport {
  id: string;
  employeeId: string;
  employeeName: string;
  teamLeadId: string;
  teamLeadName: string;
  date: string;
  shift: 'day' | 'night';
  summary: string;
  keyActivities: string;
  pendingTasks: string;
  issues: string;
  recommendations: string;
  status: 'draft' | 'submitted' | 'reviewed';
  submittedAt?: string;
  pdfUrl?: string;
}

const HandoverManagement: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('my-reports');
  const [handoverReports, setHandoverReports] = useState<HandoverReport[]>([
    {
      id: '1',
      employeeId: '4',
      employeeName: 'Jane Doe',
      teamLeadId: '2',
      teamLeadName: 'Sarah Johnson',
      date: '2024-01-15',
      shift: 'day',
      summary: 'Completed all assigned tasks for the day',
      keyActivities: 'Client meetings, document reviews, team coordination',
      pendingTasks: 'Follow up with client ABC, complete project report',
      issues: 'System downtime for 30 minutes',
      recommendations: 'Upgrade server capacity',
      status: 'submitted',
      submittedAt: '2024-01-15T17:30:00Z'
    }
  ]);

  const [newReport, setNewReport] = useState({
    date: new Date().toISOString().split('T')[0],
    shift: 'day' as 'day' | 'night',
    summary: '',
    keyActivities: '',
    pendingTasks: '',
    issues: '',
    recommendations: ''
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSubmitReport = () => {
    if (!newReport.summary || !newReport.keyActivities) {
      toast({
        title: "Error",
        description: "Please fill in required fields",
        variant: "destructive"
      });
      return;
    }

    const report: HandoverReport = {
      id: Date.now().toString(),
      employeeId: user?.id || '',
      employeeName: user ? `${user.firstName} ${user.lastName}` : '',
      teamLeadId: '2', // This should be dynamic based on organizational structure
      teamLeadName: 'Team Lead',
      date: newReport.date,
      shift: newReport.shift,
      summary: newReport.summary,
      keyActivities: newReport.keyActivities,
      pendingTasks: newReport.pendingTasks,
      issues: newReport.issues,
      recommendations: newReport.recommendations,
      status: 'submitted',
      submittedAt: new Date().toISOString()
    };

    setHandoverReports(prev => [report, ...prev]);
    setNewReport({
      date: new Date().toISOString().split('T')[0],
      shift: 'day',
      summary: '',
      keyActivities: '',
      pendingTasks: '',
      issues: '',
      recommendations: ''
    });
    setIsDialogOpen(false);

    toast({
      title: "Report Submitted",
      description: "Your handover report has been submitted successfully",
    });
  };

  const generatePDF = (report: HandoverReport) => {
    // This would typically generate a PDF using a library like jsPDF
    toast({
      title: "PDF Generated",
      description: "Handover report PDF has been generated",
    });
  };

  const getStatusColor = (status: HandoverReport['status']) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'submitted': return 'bg-blue-100 text-blue-800';
      case 'reviewed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getShiftColor = (shift: 'day' | 'night') => {
    return shift === 'day' 
      ? 'bg-yellow-100 text-yellow-800' 
      : 'bg-purple-100 text-purple-800';
  };

  const canViewAllReports = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Handover Reports</h2>
          <p className="text-gray-600">Daily handover reports management</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <FileUp className="h-4 w-4 mr-2" />
              Submit Report
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Daily Handover Report</DialogTitle>
              <DialogDescription>
                Submit your daily handover report to your team lead
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={newReport.date}
                    onChange={(e) => setNewReport(prev => ({ ...prev, date: e.target.value }))}
                  />
                </div>
                <div>
                  <Label>Shift</Label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={newReport.shift}
                    onChange={(e) => setNewReport(prev => ({ ...prev, shift: e.target.value as 'day' | 'night' }))}
                  >
                    <option value="day">Day Shift (8:30 AM - 5:00 PM)</option>
                    <option value="night">Night Shift (8:00 PM - 4:00 AM)</option>
                  </select>
                </div>
              </div>
              
              <div>
                <Label>Summary *</Label>
                <Textarea
                  value={newReport.summary}
                  onChange={(e) => setNewReport(prev => ({ ...prev, summary: e.target.value }))}
                  placeholder="Brief summary of the day's work"
                  required
                />
              </div>
              
              <div>
                <Label>Key Activities *</Label>
                <Textarea
                  value={newReport.keyActivities}
                  onChange={(e) => setNewReport(prev => ({ ...prev, keyActivities: e.target.value }))}
                  placeholder="List of key activities completed"
                  required
                />
              </div>
              
              <div>
                <Label>Pending Tasks</Label>
                <Textarea
                  value={newReport.pendingTasks}
                  onChange={(e) => setNewReport(prev => ({ ...prev, pendingTasks: e.target.value }))}
                  placeholder="Tasks that need to be completed"
                />
              </div>
              
              <div>
                <Label>Issues Encountered</Label>
                <Textarea
                  value={newReport.issues}
                  onChange={(e) => setNewReport(prev => ({ ...prev, issues: e.target.value }))}
                  placeholder="Any issues or challenges faced"
                />
              </div>
              
              <div>
                <Label>Recommendations</Label>
                <Textarea
                  value={newReport.recommendations}
                  onChange={(e) => setNewReport(prev => ({ ...prev, recommendations: e.target.value }))}
                  placeholder="Suggestions for improvements"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitReport}>
                Submit Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          {canViewAllReports && <TabsTrigger value="team-reports">Team Reports</TabsTrigger>}
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="my-reports">
          <Card>
            <CardHeader>
              <CardTitle>My Handover Reports</CardTitle>
              <CardDescription>View and manage your submitted handover reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Summary</TableHead>
                    <TableHead>Team Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {handoverReports
                    .filter(report => !canViewAllReports || report.employeeId === user?.id)
                    .map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge className={getShiftColor(report.shift)}>
                          {report.shift === 'day' ? 'Day (8:30-17:00)' : 'Night (20:00-04:00)'}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">{report.summary}</TableCell>
                      <TableCell>{report.teamLeadName}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)}>
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => generatePDF(report)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {canViewAllReports && (
          <TabsContent value="team-reports">
            <Card>
              <CardHeader>
                <CardTitle>Team Handover Reports</CardTitle>
                <CardDescription>Review handover reports from your team members</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Key Activities</TableHead>
                      <TableHead>Pending Tasks</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {handoverReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.employeeName}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge className={getShiftColor(report.shift)}>
                            {report.shift === 'day' ? 'Day' : 'Night'}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{report.keyActivities}</TableCell>
                        <TableCell className="max-w-xs truncate">{report.pendingTasks}</TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(report.status)}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => generatePDF(report)}>
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  This Month
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <p className="text-xs text-gray-500">Reports submitted</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  On Time
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">95%</div>
                <p className="text-xs text-gray-500">Submission rate</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Team Average
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.2</div>
                <p className="text-xs text-gray-500">Reports per week</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default HandoverManagement;
