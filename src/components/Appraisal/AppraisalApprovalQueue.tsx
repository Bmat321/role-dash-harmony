import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AppraisalScoring from './AppraisalScoring';
import { Appraisal } from '@/types/appraisal';
import { useCombinedContext } from '@/contexts/AuthContext';

// Mock data for pending appraisals
const mockPendingAppraisals: Appraisal[] = [
  {
    id: '1',
    employeeId: 'emp001',
    employeeName: 'John Doe',
    teamLeadId: 'tl001',
    teamLeadName: 'Manager Smith',
    title: 'Q4 2024 Performance Review',
    period: 'Q4 2024',
    dueDate: '2024-12-31',
    status: 'employee_completed',
    objectives: [],
    createdAt: '2024-11-01T00:00:00Z',
    updatedAt: '2024-11-20T00:00:00Z',
    totalScore: { employee: 85, teamLead: 0, final: 0 }
  },
  {
    id: '2',
    employeeId: 'emp002',
    employeeName: 'Jane Smith',
    teamLeadId: 'tl001',
    teamLeadName: 'Manager Smith',
    title: 'Annual Performance Review 2024',
    period: 'Annual 2024',
    dueDate: '2024-12-15',
    status: 'employee_completed',
    objectives: [],
    createdAt: '2024-10-15T00:00:00Z',
    updatedAt: '2024-11-18T00:00:00Z',
    totalScore: { employee: 92, teamLead: 0, final: 0 }
  }
];

const AppraisalApprovalQueue: React.FC = () => {
            const {user: userAppraisalApprovalQueue,  profile } = useCombinedContext();
           const { user} = userAppraisalApprovalQueue
  const [pendingAppraisals, setPendingAppraisals] = useState<Appraisal[]>(mockPendingAppraisals);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);

  const isTeamLead = user?.role.toLowerCase() === 'manager' || user?.role.toLowerCase() === 'teamlead' || user?.role.toLowerCase() === 'admin';

  const handleViewAppraisal = (appraisal: Appraisal) => {
    setSelectedAppraisal(appraisal);
  };

  const handleAppraisalDecision = (updatedAppraisal: Appraisal, action: 'submit' | 'approve' | 'revise') => {
    setPendingAppraisals(prev => prev.filter(appr => appr.id !== updatedAppraisal.id));
    setSelectedAppraisal(null);

    const actionText = action === 'approve' ? 'approved' : 'sent for revision';
    toast({
      title: "Success",
      description: `Appraisal ${actionText} successfully`,
    });
  };

  const getStatusBadge = (status: Appraisal['status']) => {
    const badges = {
      'employee_completed': <Badge variant="outline" className="bg-yellow-50 text-yellow-700">Awaiting Review</Badge>,
      'teamlead_review': <Badge variant="outline" className="bg-orange-50 text-orange-700">In Review</Badge>,
      'needs_revision': <Badge variant="outline" className="bg-red-50 text-red-700">Needs Revision</Badge>,
      'approved': <Badge variant="outline" className="bg-green-50 text-green-700">Approved</Badge>
    };
    return badges[status] || <Badge variant="outline">Unknown</Badge>;
  };

  const getPriorityColor = (dueDate: string) => {
    const due = new Date(dueDate);
    const now = new Date();
    const daysUntilDue = Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysUntilDue <= 3) return 'text-red-600';
    if (daysUntilDue <= 7) return 'text-yellow-600';
    return 'text-gray-600';
  };

  if (selectedAppraisal) {
    return (
      <AppraisalScoring
        appraisal={selectedAppraisal}
        isTeamLead={true}
        isEmployee={false}
        onBack={() => setSelectedAppraisal(null)}
        onSubmit={handleAppraisalDecision}
      />
    );
  }

  if (!isTeamLead) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertTriangle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <CardTitle>Access Restricted</CardTitle>
            <CardDescription>
              Only team leads and managers can access the appraisal approval queue.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Appraisal Approval Queue</h2>
            <p className="text-gray-600">Review and approve employee performance appraisals</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">
                {pendingAppraisals.filter(a => a.status === 'employee_completed').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Approved Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Revisions Requested
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                Overdue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {pendingAppraisals.filter(a => new Date(a.dueDate) < new Date()).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending Appraisals Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Pending Appraisal Reviews
            </CardTitle>
            <CardDescription>
              Appraisals submitted by employees awaiting your review and approval
            </CardDescription>
          </CardHeader>
          <CardContent>
            {pendingAppraisals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No pending appraisal reviews</p>
                <p className="text-sm">All appraisals have been processed</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead className="hidden sm:table-cell">Period</TableHead>
                      <TableHead className="hidden sm:table-cell">Employee Score</TableHead>
                      <TableHead className="hidden md:table-cell">Due Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingAppraisals.map((appraisal) => (
                      <TableRow key={appraisal.id}>
                        <TableCell className="font-medium">{appraisal.employeeName}</TableCell>
                        <TableCell>{appraisal.title}</TableCell>
                        <TableCell className="hidden sm:table-cell">{appraisal.period}</TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <span className="font-semibold text-blue-600">
                            {appraisal.totalScore.employee.toFixed(1)}/100
                          </span>
                        </TableCell>
                        <TableCell className={`hidden md:table-cell ${getPriorityColor(appraisal.dueDate)}`}>
                          {new Date(appraisal.dueDate).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{getStatusBadge(appraisal.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewAppraisal(appraisal)}
                            className="flex items-center gap-1"
                          >
                            <Eye className="h-3 w-3" />
                            <span className="hidden sm:inline">Review</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AppraisalApprovalQueue;
