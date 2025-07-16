/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  useCreateHandoverMutation,
  useGetMyHandoverReportsQuery,
  useApproveHandoverReportMutation,
  useRejectHandoverReportMutation,
} from "@/store/slices/handover/handoverApi";
import { toast } from "../use-toast";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSelectedReport,
  clearHandoverState,
} from "@/store/slices/handover/handoverSlice";
import { HandoverContextType } from "@/types/handover";


export const useReduxHandover = (): HandoverContextType => {
  const dispatch = useAppDispatch();
   const { user } = useAppSelector((state) => state.auth);

  const { reports, isLoading, error, selectedReport } = useAppSelector(
    (state) => state.handover
  );

  const [createHandoverMutation, { isLoading: createLoading }] =
    useCreateHandoverMutation();
  const [approveMutation, { isLoading: approveLoading }] =
    useApproveHandoverReportMutation();
  const [rejectMutation, { isLoading: rejectLoading }] =
    useRejectHandoverReportMutation();

  const {
    data,
    isLoading: fetchLoading,
    error: fetchError,
    refetch: refetchReports,
  } = useGetMyHandoverReportsQuery(undefined, {
     skip: !user, // Skip if no user
   });

  const createHandover = async (formData: FormData): Promise<boolean> => {
    try {
      await createHandoverMutation(formData).unwrap();
      toast({
        title: "Report submitted successfully",
        description: "Your handover report has been created.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Submit Error",
        description: error?.data?.message || "Failed to submit handover report",
        variant: "destructive",
      });
      return false;
    }
  };

  const approveHandover = async (id: string): Promise<boolean> => {
    try {
      await approveMutation(id).unwrap();
      toast({ title: "Report approved successfully" });
      return true;
    } catch (error: any) {
      toast({
        title: "Approval Error",
        description: error?.data?.message || "Failed to approve report",
        variant: "destructive",
      });
      return false;
    }
  };

  const rejectHandover = async (id: string): Promise<boolean> => {
    try {
      await rejectMutation(id).unwrap();
      toast({ title: "Report rejected successfully" });
      return true;
    } catch (error: any) {
      toast({
        title: "Rejection Error",
        description: error?.data?.message || "Failed to reject report",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    reports: data,
    selectedReport,
    isHandoverLoading: isLoading || fetchLoading,
    handoverError: error ,
    createLoading,
    approveLoading,
    rejectLoading,
    createHandover,
    approveHandover,
    rejectHandover,
    refetchReports,
    setSelectedReport: (report) => dispatch(setSelectedReport(report)),
    clearHandoverState: () => dispatch(clearHandoverState()),
  };
};
