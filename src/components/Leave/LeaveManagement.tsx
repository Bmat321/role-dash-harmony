/* eslint-disable @typescript-eslint/no-explicit-any */
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { LeaveBalance, LeaveRequest } from '@/types/leave';
import { Check, Info, Loader2, Plus, X } from 'lucide-react';
import React from 'react';
import { motion } from "framer-motion";
import { useCombinedContext } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { LeaveFormData, setDateCalculation,updateStatusOverview, setFormData, setIsDialogOpen, setRequests, setSelectedRequest, setRejectionNote, setCreateIsDialogOpen, resetLeaveState } from '@/store/slices/leave/leaveSlice';
import { calculateWorkingDays, getHolidaysInRange } from '@/utils/holidays';
import ApprovalSteps from './ApprovalSteps';


const  LeaveManagement: React.FC = () => {
const {user: userLeaveManagement, leave } = useCombinedContext();
  const { user} = userLeaveManagement
  const { user:currentUser} = useAppSelector((state) => state.auth); 
  console.log("currentUser", currentUser) 
  
  const {  handleCreateLeaveRequest, handleApproveLeaveRequest, handleRejectLeaveRequest } = leave
  const {
  isDialogOpen,
  selectedDates,
  formData,
  requests,
  dateCalculation,
  teamLead,
  isLoading,
  activityFeed,
  approvalQueue,
  error,
  statusOverview,
  selectedRequest,
  rejectionNote,
  createIsDialogOpen
} = useAppSelector(state => state.leave);
const dispatch = useAppDispatch();

  const canApproveLeave = user?.role === 'teamlead' ||  user?.role === 'admin' || user?.role === 'hr' || user?.role.toLowerCase() === 'md';
const calculateDays = (start: string, end: string) => {
  if (!start || !end) return null;

  const calculation = calculateWorkingDays(start, end);
  const holidays = getHolidaysInRange(start, end);

  return {
    totalDays: calculation.totalDays,
    workingDays: calculation.workingDays,
    holidays,
  };
};



  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFormData = { ...formData, [field]: value };
    dispatch(setFormData(newFormData));
    
    if (newFormData.startDate && newFormData.endDate) {
      const calculation = calculateDays(newFormData.startDate, newFormData.endDate);
      dispatch(setDateCalculation(calculation));
    } else {
      dispatch(setDateCalculation(null));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamleadId) {
      toast({
        title: "Team Lead Required",
        description: "Please select a team lead to review your leave request.",
        variant: "destructive"
      });
      return;
    }

    // const selectedTeamLead = teamLead.data.find(tl => tl.id === formData.teamLeadId);
    const calculation = calculateDays(formData.startDate, formData.endDate);
    
    if (!calculation) {
      toast({
        title: "Invalid Dates",
        description: "Please select valid start and end dates.",
        variant: "destructive"
      });
      return;
    }
    
  const requestPayload: LeaveFormData = {
    type: formData.type,
    startDate: formData.startDate,
    endDate: formData.endDate,
    days: calculation.workingDays,
    reason: formData.reason,
    teamleadId: formData.teamleadId,
  };


  const success = await handleCreateLeaveRequest(requestPayload);
    if (success) {
          dispatch(setCreateIsDialogOpen(false));
          dispatch(setFormData({
            type: 'annual',
            startDate: '',
            endDate: '',
            reason: '',
            teamleadId: '',
            days: 0,
          }));
          
          dispatch(setDateCalculation(null));

        }

  };

// const handleApproveReject =async (requestId: string, approved: boolean) => {
//   // if (!user) return;

//   // const updatedRequests: LeaveRequest[] = requests.map(request => {
//   //   if (request.id === requestId) {
//   //     return {
//   //       ...request,
//   //       status: approved ? 'approved' : 'rejected',
//   //       approvedBy: `${user.firstName} ${user.lastName}`,
//   //       approvedDate: new Date().toISOString().split('T')[0],
//   //       comments: approved ? 'Approved' : 'Rejected',
//   //     };
//   //   }
//   //   return request;
//   // });

//   // dispatch(setRequests(updatedRequests));

//    const success = approved
//     ? await handleApproveLeaveRequest(requestId)
//     : await handleRejectLeaveRequest(requestId);

// if (!success) return;

// dispatch(updateStatusOverview({ approved, rejected: !approved }));

 
// };

const handleApproveLeaveRequestFlow = async (requestId: string) => {
  const success = await handleApproveLeaveRequest(requestId);
};

