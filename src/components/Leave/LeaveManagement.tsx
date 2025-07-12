/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Calendar as CalendarIcon, Check, X, Clock, AlertCircle, Info } from 'lucide-react';
import { LeaveRequest, LeaveBalance } from '@/types/leave';

import { toast } from '@/hooks/use-toast';
import { calculateWorkingDays, getHolidaysInRange } from '@/utils/holidays';
import { useCombinedContext } from '@/contexts/AuthContext';

// Mock team leads data
const mockTeamLeads = [
  { id: 'tl1', name: 'Sarah Johnson', department: 'IT', email: 'sarah.johnson@company.com' },
  { id: 'tl2', name: 'Michael Brown', department: 'HR', email: 'michael.brown@company.com' },
  { id: 'tl3', name: 'Emily Davis', department: 'Finance', email: 'emily.davis@company.com' },
  { id: 'tl4', name: 'David Wilson', department: 'Marketing', email: 'david.wilson@company.com' }
];

const mockLeaveRequests: LeaveRequest[] = [
  {
    id: '1',
    employeeId: '4',
    employeeName: 'Jane Doe',
    type: 'vacation',
    startDate: '2024-02-15',
    endDate: '2024-02-19',
    days: 5,
    reason: 'Family vacation',
    status: 'pending',
    appliedDate: '2024-01-27'
  },
  {
    id: '2',
    employeeId: '4',
    employeeName: 'Jane Doe',
    type: 'sick',
    startDate: '2024-01-20',
    endDate: '2024-01-20',
    days: 1,
    reason: 'Doctor appointment',
    status: 'approved',
    appliedDate: '2024-01-19',
    approvedBy: 'Sarah Johnson',
    approvedDate: '2024-01-19'
  }
];

const mockLeaveBalance: LeaveBalance = {
  employeeId: '4',
  vacation: { total: 20, used: 5, remaining: 15 },
  sick: { total: 10, used: 1, remaining: 9 },
  personal: { total: 5, used: 0, remaining: 5 },
  maternity: { total: 90, used: 0, remaining: 90 }
};

