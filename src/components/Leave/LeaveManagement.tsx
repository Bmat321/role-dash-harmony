
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  FileText,
  User
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const LeaveManagement = () => {
  const { user } = useAuth();
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [rejectionNote, setRejectionNote] = useState('');
  const [showRejectionDialog, setShowRejectionDialog] = useState(false);

  // Mock data for leave requests
  const leaveRequests = [
    {
      id: 1,
      employeeName: 'John Doe',
      employeeId: 'EMP001',
      type: 'Annual Leave',
      startDate: '2024-01-15',
      endDate: '2024-01-19',
      days: 5,
      reason: 'Family vacation to Europe',
      status: 'pending',
      appliedDate: '2024-01-01',
      department: 'Engineering'
    },
    {
      id: 2,
      employeeName: 'Jane Smith',
      employeeId: 'EMP002',
      type: 'Sick Leave',
      startDate: '2024-01-10',
      endDate: '2024-01-12',
      days: 3,
      reason: 'Medical appointment and recovery',
      status: 'approved',
      appliedDate: '2024-01-08',
      department: 'Marketing'
    },
    {
      id: 3,
      employeeName: 'Mike Johnson',
      employeeId: 'EMP003',
      type: 'Personal Leave',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      reason: 'Personal matters',
      status: 'rejected',
      appliedDate: '2024-01-05',
      department: 'Sales',
      rejectionReason: 'Insufficient leave balance'
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100"><CheckCircle className="w-3 h-3 mr-1" />Approved</Badge>;
      case 'rejected':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100"><XCircle className="w-3 h-3 mr-1" />Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const handleApprove = (leaveId) => {
    console.log('Approving leave request:', leaveId);
    // Implementation for approving leave
  };

  const handleReject = (leave) => {
    setSelectedLeave(leave);
    setShowRejectionDialog(true);
  };

  const confirmReject = () => {
    console.log('Rejecting leave request:', selectedLeave.id, 'Note:', rejectionNote);
    // Implementation for rejecting leave with note
    setShowRejectionDialog(false);
    setSelectedLeave(null);
    setRejectionNote('');
  };

  // Employee view - their own leave requests
  const employeeLeaves = leaveRequests.filter(leave => leave.employeeId === user?.employeeId);

  // Manager/HR view - team or all leave requests
  const managementLeaves = user?.role === 'admin' || user?.role === 'hr' 
    ? leaveRequests 
    : leaveRequests.filter(leave => leave.department === user?.department);

  const renderLeaveCard = (leave, showActions = false) => (
    <Card key={leave.id} className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">{leave.employeeName}</CardTitle>
              <CardDescription>{leave.employeeId} • {leave.department}</CardDescription>
            </div>
          </div>
          {getStatusBadge(leave.status)}
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <Label className="text-sm font-medium text-gray-500">Leave Type</Label>
            <p className="font-medium">{leave.type}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Duration</Label>
            <p className="font-medium">{leave.days} days</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">Start Date</Label>
            <p className="font-medium">{new Date(leave.startDate).toLocaleDateString()}</p>
          </div>
          <div>
            <Label className="text-sm font-medium text-gray-500">End Date</Label>
            <p className="font-medium">{new Date(leave.endDate).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mb-4">
          <Label className="text-sm font-medium text-gray-500">Reason</Label>
          <p className="text-sm text-gray-700 mt-1">{leave.reason}</p>
        </div>

        {leave.rejectionReason && leave.status === 'rejected' && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
            <Label className="text-sm font-medium text-red-700">Rejection Reason</Label>
            <p className="text-sm text-red-600 mt-1">{leave.rejectionReason}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 mb-4">
          Applied on: {new Date(leave.appliedDate).toLocaleDateString()}
        </div>

        {showActions && leave.status === 'pending' && (
          <div className="flex gap-2">
            <Button 
              onClick={() => handleApprove(leave.id)}
              className="bg-green-600 hover:bg-green-700 text-white"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approve
            </Button>
            <Button 
              onClick={() => handleReject(leave)}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
              size="sm"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Reject
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderLeaveApplicationForm = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Plus className="w-5 h-5 mr-2" />
          Apply for Leave
        </CardTitle>
        <CardDescription>Submit a new leave request</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="maternity">Maternity Leave</SelectItem>
                <SelectItem value="paternity">Paternity Leave</SelectItem>
                <SelectItem value="emergency">Emergency Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="duration">Duration (days)</Label>
            <Input id="duration" type="number" placeholder="Number of days" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="startDate">Start Date</Label>
            <Input id="startDate" type="date" />
          </div>
          <div>
            <Label htmlFor="endDate">End Date</Label>
            <Input id="endDate" type="date" />
          </div>
        </div>
        
        <div>
          <Label htmlFor="reason">Reason for Leave</Label>
          <Textarea 
            id="reason" 
            placeholder="Please provide a reason for your leave request..." 
            className="min-h-[100px]"
          />
        </div>
        
        <Button className="w-full">
          <FileText className="w-4 h-4 mr-2" />
          Submit Leave Request
        </Button>
      </CardContent>
    </Card>
  );

  const renderLeaveBalance = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-blue-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Annual Leave</p>
              <p className="text-2xl font-bold text-blue-600">15 days</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-green-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Sick Leave</p>
              <p className="text-2xl font-bold text-green-600">10 days</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm font-medium text-gray-500">Personal Leave</p>
              <p className="text-2xl font-bold text-orange-600">5 days</p>
              <p className="text-xs text-gray-500">Available</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-600 mt-2">Manage leave requests and balances</p>
      </div>

      {(user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager') ? (
        <Tabs defaultValue="approval" className="space-y-6">
          <TabsList>
            <TabsTrigger value="approval">Leave Approval Queue</TabsTrigger>
            <TabsTrigger value="overview">Leave Overview</TabsTrigger>
          </TabsList>
          
          <TabsContent value="approval" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Pending Leave Requests</CardTitle>
                <CardDescription>Review and approve leave requests from your team</CardDescription>
              </CardHeader>
              <CardContent>
                {managementLeaves.filter(leave => leave.status === 'pending').length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">All caught up!</h3>
                    <p className="text-gray-500">No pending leave requests to review.</p>
                  </div>
                ) : (
                  managementLeaves
                    .filter(leave => leave.status === 'pending')
                    .map(leave => renderLeaveCard(leave, true))
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="overview" className="space-y-4">
            {managementLeaves.map(leave => renderLeaveCard(leave))}
          </TabsContent>
        </Tabs>
      ) : (
        <Tabs defaultValue="balance" className="space-y-6">
          <TabsList>
            <TabsTrigger value="balance">Leave Balance</TabsTrigger>
            <TabsTrigger value="apply">Apply for Leave</TabsTrigger>
            <TabsTrigger value="history">Leave History</TabsTrigger>
          </TabsList>
          
          <TabsContent value="balance" className="space-y-4">
            {renderLeaveBalance()}
          </TabsContent>
          
          <TabsContent value="apply" className="space-y-4">
            {renderLeaveApplicationForm()}
          </TabsContent>
          
          <TabsContent value="history" className="space-y-4">
            {employeeLeaves.map(leave => renderLeaveCard(leave))}
          </TabsContent>
        </Tabs>
      )}

      {/* Rejection Dialog */}
      <Dialog open={showRejectionDialog} onOpenChange={setShowRejectionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Leave Request</DialogTitle>
            <DialogDescription>
              You are about to reject the leave request from {selectedLeave?.employeeName}. 
              Please provide a reason (optional).
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="rejectionNote">Rejection Note (Optional)</Label>
            <Textarea
              id="rejectionNote"
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              placeholder="Provide a reason for rejection..."
              className="mt-2"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectionDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmReject}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Reject Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeaveManagement;
