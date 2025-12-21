import React from "react";

interface StatusBadgeProps {
  status: string; // "active", "suspended", "disconnected", etc.
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  // 1. Normalize the status to lowercase to prevent case-sensitive bugs
  const normalizedStatus = status ? status.toLowerCase() : "unknown";

  // 2. Define styles based on status
  let styles = "";

  switch (normalizedStatus) {
    case "active":
    case "connected":
      // Green Style
      styles = "bg-emerald-100 text-emerald-700 border-emerald-200";
      break;
    case "suspended":
    case "disconnected":
    case "inactive":
      // Red Style
      styles = "bg-red-100 text-red-700 border-red-200";
      break;
    case "pending":
      // Orange/Yellow Style (Good to have for future)
      styles = "bg-amber-100 text-amber-700 border-amber-200";
      break;
    default:
      // Gray Default
      styles = "bg-gray-100 text-gray-700 border-gray-200";
      break;
  }

  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 
        rounded-full text-xs font-medium border 
        capitalize ${styles}
      `}
    >
      {status || "Unknown"}
    </span>
  );
};