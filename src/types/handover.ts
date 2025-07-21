/* eslint-disable @typescript-eslint/no-explicit-any */

export interface HandoverReport {
  _id?: string;
  user: string;
  teamlsead: string;
  date: string;
  shift: "day" | "night";
  summary: string;
  pdfFile?: string;
  status: "submitted" | "approved" | "rejected";
  note?: string;
  employeename: string;
  createdAt: string;
}

export interface HandoverContextType {
  createHandover: (formData: FormData) => Promise<boolean>;
  deleteHandover: (id: string) => Promise<boolean>;
  myReports?: HandoverReport[];
  myReportsLoading?: boolean;
  teamReports?: HandoverReport[];
  teamReportsLoading?: boolean;
  refetchMyReports?: () => void;
  refetchTeamReports?: () => void;
  clearHandoverState: () => void;
}