const handleRejectLeaveRequestWithNote = async (id: string, note: string): Promise<boolean> => {
  return handleRejectLeaveRequest(id, note);
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

 const getLeaveTypeColor = (type?: LeaveRequest['type']) => {
  const colors: Record<string, string> = {
    annual: 'bg-blue-100 text-blue-800',
    sick: 'bg-red-100 text-red-800',
    compensation: 'bg-green-100 text-green-800',
    maternity: 'bg-purple-100 text-purple-800',
  };

  return colors[type ?? ''] || 'bg-gray-100 text-gray-800';
};

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Leave Management</h2>
          <p className="text-gray-600">Manage leave requests and balances</p>
        </div>
        <Dialog open={createIsDialogOpen} 
            onOpenChange={(open: boolean) => dispatch(setCreateIsDialogOpen(open))}
            >
          {/* <DialogTrigger asChild>
          </DialogTrigger> */}
            <Button onClick={() => dispatch(setCreateIsDialogOpen(true))}>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button>
            {/* <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Leave
            </Button> */}
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
                    <Select value={formData.type}
                      onValueChange={(value: LeaveRequest['type']) =>
                          dispatch(setFormData({ ...formData, type: value }))
                        }
                     >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="annual">Annual</SelectItem>
                        <SelectItem value="sick">Sick</SelectItem>
                        <SelectItem value="compensation">Compensation</SelectItem>
                        <SelectItem value="maternity">Maternity</SelectItem>
                        {/* <SelectItem value="emergency">Emergency</SelectItem> */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="teamLead">Team Lead</Label>
                    <Select value={formData.teamleadId} 
                                  onValueChange={(value) =>
                      dispatch(setFormData({ ...formData, teamleadId: value }))
                    }
                    >
                      <SelectTrigger>
                        <SelectValue
  placeholder={currentUser.role === 'employee' ? 'Select team lead' : 'Select reviewer'}
/>

                      </SelectTrigger>
                      <SelectContent>
                        {teamLead?.data?.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.name}
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
                      min={new Date().toISOString().split('T')[0]} // disables past dates
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
              <span className="ml-2 font-medium text-blue-600">
                {dateCalculation.workingDays}
              </span>
            </div>
          </div>
          {dateCalculation.holidays.length > 0 && (
            <div className="mt-3">
              <p className="text-sm font-medium text-gray-700 mb-2">Excluded Days (Public Holidays):</p>
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
                    onChange={(e) =>
                        dispatch(setFormData({ ...formData, reason: e.target.value }))
                      }
                    placeholder="Please provide a reason for your leave request"
                    required
                  />
                </div>
              </div>
             <DialogFooter className="mt-6">
<Button
  type="button"
  variant="outline"
  onClick={() => {
    dispatch(setCreateIsDialogOpen(false));
    dispatch(setFormData({
      type: 'sick',
      startDate: '',
      endDate: '',
      reason: '',
      teamleadId: '',
      days: 0,
    }));
    dispatch(setDateCalculation(null)); // if applicable
  }}
  disabled={isLoading}
>
  Cancel
</Button>


  <Button type="submit" disabled={isLoading}>
    {isLoading ? (
      <>
        Submitting
        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
      </>
    ) : (
      "Submit Request"
    )}
  </Button>
</DialogFooter>

            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="requests" className="space-y-8">
       <TabsList
  className={`grid w-full ${currentUser.role !== 'employee' ? 'grid-cols-3' : 'grid-cols-2'}`}
>
  <TabsTrigger value="requests">My Requests</TabsTrigger>
  <TabsTrigger value="status">Status</TabsTrigger>
  {currentUser.role !== 'employee' && (
    <TabsTrigger value="approval">Approval Queue</TabsTrigger>
  )}
</TabsList>


        {/* <TabsContent value="requests">
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
                  {activityFeed
                    .flat() 
                    .filter(req => !canApproveLeave || req.employeeId === user?.id)
                    .map((request) =>{
                      return (
               <TableRow key={request.id}
>
  <TableCell>
    <Badge className={getLeaveTypeColor(request.type)}>
      {typeof request.type === 'string'
        ? request.type.charAt(0).toUpperCase() + request.type.slice(1)
        : 'Unknown'}
    </Badge>
  </TableCell>

  <TableCell>
    <div className="text-sm">
      <div>{new Date(request.startDate).toLocaleDateString()}</div>
      <div className="text-gray-500">
        to {new Date(request.endDate).toLocaleDateString()}
      </div>
    </div>
  </TableCell>

  <TableCell>{request.days} day(s)</TableCell>
  <TableCell className="max-w-xs truncate">{request.reason || '-'}</TableCell>
  <TableCell>{getStatusBadge(request.status)}</TableCell>
  <TableCell>{new Date(request.appliedDate).toLocaleDateString()}</TableCell>
</TableRow>

                      )
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent> */}

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
 {activityFeed
  .flat()
  .map((request) => {
    const latestReview = request.reviewTrail?.[request.reviewTrail.length - 1];

    const rejectedReview = request.reviewTrail?.find(
      (r) => r.action === "rejected"
    );

    const mdApproved = request.reviewTrail?.find(
      (r) => r.role === "md" && r.action === "approved"
    );

    const finalStatus = rejectedReview
      ? "rejected"
      : mdApproved
      ? "approved"
      : "pending";

    const latestFinalReview = rejectedReview || mdApproved || latestReview;

    return (
      <TableRow key={request.id}>
        {/* Leave type */}
        <TableCell>
          <Badge className={getLeaveTypeColor(request.type)}>
            {typeof request.type === "string"
              ? request.type.charAt(0).toUpperCase() + request.type.slice(1)
              : "Unknown"}
          </Badge>
        </TableCell>

        {/* Dates */}
        <TableCell>
          <div className="text-sm">
            <div>{new Date(request.startDate).toLocaleDateString()}</div>
            <div className="text-gray-500">
              to {new Date(request.endDate).toLocaleDateString()}
            </div>
          </div>
        </TableCell>

        <TableCell>{request.days} day(s)</TableCell>

        <TableCell className="max-w-xs truncate">
          {request.reason || "-"}
        </TableCell>

        <TableCell>
          <motion.div
            key={finalStatus}
            initial={{ opacity: 0.6, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            {getStatusBadge(finalStatus as "approved" | "pending" | "rejected")}

<div className="text-xs text-muted-foreground mt-1 space-y-1">
  {latestFinalReview?.role && (
    <div>
      Last reviewed by <strong>{latestFinalReview.role}</strong>
    </div>
  )}
  {latestFinalReview?.date && (
    <div>
      on <strong>{new Date(latestFinalReview.date).toLocaleDateString()}</strong>
    </div>
  )}
  {latestFinalReview?.note && (
    <div className="italic text-gray-500 text-xs truncate max-w-[160px]">
      {/* “{latestFinalReview.note}” */}
    </div>
  )}
</div>


            <ApprovalSteps request={request} />
          </motion.div>
        </TableCell>

        {/* Applied date */}
        <TableCell>
          {new Date(request.appliedDate).toLocaleDateString()}
        </TableCell>
      </TableRow>
    );
  })}

</TableBody>

      </Table>
    </CardContent>
  </Card>
</TabsContent>

        {/* <TabsContent value="balance">
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
        </TabsContent> */}

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Leave Status Overview</CardTitle>
              <CardDescription>Track the status of all your leave requests</CardDescription>
            </CardHeader>
            <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['pending', 'approved', 'rejected'].map((status) => (
                <Card key={`status-card-${status}`}>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold mb-2">{statusOverview[status]}</div>
                    <div className="text-sm text-gray-600 capitalize">{status} Requests</div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>

          </Card>
        </TabsContent>

        {/* <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent leave activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {requests
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
        </TabsContent> */}

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
                    {approvalQueue.flat().map((request) => {
                      return (
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
                        {/* <TableCell>
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
                        </TableCell> */}
                        <TableCell>
  {request.status === 'pending' && (
    <div className="flex space-x-2">
  <Button
    size="sm"
    variant="outline"
    disabled={isLoading}
    onClick={() => handleApproveLeaveRequestFlow(request.id)}
  >
    {isLoading ? (
      <Loader2 className="h-4 w-4 animate-spin" />
    ) : (
      <Check className="h-4 w-4" />
    )}
  </Button>

  <Button
    size="sm"
    variant="outline"
    disabled={isLoading}
    style={{ border: '2px solid red' }}
    onClick={() => {
      dispatch(setSelectedRequest(request));
      dispatch(setIsDialogOpen(true));
    }}
  >
    {isLoading ? (
      <Loader2 className="h-4 w-4 animate-spin text-red-500" />
    ) : (
      <X className="h-4 w-4 text-red-500" />
    )}
  </Button>
</div>

  )}
                        </TableCell>

                      </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}
        <Dialog open={isDialogOpen}
          onOpenChange={(open) => dispatch(setIsDialogOpen(open))}
         >
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Reject Leave Request</DialogTitle>
      <DialogDescription>
        You are about to reject {selectedRequest?.employeeName}'s leave request. Please provide a reason.
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      <div>
        <Label htmlFor="rejectionNote">Reason for Rejection</Label>
        <Textarea
          id="rejectionNote"
          value={rejectionNote}
          onChange={(e) => dispatch(setRejectionNote(e.target.value))}
          placeholder="Provide feedback or reason for rejection..."
        />
      </div>
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={() => dispatch(setIsDialogOpen(false))}>
        Cancel
      </Button>
<Button
  variant="destructive"
  disabled={isLoading}
  onClick={async () => {
    if (selectedRequest) {
      const success = await handleRejectLeaveRequestWithNote(selectedRequest.id, rejectionNote);
      if (success) {
        dispatch(updateStatusOverview({ approved: false, rejected: true }));
        dispatch(resetLeaveState()); // ✅ Clear the leave slice state
        dispatch(setIsDialogOpen(false));
      }
    }
  }}
>
  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
  Reject Leave
</Button>

    </DialogFooter>
  </DialogContent>
        </Dialog>

      </Tabs>
    </div>
  );
};


export default LeaveManagement