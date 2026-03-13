import { format, isValid } from "date-fns";
import { BillSummary } from "@/types/bills";

interface AuditTrailContentProps {
  bill: BillSummary;
}

export const AuditTrailContent = ({ bill }: AuditTrailContentProps) => {
  const trails = [
    {
      label: "Created By",
      user: bill.createdBy,
      date: bill.createdAt,
    },
    {
      label: "Last Edit By",
      user: bill.lastEditBy,
      date: bill.lastEditAt,
    },
    {
      label: "Processed By",
      user: bill.processedBy,
      date: bill.paidAt,
    },
  ].filter((item) => item.user !== null);

  console.log(bill);

  const formatDate = (dateValue: string | null | undefined) => {
    if (!dateValue) return "—";
    const d = new Date(dateValue);
    return isValid(d) ? format(d, "MMM dd, yyyy • hh:mm a") : "—";
  };

  return (
    <div className="flex flex-col gap-4 p-1 ">
      {trails.map((item, index) => (
        <div
          key={`${item.label}-${index}`}
          className="flex flex-col gap-1 first:mt-0"
        >
          {/* Header Label */}
          <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 select-none">
            {item.label}
          </h4>

          <div className="flex flex-col">
            {/* Auditor Name and Role */}
            <p className="text-xs font-semibold text-gray-900 leading-tight">
              <span
                className={`mr-1.5 font-normal  italic opacity-80 ${item.user?.role === "manager" ? "text-blue-700" : "text-purple-500"}`}
              >
                {item.user?.role.charAt(0).toUpperCase()} —
              </span>
              {item.user?.firstName} {item.user?.lastName}
            </p>

            {/* Formatted Timestamp */}
            <time className="text-[10px] text-gray-500 mt-0.5">
              {formatDate(item.date)}
            </time>
          </div>
        </div>
      ))}

      {trails.length === 0 && (
        <span className="text-xs text-gray-400 italic">
          No audit records found
        </span>
      )}
    </div>
  );
};
