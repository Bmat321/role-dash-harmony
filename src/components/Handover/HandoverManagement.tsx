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
import { Plus, FileUp, Download, CheckCircle, XCircle, Clock, FileText, Calendar, User, Loader2, Trash, Trash2 } from 'lucide-react';

import { toast } from '@/hooks/use-toast';
import { useCombinedContext } from '@/contexts/AuthContext';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addReport, HandoverReport, resetFormData, setFormData, setIsDeleteDialogOpen, setIsDialogOpen, setIsRejectDialogOpen, setRejectionNote, setSelectedDeleteId, setSelectedReport, updateReportStatus } from '@/store/slices/handover/handoverSlice';
import { useReduxHandover } from '@/hooks/handover/useReduxHandover';
import { DeleteConfirmationDialog } from '../ui/deleteDialog';




const HandoverManagement: React.FC = () => {
  const dispatch = useAppDispatch();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const { user: userHandoverManagement, handover } = useCombinedContext();
  const { user } = userHandoverManagement;
  const {  reports, ui , isLoading} = useAppSelector((state) => state.handover);
  
    const formData = ui.formData;
    const { 
      teamLead 
    } = useAppSelector(state => state.leave);

    const {createHandover, deleteHandover} = useReduxHandover()
  // const canReviewHandovers = user?.role === 'admin' || user?.role === 'hr' || user?.role === 'md' || user?.role === 'teamlead';
  const canReviewHandovers =  user?.role === 'teamlead';





const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file) {
    if (file.type !== 'application/pdf') {
      toast({ title: "Invalid File", description: "Only PDFs are allowed.", variant: "destructive" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: "File Too Large", description: "PDF must be < 5MB.", variant: "destructive" });
      return;
    }
    setSelectedFile(file);
  }
};

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!formData.teamleadId) {
    toast({
      title: "Team Lead Required",
      description: "Select a team lead.",
      variant: "destructive",
    });
    return;
  }

  if (!selectedFile) {
    toast({
      title: "PDF Required",
      description: "Upload a PDF file.",
      variant: "destructive",
    });
    return;
  }


  const submissionData = new FormData();
  submissionData.append("date", formData.date);
  submissionData.append("shift", formData.shift);
  submissionData.append("summary", formData.summary);
  submissionData.append("teamlead", formData.teamleadId);
  submissionData.append("file", selectedFile);



  const success = await createHandover(submissionData);

  if (success) {
    dispatch(resetFormData());
    dispatch(setIsDialogOpen(false));
  }
};



// const handleApprove = async (handoverId: string) => {
//   const success = await approveHandover(handoverId);
//   if (success) {
//     dispatch(setSelectedReport(null));
//   }
// };

// const handleReject = async (handoverId: string, note: string) => {
//   const success = await rejectHandover(handoverId, note);
//   if (success) {
//     dispatch(setSelectedReport(null));
//     dispatch(setRejectionNote(''));
//     dispatch(setIsRejectDialogOpen(false));
//   }
// };


const openRejectDialog = (handover: HandoverReport) => {
  dispatch(setSelectedReport(handover));
  dispatch(setIsRejectDialogOpen(true));
};



