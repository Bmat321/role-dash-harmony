
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle, XCircle, Clock, FileText, Calendar, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface HandoverReport {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  shift: 'day' | 'night';
  summary: string;
  achievements: string;
  challenges: string;
  nextDayPlan: string;
  teamLeadName: string;
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
  pdfFileName?: string;
}

const mockPendingHandovers: HandoverReport[] = [
  {
    id: '1',
    employeeId: '4',
    employeeName: 'Jane Doe',
    date: '2024-01-20',
    shift: 'day',
    summary: 'Completed all assigned tasks for client projects',
    achievements: 'Successfully delivered Project Alpha milestone',
    challenges: 'Minor delay in API integration',
    nextDayPlan: 'Continue with Project Beta development',
    teamLeadName: 'Sarah Johnson',
    status: 'pending',
    submittedAt: '2024-01-20T17:30:00Z',
    pdfFileName: 'handover_20240120.pdf'
  },
  {
    id: '2',
    employeeId: '5',
    employeeName: 'John Smith',
    date: '2024-01-21',
    shift: 'night',
    summary: 'Monitored system performance and handled client queries',
    achievements: 'Resolved 15 customer support tickets',
    challenges: 'Server maintenance window caused brief downtime',
    nextDayPlan: 'Follow up on pending support tickets',
    teamLeadName: 'Michael Brown',
    status: 'pending',
    submittedAt: '2024-01-21T04:00:00Z',
    pdfFileName: 'handover_20240121_night.pdf'
  }
];

const HandoverApprovalQueue: React.FC = () => {
  const [handoverReports, setHandoverReports] = useState<HandoverReport[]>(mockPendingHandovers);
  const [selectedHandover, setSelectedHandover] = useState<HandoverReport | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  const handleApprove = (handoverId: string) => {
    setHandoverReports(prev => prev.map(report => 
      report.id === handoverId 
        ? { ...report, status: 'approved' as const }
        : report
    ));

    const handover = handoverReports.find(h => h.id === handoverId);
    toast({
      title: "Handover Approved",
      description: `${handover?.employeeName}'s handover report has been approved.`,
    });
  };

  const handleReject = (handoverId: string, note?: string) => {
    setHandoverReports(prev => prev.map(report => 
      report.id === handoverId 
        ? { ...report, status: 'rejected' as const }
        : report
    ));

    const handover = handoverReports.find(h => h.id === handoverId);
    toast({
      title: "Handover Rejected",
      description: `${handover?.employeeName}'s handover report has been rejected.`,
      variant: "destructive"
    });
    
    setIsDialogOpen(false);
    setSelectedHandover(null);
    setRejectionNote('');
  };

  const openRejectDialog = (handover: HandoverReport) => {
    setSelectedHandover(handover);
    setIsDialogOpen(true);
  };

  const getStatusBadge = (status: HandoverReport['status']) => {
    const variants = {
      pending: { variant: 'outline' as const, color: 'text-yellow-700 border-yellow-300', icon: Clock },
      approved: { variant: 'default' as const, color: 'text-green-700 border-green-300', icon: CheckCircle },
      rejected: { variant: 'destructive' as const, color: 'text-red-700 border-red-300', icon: XCircle }
    };

    const config = variants[status];
    const Icon = config.icon;

    return (
      <Badge variant={config.variant} className={config.color}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const pendingCount = handoverReports.filter(h => h.status === 'pending').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Handover Approval Queue</h2>
          <p className="text-gray-600">Review and approve employee handover reports</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {pendingCount} Pending
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Pending Handover Reports
          </CardTitle>
          <CardDescription>Review handover reports submitted by team members</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Employee</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {handoverReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{report.employeeName}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      {new Date(report.date).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={report.shift === 'day' ? 'text-orange-700' : 'text-blue-700'}>
                      {report.shift === 'day' ? 'Day' : 'Night'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="max-w-xs truncate" title={report.summary}>
                      {report.summary}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(report.status)}</TableCell>
                  <TableCell>
                    {report.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleApprove(report.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => openRejectDialog(report)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
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

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Handover Report</DialogTitle>
            <DialogDescription>
              You are about to reject {selectedHandover?.employeeName}'s handover report. 
              You can optionally provide a reason for rejection.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejectionNote">Reason for Rejection (Optional)</Label>
              <Textarea
                id="rejectionNote"
                value={rejectionNote}
                onChange={(e) => setRejectionNote(e.target.value)}
                placeholder="Provide feedback or reason for rejection..."
                className="mt-2"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedHandover && handleReject(selectedHandover.id, rejectionNote)}
            >
              Reject Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default HandoverApprovalQueue;
