
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import AppraisalScoring from './AppraisalScoring';
import AppraisalCreation from './AppraisalCreation';
import { Appraisal } from '@/types/appraisal';

// Mock data
const mockEmployees = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', department: 'IT' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'HR' },
  { id: '3', name: 'Mike Wilson', email: 'mike.wilson@example.com', department: 'Finance' },
  { id: '4', name: 'Emily Johnson', email: 'emily.johnson@example.com', department: 'Marketing' }
];

const AppraisalManagement: React.FC = () => {
  const { user } = useAuth();
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const isTeamLead = user?.role === 'manager' || user?.role === 'admin';
  const isEmployee = user?.role === 'employee';
  const isHR = user?.role === 'hr' || user?.role === 'admin';

  const handleCreateAppraisal = (newAppraisal: Appraisal) => {
    setAppraisals(prev => [newAppraisal, ...prev]);
  };

  const handleAppraisalUpdate = (updatedAppraisal: Appraisal, action: 'submit' | 'approve' | 'revise') => {
    setAppraisals(prev => prev.map(appr => {
      if (appr.id === updatedAppraisal.id) {
        let newStatus = appr.status;
        
        switch (action) {
          case 'submit':
            newStatus = 'employee_completed';
            break;
          case 'approve':
            newStatus = 'hr_review';
            break;
          case 'revise':
            newStatus = 'needs_revision';
            break;
        }

        return { ...updatedAppraisal, status: newStatus };
      }
      return appr;
    }));

    setSelectedAppraisal(null);
  };

  const handleViewAppraisal = (appraisal: Appraisal) => {
    setSelectedAppraisal(appraisal);
  };

  const getStatusBadge = (status: Appraisal['status']) => {
    const badges = {
      'draft': <Badge variant="outline">Draft</Badge>,
      'sent_to_employee': <Badge variant="outline" className="bg-blue-50">Sent to Employee</Badge>,
      'employee_completed': <Badge variant="outline" className="bg-yellow-50">Awaiting Review</Badge>,
      'teamlead_review': <Badge variant="outline" className="bg-orange-50">Team Lead Review</Badge>,
      'approved': <Badge variant="outline" className="bg-green-50">Approved</Badge>,
      'needs_revision': <Badge variant="outline" className="bg-red-50">Needs Revision</Badge>,
      'hr_review': <Badge variant="outline" className="bg-purple-50">HR Review</Badge>,
      'completed': <Badge className="bg-green-100 text-green-800">Completed</Badge>
    };
    return badges[status] || <Badge variant="outline">Unknown</Badge>;
  };

  const getUserAppraisals = () => {
    if (isTeamLead) {
      return appraisals.filter(appr => appr.teamLeadId === user?.id);
    } else if (isEmployee) {
      return appraisals.filter(appr => appr.employeeId === user?.id);
    } else if (isHR) {
      return appraisals.filter(appr => ['hr_review', 'completed'].includes(appr.status));
    }
    return appraisals;
  };

  const getPendingAppraisals = () => {
    const userAppraisals = getUserAppraisals();
    if (isEmployee) {
      return userAppraisals.filter(appr => ['sent_to_employee', 'needs_revision'].includes(appr.status));
    } else if (isTeamLead) {
      return userAppraisals.filter(appr => appr.status === 'employee_completed');
    } else if (isHR) {
      return userAppraisals.filter(appr => appr.status === 'hr_review');
    }
    return [];
  };

  const getCompletedAppraisals = () => {
    return getUserAppraisals().filter(appr => ['approved', 'completed'].includes(appr.status));
  };

  if (selectedAppraisal) {
    return (
      <AppraisalScoring
        appraisal={selectedAppraisal}
        isTeamLead={isTeamLead && selectedAppraisal.teamLeadId === user?.id}
        isEmployee={isEmployee && selectedAppraisal.employeeId === user?.id}
        onBack={() => setSelectedAppraisal(null)}
        onSubmit={handleAppraisalUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold">Performance Appraisal</h2>
            <p className="text-gray-600">Manage and track employee performance evaluations</p>
          </div>
          {isTeamLead && (
            <Button onClick={() => setIsCreateDialogOpen(true)} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Appraisal
            </Button>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Total Appraisals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{getUserAppraisals().length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{getPendingAppraisals().length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{getCompletedAppraisals().length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {getUserAppraisals().filter(appr => 
                  new Date(appr.createdAt).getMonth() === new Date().getMonth()
                ).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="pending" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending ({getPendingAppraisals().length})
            </TabsTrigger>
            <TabsTrigger value="all" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              All Appraisals
            </TabsTrigger>
            <TabsTrigger value="completed" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Completed
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Appraisals</CardTitle>
                <CardDescription>
                  {isEmployee && "Complete your self-assessments"}
                  {isTeamLead && "Review employee submissions"}
                  {isHR && "Final review and approval"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {getPendingAppraisals().length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No pending appraisals</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Employee</TableHead>
                          <TableHead className="hidden sm:table-cell">Period</TableHead>
                          <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getPendingAppraisals().map((appraisal) => (
                          <TableRow key={appraisal.id}>
                            <TableCell className="font-medium">{appraisal.title}</TableCell>
                            <TableCell>{appraisal.employeeName}</TableCell>
                            <TableCell className="hidden sm:table-cell">{appraisal.period}</TableCell>
                            <TableCell className="hidden sm:table-cell">
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
                                <span className="hidden sm:inline">View</span>
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
          </TabsContent>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Appraisals</CardTitle>
                <CardDescription>Complete list of appraisals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead className="hidden sm:table-cell">Team Lead</TableHead>
                        <TableHead className="hidden sm:table-cell">Period</TableHead>
                        <TableHead className="hidden sm:table-cell">Due Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getUserAppraisals().map((appraisal) => (
                        <TableRow key={appraisal.id}>
                          <TableCell className="font-medium">{appraisal.title}</TableCell>
                          <TableCell>{appraisal.employeeName}</TableCell>
                          <TableCell className="hidden sm:table-cell">{appraisal.teamLeadName}</TableCell>
                          <TableCell className="hidden sm:table-cell">{appraisal.period}</TableCell>
                          <TableCell className="hidden sm:table-cell">
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
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="completed">
            <Card>
              <CardHeader>
                <CardTitle>Completed Appraisals</CardTitle>
                <CardDescription>Approved and finalized appraisals</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Employee</TableHead>
                        <TableHead className="hidden sm:table-cell">Final Score</TableHead>
                        <TableHead className="hidden sm:table-cell">Completed Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {getCompletedAppraisals().map((appraisal) => (
                        <TableRow key={appraisal.id}>
                          <TableCell className="font-medium">{appraisal.title}</TableCell>
                          <TableCell>{appraisal.employeeName}</TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <span className="font-medium">
                              {appraisal.totalScore.final.toFixed(1)}/100
                            </span>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            {new Date(appraisal.updatedAt).toLocaleDateString()}
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
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Create Appraisal Dialog */}
        <AppraisalCreation
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onCreateAppraisal={handleCreateAppraisal}
          currentUser={user}
          employees={mockEmployees}
        />
      </div>
    </div>
  );
};

export default AppraisalManagement;