const handleStatusChange = (reportId: string, newStatus: HandoverReport['status']) => {
  dispatch(updateReportStatus({ id: reportId, status: newStatus }));

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

const downloadPDF = async (report: HandoverReport) => {
  if (!report.pdfFile) return;

  const { id: toastId, dismiss } = toast({
    title: "Download Started",
    description: `Downloading handover_${report.date}.pdf`,
  });

  try {
    const response = await fetch(report.pdfFile);
    if (!response.ok) throw new Error("Download failed");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `handover_${report.date}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Automatically close the toast after download completes
    dismiss();
  } catch (error) {
    // If download failed, close the "Downloading..." toast and show an error toast
    dismiss();
    toast({
      title: "Download Failed",
      description: "There was an error downloading the file.",
      variant: "destructive",
    });
  }
};
const handleDelete = async (id: string) => {
 await deleteHandover(id);
 
};


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
              {/* {pendingCount} Pending Approval */}
            </Badge>
          )}


   <Dialog open={ui.isDialogOpen} onOpenChange={(open) => dispatch(setIsDialogOpen(open))}>
      {user?.role === "employee" && (
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Submit Handover
          </Button>
        </DialogTrigger>
      )}


  <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
    <DialogHeader>
      <DialogTitle>Submit Daily Handover Report</DialogTitle>
      <DialogDescription>
        Upload your daily handover report in PDF format along with a summary
      </DialogDescription>
    </DialogHeader>

    <form onSubmit={(e) => {  handleSubmit(e); }}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => dispatch(setFormData({ date: e.target.value }))}
              min={new Date().toISOString().split('T')[0]} // disables past dates
              required
            />
          </div>
          <div>
            <Label htmlFor="shift">Shift</Label>
            <Select
              value={formData.shift}
              onValueChange={(value: 'day' | 'night') => dispatch(setFormData({ shift: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day Shift (8:30 AM - 5:00 PM)</SelectItem>
                <SelectItem value="night">Night Shift (4:00 PM - 5:00 AM)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="teamLead">Team Lead</Label>
          <Select
            value={formData.teamleadId}
            onValueChange={(value) => dispatch(setFormData({ teamleadId: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select team lead" />
            </SelectTrigger>
            <SelectContent>
              {teamLead?.data.map((lead) => (
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
        <span className="text-sm text-green-700">
          {selectedFile.name}
        </span>
      </div>
    )}
  </div>
</div>

        <div>
          <Label htmlFor="summary">Summary</Label>
          <Textarea
            id="summary"
            value={formData.summary}
            onChange={(e) => dispatch(setFormData({ summary: e.target.value }))}
            placeholder="Brief summary of the day's work"
            required
          />
        </div>

        {/* <div>
          <Label htmlFor="achievements">Key Achievements</Label>
          <Textarea
            id="achievements"
            value={formData.achievements}
            onChange={(e) => dispatch(setFormData({ achievements: e.target.value }))}
            placeholder="What did you accomplish today?"
          />
        </div>

        <div>
          <Label htmlFor="challenges">Challenges Faced</Label>
          <Textarea
            id="challenges"
            value={formData.challenges}
            onChange={(e) => dispatch(setFormData({ challenges: e.target.value }))}
            placeholder="Any challenges or issues encountered"
          />
        </div>

        <div>
          <Label htmlFor="nextDayPlan">Next Day Plan</Label>
          <Textarea
            id="nextDayPlan"
            value={formData.nextDayPlan}
            onChange={(e) => dispatch(setFormData({ nextDayPlan: e.target.value }))}
            placeholder="Plans and priorities for tomorrow"
          />
        </div> */}
      </div>

     <DialogFooter className="mt-6">
  <Button
    type="button"
    variant="outline"
    onClick={() => dispatch(setIsDialogOpen(false))}
    disabled={isLoading} // Optional: disable Cancel button too
  >
    Cancel
  </Button>

  <Button type="submit" disabled={isLoading}>
    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
    Submit Report
  </Button>
    </DialogFooter>

    </form>
  </DialogContent>
  </Dialog>

        </div>
      </div>

      <Tabs defaultValue="my-reports" className="space-y-6">
        <TabsList>
          <TabsTrigger value="my-reports">
            {user?.role !== 'employee' ? 'Team Reports' : 'My Reports'}
          </TabsTrigger>

          {/* {canReviewHandovers && <TabsTrigger value="approval-queue">Approval Queue</TabsTrigger>}
          {canReviewHandovers && <TabsTrigger value="team-reports">All Reports</TabsTrigger>} */}
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
                    <TableHead>Employee Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>PDF File</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
       


              <TableBody>
                {reports.map((report: HandoverReport) => (
                  <TableRow key={report._id}>
                    <TableCell>
                      {new Date(report.date).toLocaleDateString()}
                    </TableCell>

                    <TableCell>
                      <Badge
                        variant="outline"
                        className={report.shift === 'day' ? 'text-orange-700' : 'text-blue-700'}
                      >
                        {report.shift === 'day' ? 'Day' : 'Night'}
                      </Badge>
                    </TableCell>

                    <TableCell>{report.employeename}</TableCell>

                    <TableCell>{getStatusBadge(report.status)}</TableCell>

                    <TableCell>
                      {report.pdfFile && (
                        <div className="flex items-center gap-2">
                          <FileUp className="h-4 w-4 text-gray-500" />
                          <span className="text-sm">
                            handover_{new Date(report.date).toLocaleDateString('en-CA')}.pdf
                          </span>
                        </div>
                      )}
                    </TableCell>

              <TableCell>
                <div className="flex gap-2">
                  {report.pdfFile && (
                    <>
                      {/* ✅ Download button: Only for non-employees */}
                      {user?.role !== "employee" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => downloadPDF(report)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}

                      {/* ✅ View button: Always visible */}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => window.open(report.pdfFile, '_blank')}
                      >
                        View
                      </Button>

                      {/* ✅ Delete button: Only for admin and hr */}
                      {(user?.role === "teamlead" || user?.role === "hr") && (
                          <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => {
                                dispatch(setSelectedDeleteId(report._id!));
                                dispatch(setIsDeleteDialogOpen(true));
                              }}
                            >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                    </>
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

  {/* canReviewHandovers */}

    {/*     {canReviewHandovers && (
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
                    {reports.map((report) => (
                      <TableRow key={report._id}>
                        <TableCell className="font-medium">{report.user}</TableCell>
                        <TableCell>{new Date(report.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={report.shift === 'day' ? 'text-orange-700' : 'text-blue-700'}>
                            {report.shift === 'day' ? 'Day' : 'Night'}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(report.status)}</TableCell>
                        <TableCell>
                          {report.pdfFile && (
                            <div className="flex items-center gap-2">
                              <FileUp className="h-4 w-4 text-gray-500" />
                              <span className="text-sm">{report.pdfFile}</span>
                            </div>
                          )}
                        </TableCell>
                 <TableCell>
  <div className="flex gap-2">
      {report.pdfFile && user?.role?.toLowerCase() !== "employee" && (
      <Button
        size="sm"
        variant="outline"
        onClick={() => downloadPDF(report)}
      >
        <Download className="h-4 w-4" />
      </Button>
    )}

    {(report.status === 'approved' || report.status === 'pending') && (
      <>
        <Button
          size="sm"
          variant="outline"
          onClick={() => handleStatusChange(report._id, 'reviewed')}
        >
          Review
        </Button>
        <Button
          size="sm"
          onClick={() => handleStatusChange(report._id, 'approved')}
        >
          Approve
        </Button>
      </>
    )}

    {report.status === 'reviewed' && (
      <Button
        size="sm"
        onClick={() => handleStatusChange(report._id, 'approved')}
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
        )} */}
      </Tabs>
      <DeleteConfirmationDialog onConfirm={handleDelete} />
{/* Dialog */}


    </div>
  );
};

export default HandoverManagement;


      // {canReviewHandovers && (
      //     <TabsContent value="approval-queue">
      //       <Card>
      //         <CardHeader>
      //           <CardTitle className="flex items-center gap-2">
      //             <FileText className="h-5 w-5" />
      //             Pending Handover Reports
      //           </CardTitle>
      //           <CardDescription>Review handover reports submitted by team members</CardDescription>
      //         </CardHeader>
      //         <CardContent>
      //           <Table>
      //             <TableHeader>
      //               <TableRow>
      //                 <TableHead>Employee</TableHead>
      //                 <TableHead>Date</TableHead>
      //                 <TableHead>Shift</TableHead>
      //                 <TableHead>Summary</TableHead>
      //                 <TableHead>Status</TableHead>
      //                 <TableHead>Actions</TableHead>
      //               </TableRow>
      //             </TableHeader>
      //             <TableBody>
      //               {reports
      //                 .filter(report => report.status === 'pending' || report.status === 'approved')
      //                 .map((report) => (
      //                 <TableRow key={report._id}>
      //                   <TableCell>
      //                     <div className="flex items-center gap-2">
      //                       <User className="h-4 w-4 text-gray-500" />
      //                       <span className="font-medium">{report.user}</span>
      //                     </div>
      //                   </TableCell>
      //                   <TableCell>
      //                     <div className="flex items-center gap-2">
      //                       <Calendar className="h-4 w-4 text-gray-500" />
      //                       {new Date(report.date).toLocaleDateString()}
      //                     </div>
      //                   </TableCell>
      //                   <TableCell>
      //                     <Badge variant="outline" className={report.shift === 'day' ? 'text-orange-700' : 'text-blue-700'}>
      //                       {report.shift === 'day' ? 'Day' : 'Night'}
      //                     </Badge>
      //                   </TableCell>
      //                   <TableCell>
      //                     <div className="max-w-xs truncate" title={report.summary}>
      //                       {report.summary}
      //                     </div>
      //                   </TableCell>
      //                   <TableCell>{getStatusBadge(report.status)}</TableCell>
      //                   {/* <TableCell>
      //                     <div className="flex gap-2">
      //                       <Button
      //                         size="sm"
      //                         onClick={() => handleApprove(report._id)}
      //                         className="bg-green-600 hover:bg-green-700"
      //                       >
      //                         <CheckCircle className="h-4 w-4 mr-1" />
      //                         Approve
      //                       </Button>
      //                       <Button
      //                         size="sm"
      //                         variant="destructive"
      //                         onClick={() => openRejectDialog(report)}
      //                       >
      //                         <XCircle className="h-4 w-4 mr-1" />
      //                         Reject
      //                       </Button>
      //                     </div>
      //                   </TableCell> */}
      //                 </TableRow>
      //               ))}
      //             </TableBody>
      //           </Table>
      //         </CardContent>
      //       </Card>
      //     </TabsContent>
      //   )}

          // <Dialog
          //   open={ui.isRejectDialogOpen}
          //   onOpenChange={(open) => dispatch(setIsRejectDialogOpen(open))}
          // >
          //   <DialogContent>
          //     <DialogHeader>
          //       <DialogTitle>Reject Handover Report</DialogTitle>
          //       <DialogDescription>
          //         You are about to reject{' '}
          //         {selectedReport?.user ?? 'this user'}'s handover report.
          //         You can optionally provide a reason for rejection.
          //       </DialogDescription>
          //     </DialogHeader>

          //     <div className="space-y-4">
          //       <div>
          //         <Label htmlFor="rejectionNote">Reason for Rejection (Optional)</Label>
          //         <Textarea
          //           id="rejectionNote"
          //           value={ui.rejectionNote}
          //           onChange={(e) => dispatch(setRejectionNote(e.target.value))}
          //           placeholder="Provide feedback or reason for rejection..."
          //           className="mt-2"
          //         />
          //       </div>
          //     </div>

          //     {/* <DialogFooter>
          //       <Button variant="outline" onClick={() => dispatch(setIsRejectDialogOpen(false))}>
          //         Cancel
          //       </Button>
          //       <Button
          //         variant="destructive"
          //         onClick={() => {
          //           if (selectedReport?._id) {
          //             handleReject(selectedReport._id, ui.rejectionNote);
          //           }
          //         }}
          //       >
          //         Reject Report
          //       </Button>
          //     </DialogFooter> */}
          //   </DialogContent>
          // </Dialog>