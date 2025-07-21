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
import { Plus, FileUp, Download, CheckCircle, XCircle, Clock, FileText, Calendar, User } from 'lucide-react';

import { toast } from '@/hooks/use-toast';
import { useCombinedContext } from '@/contexts/AuthContext';
import { useReduxHandover } from '@/hooks/handover/useReduxHandover';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { HandoverReport, setFormData, setIsDialogOpen, setIsRejectDialogOpen, setRejectionNote, setSelectedFile } from '@/store/slices/handover/handoverSlice';


// interface HandoverReport {
//   id: string;
//   employeeId: string;
//   employeeName: string;
//   date: string;
//   shift: 'day' | 'night';
//   // summary: string;
//   // achievements: string;
//   // challenges: string;
//   // nextDayPlan: string;
//   teamLeadId: string;
//   teamLeadName: string;
//   status: 'submitted' | 'reviewed' | 'approved' | 'pending' | 'rejected';
//   pdfFile?: File;
//   pdfFileName?: string;
//   submittedAt: string;
// }

// const mockTeamLeads = [
//   { id: 'tl1', name: 'Sarah Johnson', department: 'IT' },
//   { id: 'tl2', name: 'Michael Brown', department: 'HR' },
//   { id: 'tl3', name: 'Emily Davis', department: 'Finance' },
//   { id: 'tl4', name: 'David Wilson', department: 'Marketing' }
// ];

// const mockHandoverReports: HandoverReport[] = [
//   {
//     id: '1',
//     employeeId: '4',
//     employeeName: 'Jane Doe',
//     date: '2024-01-20',
//     shift: 'day',
//     // summary: 'Completed all assigned tasks for client projects',
//     // achievements: 'Successfully delivered Project Alpha milestone',
//     // challenges: 'Minor delay in API integration',
//     // nextDayPlan: 'Continue with Project Beta development',
//     teamLeadId: 'tl1',
//     teamLeadName: 'Sarah Johnson',
//     status: 'approved',
//     pdfFileName: 'handover_20240120.pdf',
//     submittedAt: '2024-01-20T17:30:00Z'
//   },
//   {
//     id: '2',
//     employeeId: '5',
//     employeeName: 'John Smith',
//     date: '2024-01-21',
//     shift: 'night',
//     // summary: 'Monitored system performance and handled client queries',
//     // achievements: 'Resolved 15 customer support tickets',
//     // challenges: 'Server maintenance window caused brief downtime',
//     // nextDayPlan: 'Follow up on pending support tickets',
//     teamLeadId: 'tl2',
//     teamLeadName: 'Michael Brown',
//     status: 'pending',
//     pdfFileName: 'handover_20240121_night.pdf',
//     submittedAt: '2024-01-21T04:00:00Z'
//   }
// ];

const HandoverManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user: userHandoverManagement, profile } = useCombinedContext();
  const { user } = userHandoverManagement;
  const { reports, isLoading, error, selectedReport, ui } = useAppSelector(
      (state) => state.handover
    );
    
  // const [handoverReports, setHandoverReports] = useState<HandoverReport[]>(mockHandoverReports);
  // const [isDialogOpen, setIsDialogOpen] = useState(false);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [rejectionNote, setRejectionNote] = useState('');
  // const [selectedHandover, setSelectedHandover] = useState<HandoverReport | null>(null);
  // const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  // const [formData, setFormData] = useState({
  //   date: new Date().toISOString().split('T')[0],
  //   shift: 'day' as 'day' | 'night',
  //   summary: '',
  //   achievements: '',
  //   challenges: '',
  //   nextDayPlan: '',
  //   teamLeadId: ''
  // });
  const {createHandover, approveHandover, rejectHandover} = useReduxHandover()
  const canReviewHandovers = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'md' || user?.role === 'teamlead';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid File Type",
          description: "Please upload a PDF file only.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File Too Large",
          description: "Please upload a PDF file smaller than 5MB.",
          variant: "destructive"
        });
        return;
      }
      setSelectedFile(file);
    }
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!ui.formData.teamLeadId) {
    toast({
      title: "Team Lead Required",
      description: "Please select a team lead to review your handover report.",
      variant: "destructive"
    });
    return;
  }

  if (!ui.selectedFile) {
    toast({
      title: "PDF File Required",
      description: "Please upload a PDF handover report.",
      variant: "destructive"
    });
    return;
  }

  const form = new FormData();
  form.append("user", user?._id || "");
  form.append("teamLead", ui.formData.teamLeadId);
  form.append("date", ui.formData.date);
  form.append("shift", ui.formData.shift === "day" ? "Day" : "Night");
  form.append("summary", ui.formData.summary);
  form.append("pdfFile", ui.selectedFile); // file input
  form.append("status", "Pending"); // default status

  const success = await createHandover(form);

  if (success) {
    dispatch(setIsDialogOpen(false));
    dispatch(setFormData({
      date: new Date().toISOString().split("T")[0],
      shift: "day",
      summary: "",
      achievements: "",
      challenges: "",
      nextDayPlan: "",
      teamLeadId: ""
    }));
    dispatch(setSelectedFile(null));
  }
};



