import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Eye, Clock, CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AppraisalScoring from './AppraisalScoring';
import AppraisalTargetSelection from './AppraisalTargetSelection';
import { Appraisal } from '@/types/appraisal';
import { useCombinedContext } from '@/contexts/AuthContext';

// Mock data
const mockEmployees = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', department: 'IT' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', department: 'HR' },
  { id: '3', name: 'Mike Wilson', email: 'mike.wilson@example.com', department: 'Finance' },
  { id: '4', name: 'Emily Johnson', email: 'emily.johnson@example.com', department: 'Marketing' }
];

const AppraisalManagement: React.FC = () => {
           const {user: userAppraisalManagement,  profile } = useCombinedContext();
          const { user} = userAppraisalManagement
  const [appraisals, setAppraisals] = useState<Appraisal[]>([]);
  const [selectedAppraisal, setSelectedAppraisal] = useState<Appraisal | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const isTeamLead = user?.role.toLowerCase() === 'manager' || user?.role.toLowerCase() === 'teamlead' || user?.role.toLowerCase() === 'admin';
  const isEmployee = user?.role.toLowerCase() === 'employee';
  const isHR = user?.role.toLowerCase() === 'hr' || user?.role.toLowerCase() === 'admin';

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

  if (selectedAppraisal) {
    return (
      <AppraisalScoring
        appraisal={selectedAppraisal}
        isTeamLead={isTeamLead && selectedAppraisal.teamLeadId === user?._id}
        isEmployee={isEmployee && selectedAppraisal.employeeId === user?._id}
        onBack={() => setSelectedAppraisal(null)}
        onSubmit={handleAppraisalUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="space-y-6">
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
              <div className="text-2xl font-bold">{appraisals.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Pending Action</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">Completed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">0</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">0</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card>
          <CardHeader>
            <CardTitle>Appraisals</CardTitle>
            <CardDescription>All appraisals in the system</CardDescription>
          </CardHeader>
          <CardContent>
            {appraisals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No appraisals found</p>
                {isTeamLead && (
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="mt-4"
                    variant="outline"
                  >
                    Create your first appraisal
                  </Button>
                )}
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
                    {appraisals.map((appraisal) => (
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

        {/* Create Appraisal Dialog */}
        <AppraisalTargetSelection
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
