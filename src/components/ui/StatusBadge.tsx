interface StatusBadgeProps {
  status: string; 
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const normalizedStatus = status ? status.toLowerCase() : "unknown";

  let styles = "";

  switch (normalizedStatus) {
    // --- Billing Statuses ---
    case "paid":
      // Green Style
      styles = "bg-emerald-100 text-emerald-700 border-emerald-200";
      break;
    case "unpaid":
      // Orange Style
      styles = "bg-orange-100 text-orange-700 border-orange-200";
      break;
    case "overdue":
      // Red Style
      styles = "bg-red-100 text-red-700 border-red-200";
      break;

    // --- Connection/Consumer Statuses ---
    case "active":
    case "connected":
      styles = "bg-emerald-100 text-emerald-700 border-emerald-200";
      break;
    case "suspended":
    case "disconnected":
    case "inactive":
      styles = "bg-red-50 text-red-600 border-red-100";
      break;
    case "pending":
      styles = "bg-amber-100 text-amber-700 border-amber-200";
      break;
    default:
      styles = "bg-gray-100 text-gray-700 border-gray-200";
      break;
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 
        rounded-full text-[11px] font-bold border 
        capitalize tracking-wide transition-colors ${styles}
      `}
    >
      {status || "Unknown"}
    </span>
  );
};