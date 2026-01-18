import { ComponentProps } from "react";

interface PaginationPageSizeSelectProps
  extends Omit<ComponentProps<"select">, "onChange"> {
  pageSize: number;
  onPageSizeChange: (newSize: number) => void;
  options?: number[];
}

export default function PaginationPageSizeSelect({
  pageSize,
  onPageSizeChange,
  options = [10, 15, 20, 50], // Default options
  className = "",
  ...props
}: PaginationPageSizeSelectProps) {
  return (
    <select
      value={pageSize}
      onChange={(e) => onPageSizeChange(Number(e.target.value))}
      className={`text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer ${className}`}
      {...props}
    >
      {options.map((size) => (
        <option key={size} value={size}>
          {size} per page
        </option>
      ))}
    </select>
  );
}
