import { ReactNode } from "react";

interface PaginationButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
  className?: string; // Optional: In case you want to override styles later
}

export default function PaginationButton({
  onClick,
  disabled,
  children,
  className = "",
}: PaginationButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      type="button" // Best practice: explicit type prevents accidental form submission
      className={`p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 ${className}`}
    >
      {children}
    </button>
  );
}