const LeaveManagement: React.FC = () => {
const {user: userLeaveManagement,  profile } = useCombinedContext();
  const { user} = userLeaveManagement
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  const [leaveBalance] = useState<LeaveBalance>(mockLeaveBalance);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [formData, setFormData] = useState({
    type: 'vacation' as LeaveRequest['type'],
    startDate: '',
    endDate: '',
    reason: '',
    teamLeadId: ''
  });
  const [dateCalculation, setDateCalculation] = useState<{
    totalDays: number;
    workingDays: number;
    holidays: any[];
  } | null>(null);

  const canApproveLeave = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'manager';

  const calculateDays = (start: string, end: string) => {
    if (!start || !end) return null;
    
    const calculation = calculateWorkingDays(start, end);
    const holidays = getHolidaysInRange(start, end);
    
    return {
      totalDays: calculation.totalDays,
      workingDays: calculation.workingDays,
      holidays
    };
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    if (newFormData.startDate && newFormData.endDate) {
      const calculation = calculateDays(newFormData.startDate, newFormData.endDate);
      setDateCalculation(calculation);
    } else {
      setDateCalculation(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamLeadId) {
      toast({
        title: "Team Lead Required",
        description: "Please select a team lead to review your leave request.",
        variant: "destructive"
      });
      return;
    }

    const selectedTeamLead = mockTeamLeads.find(tl => tl.id === formData.teamLeadId);
    const calculation = calculateDays(formData.startDate, formData.endDate);
    
    if (!calculation) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid start and end dates.",
        variant: "destructive"
      });
      return;
    }
    
    const newRequest: LeaveRequest = {
      id: Date.now().toString(),
      employeeId: user?.id || '',
      employeeName: user ? `${user.firstName} ${user.lastName}` : '',
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      days: calculation.workingDays,
      reason: formData.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      teamLeadId: formData.teamLeadId,
      teamLeadName: selectedTeamLead?.name || ''
    };

    setLeaveRequests(prev => [newRequest, ...prev]);
    setIsDialogOpen(false);
    setFormData({ type: 'vacation', startDate: '', endDate: '', reason: '', teamLeadId: '' });
    setDateCalculation(null);
    
    toast({
      title: "Leave Request Submitted",
      description: `Your ${formData.type} request for ${calculation.workingDays} working day(s) has been submitted to ${selectedTeamLead?.name}.`,
    });
  };

  const handleApproveReject = (requestId: string, approved: boolean) => {
    setLeaveRequests(prev => prev.map(request => {
      if (request.id === requestId) {
        return {
          ...request,
          status: approved ? 'approved' : 'rejected',
          approvedBy: user ? `${user.firstName} ${user.lastName}` : '',
          approvedDate: new Date().toISOString().split('T')[0],
          comments: approved ? 'Approved' : 'Rejected'
        };
      }
      return request;
    }));

    toast({
      title: `Leave Request ${approved ? 'Approved' : 'Rejected'}`,
      description: `The leave request has been ${approved ? 'approved' : 'rejected'}.`,
    });
  };

  const getStatusBadge = (status: LeaveRequest['status']) => {
    const variants = {
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLeaveTypeColor = (type: LeaveRequest['type']) => {
    const colors = {
      vacation: 'bg-blue-100 text-blue-800',
      sick: 'bg-red-100 text-red-800',
      personal: 'bg-green-100 text-green-800',
      maternity: 'bg-purple-100 text-purple-800',
      emergency: 'bg-orange-100 text-orange-800'
    };
    return colors[type];
  };

  // Calendar data for leave visualization
  const leaveCalendarData = leaveRequests
    .filter(req => req.status === 'approved')
    .flatMap(req => {
      const dates = [];
      const start = new Date(req.startDate);
      const end = new Date(req.endDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d));
      }
      return dates;
    });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-gray-600">Manage leave requests and balances</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Leave</DialogTitle>
              <DialogDescription>
                Submit a new leave request. Working days will be calculated excluding weekends and Nigerian public holidays.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Leave Type</Label>
                    <Select value={formData.type} onValueChange={(value: LeaveRequest['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vacation">Vacation</SelectItem>
                        <SelectItem value="sick">Sick Leave</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="maternity">Maternity</SelectItem>
                        <SelectItem value="emergency">Emergency</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="teamLead">Team Lead</Label>
                    <Select value={formData.teamLeadId} onValueChange={(value) => setFormData(prev => ({ ...prev, teamLeadId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select team lead" />
                      </SelectTrigger>
                      <SelectContent>
                        {mockTeamLeads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.name} - {lead.department}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleDateChange('startDate', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleDateChange('endDate', e.target.value)}
                      min={formData.startDate}
                      required
                    />
                  </div>
                </div>

                {dateCalculation && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-900">Leave Duration Calculation</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Total Days:</span>
                              <span className="ml-2 font-medium">{dateCalculation.totalDays}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Working Days:</span>
                              <span className="ml-2 font-medium text-blue-600">{dateCalculation.workingDays}</span>
                            </div>
                          </div>
                          {dateCalculation.holidays.length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-medium text-gray-700 mb-2">Excluded Days:</p>
                              <div className="flex flex-wrap gap-1">
                                {dateCalculation.holidays.map((holiday, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {holiday.name}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Label htmlFor="reason">Reason</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Please provide a reason for your leave request"
                    required
                  />
                </div>
              </div>
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Request</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="requests" className="space-y-6">
        <TabsList>
          <TabsTrigger value="requests">My Requests</TabsTrigger>
          <TabsTrigger value="balance">Leave Balance</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          {canApproveLeave && <TabsTrigger value="approval">Approval Queue</TabsTrigger>}
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>My Leave Requests</CardTitle>
              <CardDescription>View and track your leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests
                    .filter(req => !canApproveLeave || req.employeeId === user?.id)
                    .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge className={getLeaveTypeColor(request.type)}>
                          {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div>{new Date(request.startDate).toLocaleDateString()}</div>
                          <div className="text-gray-500">to {new Date(request.endDate).toLocaleDateString()}</div>
                        </div>
                      </TableCell>
                      <TableCell>{request.days} day(s)</TableCell>
                      <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                      <TableCell>{getStatusBadge(request.status)}</TableCell>
                      <TableCell>{new Date(request.appliedDate).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="balance">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(leaveBalance).filter(([key]) => key !== 'employeeId').map(([type, balance]) => (
              <Card key={type}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg capitalize">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Total:</span>
                      <span className="font-medium">{balance.total} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Used:</span>
                      <span className="font-medium text-red-600">{balance.used} days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Remaining:</span>
                      <span className="font-medium text-green-600">{balance.remaining} days</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(balance.used / balance.total) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Leave Status Overview</CardTitle>
              <CardDescription>Track the status of all your leave requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['pending', 'approved', 'rejected'].map((status) => {
                  const count = leaveRequests.filter(req => req.status === status && (!canApproveLeave || req.employeeId === user?.id)).length;
                  return (
                    <Card key={status}>
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl font-bold mb-2">{count}</div>
                        <div className="text-sm text-gray-600 capitalize">{status} Requests</div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent leave activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests
                  .filter(req => !canApproveLeave || req.employeeId === user?.id)
                  .slice(0, 5)
                  .map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        request.status === 'approved' ? 'bg-green-500' :
                        request.status === 'rejected' ? 'bg-red-500' : 'bg-yellow-500'
                      }`} />
                      <div>
                        <div className="font-medium">{request.type.charAt(0).toUpperCase() + request.type.slice(1)}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(request.appliedDate).toLocaleDateString()} - {request.days} working days
                        </div>
                      </div>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {canApproveLeave && (
          <TabsContent value="approval">
            <Card>
              <CardHeader>
                <CardTitle>Leave Approval Queue</CardTitle>
                <CardDescription>Review and approve/reject leave requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.employeeName}</TableCell>
                        <TableCell>
                          <Badge className={getLeaveTypeColor(request.type)}>
                            {request.type.charAt(0).toUpperCase() + request.type.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{new Date(request.startDate).toLocaleDateString()}</div>
                            <div className="text-gray-500">to {new Date(request.endDate).toLocaleDateString()}</div>
                          </div>
                        </TableCell>
                        <TableCell>{request.days} day(s)</TableCell>
                        <TableCell className="max-w-xs truncate">{request.reason}</TableCell>
                        <TableCell>{getStatusBadge(request.status)}</TableCell>
                        <TableCell>
                          {request.status === 'pending' && (
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReject(request.id, true)}
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleApproveReject(request.id, false)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
};

export default LeaveManagement;