const handleApprove = async (handoverId: string) => {
  const handover = reports.find((h) => h._id === handoverId);

  const success = await approveHandover(handoverId);

  if (success) {
    toast({
      title: "Handover Approved",
      description: `${handover?.user}'s handover report has been approved.`,
    });
  }
};

const handleReject = async (handoverId: string, note?: string) => {
  const handover = reports.find((h) => h._id === handoverId);

  const success = await rejectHandover(handoverId); // Assuming note is not yet used

  if (success) {
    toast({
      title: "Handover Rejected",
      description: `${handover?.user}'s handover report has been rejected.`,
      variant: "destructive",
    });

    dispatch(setIsRejectDialogOpen(false));
    dispatch(setRejectionNote(''));
  }
};

  const openRejectDialog = (handover: HandoverReport) => {
    // setSelectedHandover(handover);
    setIsRejectDialogOpen(true);
  };

  const handleStatusChange = (reportId: string, newStatus: HandoverReport['status']) => {
    setHandoverReports(prev => prev.map(report => 
      report.id === reportId 
        ? { ...report, status: newStatus }
        : report
    ));

    toast({
      title: "Status Updated",
      description: `Handover report status changed to ${newStatus}.`,
    });
  };

  const getStatusBadge = (status: HandoverReport['status']) => {
    const variants = {
      submitted: { variant: 'outline' as const, color: 'text-yellow-700 border-yellow-300', icon: Clock },
      reviewed: { variant: 'secondary' as const, color: 'text-blue-700 border-blue-300', icon: FileText },
      approved: { variant: 'default' as const, color: 'text-green-700 border-green-300', icon: CheckCircle },
      pending: { variant: 'outline' as const, color: 'text-yellow-700 border-yellow-300', icon: Clock },
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

  const downloadPDF = (report: HandoverReport) => {
    toast({
      title: "Download Started",
      description: `Downloading ${report.pdfFile}`,
    });
  };

  const pendingCount = reports.filter(h => h.status === 'pending' || h.status === 'submitted').length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Handover Management</h2>
          <p className="text-gray-600">Submit and manage daily handover reports</p>
        </div>
        <div className="flex items-center gap-4">
          {canReviewHandovers && (
            <Badge variant="outline" className="text-lg px-3 py-1">
              {pendingCount} Pending Approval
            </Badge>
          )}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Submit Handover
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Submit Daily Handover Report</DialogTitle>
                <DialogDescription>
                  Upload your daily handover report in PDF format along with a summary
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="date">Date</Label>
                      <Input
                        id="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="shift">Shift</Label>
                      <Select value={formData.shift} onValueChange={(value: 'day' | 'night') => setFormData(prev => ({ ...prev, shift: value }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="day">Day Shift (8:30 AM - 5:00 PM)</SelectItem>
                          <SelectItem value="night">Night Shift (8:00 PM - 4:00 AM)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
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

                  <div>
                    <Label htmlFor="pdfFile">Upload PDF Report</Label>
                    <div className="mt-2">
                      <Input
                        id="pdfFile"
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="cursor-pointer"
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Upload PDF file (max 5MB)
                      </p>
                      {selectedFile && (
                        <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded flex items-center gap-2">
                          <FileUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm text-green-700">{selectedFile.name}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* <div>
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                      placeholder="Brief summary of the day's work"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="achievements">Key Achievements</Label>
                    <Textarea
                      id="achievements"
                      value={formData.achievements}
                      onChange={(e) => setFormData(prev => ({ ...prev, achievements: e.target.value }))}
                      placeholder="What did you accomplish today?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="challenges">Challenges Faced</Label>
                    <Textarea
                      id="challenges"
                      value={formData.challenges}
                      onChange={(e) => setFormData(prev => ({ ...prev, challenges: e.target.value }))}
                      placeholder="Any challenges or issues encountered"
                    />
                  </div> 

                  <div>
                    <Label htmlFor="nextDayPlan">Next Day Plan</Label>
                    <Textarea
                      id="nextDayPlan"
                      value={formData.nextDayPlan}
                      onChange={(e) => setFormData(prev => ({ ...prev, nextDayPlan: e.target.value }))}
                      placeholder="Plans and priorities for tomorrow"
                    />
                  </div> */}
                </div>
                <DialogFooter className="mt-6">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Report</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="my-reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-reports">My Reports</TabsTrigger>
          {canReviewHandovers && <TabsTrigger value="approval-queue">Approval Queue</TabsTrigger>}
          {canReviewHandovers && <TabsTrigger value="team-reports">All Reports</TabsTrigger>}
        </TabsList>

        <TabsContent value="my-reports">
          <Card>
            <CardHeader>
              <CardTitle>My Handover Reports</CardTitle>
              <CardDescription>View and track your submitted handover reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Shift</TableHead>
                    <TableHead>Team Lead</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PDF File</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {handoverReports
                    .filter(report => !canReviewHandovers || report.employeeId === user?._id)
                    .map((report) => (
                    <TableRow key={report.id}>
                      <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={report.shift === 'day' ? 'text-orange-700' : 'text-blue-700'}>
                          {report.shift === 'day' ? 'Day' : 'Night'}
                        </Badge>
                      </TableCell>
                      <TableCell>{report.teamLeadName}</TableCell>
                      <TableCell>{getStatusBadge(report.status)}</TableCell>
                      <TableCell>
                        {report.pdfFileName && (
                          <div className="flex items-center gap-2">
                            <FileUp className="h-4 w-4 text-gray-500" />
                            <span className="text-sm">{report.pdfFileName}</span>
                          </div>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {report.pdfFileName && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => downloadPDF(report)}
                            >
                              <Download className="h-4 w-4" />
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

        {canReviewHandovers && (
          <TabsContent value="approval-queue">
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
                    {handoverReports
                      .filter(report => report.status === 'pending' || report.status === 'submitted')
                      .map((report) => (
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
                        {/* <TableCell>
                          <div className="max-w-xs truncate" title={report.summary}>
                            {report.summary}
                          </div>
                        </TableCell> */}
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
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
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        {canReviewHandovers && (
          <TabsContent value="team-reports">
            <Card>
              <CardHeader>
                <CardTitle>All Handover Reports</CardTitle>
                <CardDescription>View all team handover reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Shift</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>PDF File</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {handoverReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.employeeName}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={report.shift === 'day' ? 'text-orange-700' : 'text-blue-700'}>
                            {report.shift === 'day' ? 'Day' : 'Night'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {report.pdfFileName && (
                            <div className="flex items-center gap-2">
                              <FileUp className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{report.pdfFileName}</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {report.pdfFileName && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => downloadPDF(report)}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                            {(report.status === 'submitted' || report.status === 'pending') && (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleStatusChange(report.id, 'reviewed')}
                                >
                                  Review
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleStatusChange(report.id, 'approved')}
                                >
                                  Approve
                                </Button>
                              </>
                            )}
                            {report.status === 'reviewed' && (
                              <Button
                                size="sm"
                                onClick={() => handleStatusChange(report.id, 'approved')}
                              >
                                Approve
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
        )}
      </Tabs>

      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
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
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>
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

export default HandoverManagement;
