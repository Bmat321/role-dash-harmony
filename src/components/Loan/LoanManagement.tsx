
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Check, X, DollarSign, AlertCircle, Info } from 'lucide-react';
import { LoanRequest, LoanBalance } from '@/types/loan';

import { toast } from '@/hooks/use-toast';
import { useCombinedContext } from '@/contexts/AuthContext';

// Mock team leads data
const mockTeamLeads = [
  { id: 'tl1', name: 'Sarah Johnson', department: 'IT', email: 'sarah.johnson@company.com' },
  { id: 'tl2', name: 'Michael Brown', department: 'HR', email: 'michael.brown@company.com' },
  { id: 'tl3', name: 'Emily Davis', department: 'Finance', email: 'emily.davis@company.com' },
  { id: 'tl4', name: 'David Wilson', department: 'Marketing', email: 'david.wilson@company.com' }
];

const mockLoanRequests: LoanRequest[] = [
  {
    id: '1',
    employeeId: '4',
    employeeName: 'Jane Doe',
    type: 'personal',
    amount: 500000,
    currency: 'NGN',
    reason: 'Medical emergency',
    repaymentPeriod: 12,
    monthlyDeduction: 45000,
    status: 'pending',
    appliedDate: '2024-01-27',
    teamLeadId: 'tl1',
    teamLeadName: 'Sarah Johnson'
  }
];

const mockLoanBalance: LoanBalance = {
  employeeId: '4',
  totalLoaned: 1000000,
  totalRepaid: 400000,
  outstandingBalance: 600000,
  monthlyDeduction: 50000,
  nextPaymentDate: '2024-02-28'
};

