import React from "react";
import { Eye } from "lucide-react";
;
import { LeaveRequest } from "@/types/leave";
import { useAppSelector } from "@/store/hooks";

interface ApprovalStepsProps {
  request: LeaveRequest;
}

const ApprovalSteps: React.FC<ApprovalStepsProps> = ({ request }) => {
  const { reviewTrail: trail = [] } = request;
  const { user: currentUser } = useAppSelector((state) => state.auth);

  const approvalFlow: ("teamlead" | "hr" | "md")[] = ["teamlead", "hr", "md"];
  const currentRole = currentUser?.role.toLowerCase() as "teamlead" | "hr" | "md" | "employee";

  // Find index of current role in flow, and start visibility from the next
  const currentRoleIndex = approvalFlow.indexOf(currentRole as any);
  const stepsToRender =
    currentRoleIndex !== -1 ? approvalFlow.slice(currentRoleIndex + 1) : approvalFlow;

  let stopAt: number | null = null;

  const elements = stepsToRender.map((role, index) => {
    const review = trail.find((r) => r.role.toLowerCase() === role);
    const isApproved = review?.action === "approved";
    const isRejected = review?.action === "rejected";

    if (isRejected && stopAt === null) {
      stopAt = index;
    }

    const statusIcon = isApproved ? "✔" : isRejected ? "✖" : "⏳";
    const statusColor = isRejected
      ? "text-red-500"
      : isApproved
      ? "text-green-600"
      : "text-gray-400";

    return (
      <React.Fragment key={role}>
        <div className={`flex items-center space-x-1 ${statusColor}`}>
          <span>{statusIcon}</span>
          <span>{role.charAt(0).toUpperCase() + role.slice(1)}</span>
          {isRejected && review?.note && (
            <span title={review.note}>
              <Eye className="w-3.5 h-3.5 ml-1 text-muted-foreground hover:text-black cursor-pointer" />
            </span>
          )}
        </div>
        {index < stepsToRender.length - 1 && (!stopAt || index < stopAt) && (
          <span className="text-gray-300">—</span>
        )}
      </React.Fragment>
    );
  });

  const visible = stopAt !== null ? elements.slice(0, stopAt * 2 + 1) : elements;

  return (
    <div className="flex items-center flex-wrap gap-1 mt-2 text-xs font-medium">
      {visible}
    </div>
  );
};

export default ApprovalSteps;
