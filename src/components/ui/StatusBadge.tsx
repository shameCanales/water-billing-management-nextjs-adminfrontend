interface StatusBadgeProps {
  status: string;
  capsLock?: boolean;
}

export const StatusBadge = ({ status, capsLock = false }: StatusBadgeProps) => {
  const normalizedStatus = status ? status.toLowerCase() : "unknown";

  // 1. Rename to colorStyles to prevent confusion
  let colorStyles = "";

  switch (normalizedStatus) {
    // --- Billing Statuses ---
    case "paid":
      colorStyles = "bg-emerald-100 text-emerald-700 border-emerald-200";
      break;
    case "unpaid":
      colorStyles = "bg-orange-100 text-orange-700 border-orange-200";
      break;
    case "overdue":
      colorStyles = "bg-red-100 text-red-700 border-red-200";
      break;

    // --- Connection/Consumer Statuses ---
    case "active":
    case "connected":
      colorStyles = "bg-emerald-100 text-emerald-700 ";
      break;
    case "suspended":
    case "disconnected":
    case "restricted":
    case "inactive":
      colorStyles = "bg-red-50 text-red-600 ";
      break;
    case "pending":
      colorStyles = "bg-amber-100 text-amber-700 ";
      break;
    case "residential":
    case "manager":
      colorStyles = "bg-blue-50 text-blue-700 ";
      break;
    case "commercial":
    case "staff":
      colorStyles = "bg-purple-50 text-purple-500 ";
      break;
    default:
      colorStyles = "bg-gray-100 text-gray-700 ";
      break;
  }

  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 
        rounded-full text-[11px] font-bold 
        tracking-wide transition-colors
        ${capsLock ? "uppercase" : "capitalize"} 
        ${colorStyles}
      `}
    >
      {status || "Unknown"}
    </span>
  );
};