const LoanManagement: React.FC = () => {
         const {user: userLoanManagement,  profile } = useCombinedContext();
        const { user} = userLoanManagement
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>(mockLoanRequests);
  const [loanBalance] = useState<LoanBalance>(mockLoanBalance);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    type: 'personal' as LoanRequest['type'],
    amount: '',
    reason: '',
    repaymentPeriod: '',
    teamLeadId: ''
  });

  const canApproveLoan = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'md';

  const calculateMonthlyDeduction = (amount: number, period: number): number => {
    return Math.round(amount / period);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.teamLeadId) {
      toast({
        title: "Team Lead Required",
        description: "Please select a team lead to review your loan request.",
        variant: "destructive"
      });
      return;
    }

    const selectedTeamLead = mockTeamLeads.find(tl => tl.id === formData.teamLeadId);
    const amount = parseFloat(formData.amount);
    const period = parseInt(formData.repaymentPeriod);
    const monthlyDeduction = calculateMonthlyDeduction(amount, period);
    
    const newRequest: LoanRequest = {
      id: Date.now().toString(),
      employeeId: user?._id || '',
      employeeName: user ? `${user.firstName} ${user.lastName}` : '',
      type: formData.type,
      amount: amount,
      currency: 'NGN',
      reason: formData.reason,
      repaymentPeriod: period,
      monthlyDeduction: monthlyDeduction,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0],
      teamLeadId: formData.teamLeadId,
      teamLeadName: selectedTeamLead?.name || ''
    };

    setLoanRequests(prev => [newRequest, ...prev]);
    setIsDialogOpen(false);
    setFormData({ type: 'personal', amount: '', reason: '', repaymentPeriod: '', teamLeadId: '' });
    
    toast({
      title: "Loan Request Submitted",
      description: `Your loan request for ₦${amount.toLocaleString()} has been submitted to ${selectedTeamLead?.name}.`,
    });
  };

  const handleApproveReject = (requestId: string, approved: boolean) => {
    setLoanRequests(prev => prev.map(request => {
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
      title: `Loan Request ${approved ? 'Approved' : 'Rejected'}`,
      description: `The loan request has been ${approved ? 'approved' : 'rejected'}.`,
    });
  };

  const getStatusBadge = (status: LoanRequest['status']) => {
    const variants = {
      pending: 'outline',
      approved: 'default',
      rejected: 'destructive',
      disbursed: 'secondary',
      completed: 'default'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getLoanTypeColor = (type: LoanRequest['type']) => {
    const colors = {
      personal: 'bg-blue-100 text-blue-800',
      salary_advance: 'bg-green-100 text-green-800',
      emergency: 'bg-red-100 text-red-800',
      education: 'bg-purple-100 text-purple-800',
      medical: 'bg-orange-100 text-orange-800'
    };
    return colors[type];
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Loan Management</h2>
          <p className="text-gray-600">Manage loan requests and repayments</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Request Loan
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Request Loan</DialogTitle>
              <DialogDescription>
                Submit a new loan request for review by your team lead.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">Loan Type</Label>
                    <Select value={formData.type} onValueChange={(value: LoanRequest['type']) => setFormData(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="personal">Personal Loan</SelectItem>
                        <SelectItem value="salary_advance">Salary Advance</SelectItem>
                        <SelectItem value="emergency">Emergency Loan</SelectItem>
                        <SelectItem value="education">Education Loan</SelectItem>
                        <SelectItem value="medical">Medical Loan</SelectItem>
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
                    <Label htmlFor="amount">Loan Amount (₦)</Label>
                    <Input
                      id="amount"
                      type="number"
                      value={formData.amount}
                      onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                      placeholder="Enter amount"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="repaymentPeriod">Repayment Period (Months)</Label>
                    <Input
                      id="repaymentPeriod"
                      type="number"
                      value={formData.repaymentPeriod}
                      onChange={(e) => setFormData(prev => ({ ...prev, repaymentPeriod: e.target.value }))}
                      placeholder="Number of months"
                      required
                    />
                  </div>
                </div>

                {formData.amount && formData.repaymentPeriod && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                        <div className="space-y-2">
                          <h4 className="font-medium text-blue-900">Loan Calculation</h4>
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Loan Amount:</span>
                              <span className="ml-2 font-medium">₦{parseFloat(formData.amount).toLocaleString()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Monthly Deduction:</span>
                              <span className="ml-2 font-medium text-blue-600">₦{calculateMonthlyDeduction(parseFloat(formData.amount), parseInt(formData.repaymentPeriod)).toLocaleString()}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div>
                  <Label htmlFor="reason">Reason for Loan</Label>
                  <Textarea
                    id="reason"
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    placeholder="Please provide a reason for your loan request"
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
          <TabsTrigger value="balance">Loan Balance</TabsTrigger>
          <TabsTrigger value="status">Status</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          {canApproveLoan && <TabsTrigger value="approval">Approval Queue</TabsTrigger>}
        </TabsList>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>My Loan Requests</CardTitle>
              <CardDescription>View and track your loan requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Repayment Period</TableHead>
                    <TableHead>Monthly Deduction</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Applied Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loanRequests
                    .filter(req => !canApproveLoan || req.employeeId === user?._id)
                    .map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <Badge className={getLoanTypeColor(request.type)}>
                          {request.type.replace('_', ' ').charAt(0).toUpperCase() + request.type.replace('_', ' ').slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>₦{request.amount.toLocaleString()}</TableCell>
                      <TableCell>{request.repaymentPeriod} months</TableCell>
                      <TableCell>₦{request.monthlyDeduction.toLocaleString()}</TableCell>
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
          <Card>
            <CardHeader>
              <CardTitle>Loan Balance Overview</CardTitle>
              <CardDescription>Your current loan status and repayment information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Loaned</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-blue-600">
                      ₦{loanBalance.totalLoaned.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Total Repaid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">
                      ₦{loanBalance.totalRepaid.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Outstanding Balance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">
                      ₦{loanBalance.outstandingBalance.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Monthly Deduction</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-orange-600">
                      ₦{loanBalance.monthlyDeduction.toLocaleString()}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status">
          <Card>
            <CardHeader>
              <CardTitle>Loan Status Overview</CardTitle>
              <CardDescription>Track the status of all your loan requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {['pending', 'approved', 'rejected', 'disbursed', 'completed'].map((status) => {
                  const count = loanRequests.filter(req => req.status === status && (!canApproveLoan || req.employeeId === user?._id)).length;
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
              <CardDescription>Your recent loan activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanRequests
                  .filter(req => !canApproveLoan || req.employeeId === user?._id)
                  .slice(0, 5)
                  .map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-8 h-8 text-green-500" />
                      <div>
                        <div className="font-medium">{request.type.replace('_', ' ').charAt(0).toUpperCase() + request.type.replace('_', ' ').slice(1)}</div>
                        <div className="text-sm text-gray-500">
                          ₦{request.amount.toLocaleString()} - {new Date(request.appliedDate).toLocaleDateString()}
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

        {canApproveLoan && (
          <TabsContent value="approval">
            <Card>
              <CardHeader>
                <CardTitle>Loan Approval Queue</CardTitle>
                <CardDescription>Review and approve/reject loan requests</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Repayment Period</TableHead>
                      <TableHead>Reason</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loanRequests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.employeeName}</TableCell>
                        <TableCell>
                          <Badge className={getLoanTypeColor(request.type)}>
                            {request.type.replace('_', ' ').charAt(0).toUpperCase() + request.type.replace('_', ' ').slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>₦{request.amount.toLocaleString()}</TableCell>
                        <TableCell>{request.repaymentPeriod} months</TableCell>
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

export default LoanManagement;
