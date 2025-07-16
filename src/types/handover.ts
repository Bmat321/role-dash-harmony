/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HandoverReport {
  _id?: string;
  user: string;
  teamLead: string;
  date: string;
  shift: "Day" | "Night";
  summary: string;
  pdfFile?: string;
  status: "Pending" | "Approved" | "Rejected";
  note?: string;
  createdAt: string;
}

export interface HandoverContextType {
  reports: HandoverReport[];
  selectedReport: HandoverReport | null;
  isHandoverLoading: boolean;
  handoverError: string | null;
  createLoading: boolean;
  approveLoading: boolean;
  rejectLoading: boolean;
  createHandover: (formData: FormData) => Promise<boolean>;
  approveHandover: (id: string) => Promise<boolean>;
  rejectHandover: (id: string) => Promise<boolean>;
  refetchReports: any;
  setSelectedReport: (report: HandoverReport | null) => void;
  clearHandoverState: () => void;
}
