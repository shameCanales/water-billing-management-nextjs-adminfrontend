import { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface TablePaginationProps<TData> {
  table: Table<TData>;
  totalRecords: number;
  totalPages: number;
  pageSizeOptions?: number[];
  rowCount?: number;
}

export default function TablePagination<TData>({
  table,
  totalRecords,
  totalPages,
  pageSizeOptions = [10, 15, 20, 50],
  rowCount,
}: TablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;

  const currentRowsCount = rowCount ?? table.getRowModel().rows.length;

  // Display "Page 1" even if index is 0
  const currentPage = pageIndex + 1;

  // Robust checks for buttons
  const canPrevious = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white rounded-b-xl">
      {/* Left: Info & Page Size */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Showing <span className="font-medium">{currentRowsCount}</span> of{" "}
          <span className="font-medium">{totalRecords}</span> results
        </span>

        <select
          value={pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value));
          }}
          className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 cursor-pointer"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size} per page
            </option>
          ))}
        </select>
      </div>

      {/* Right: Navigation Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => table.setPageIndex(0)}
          disabled={!canPrevious}
          className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 transition-colors"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        <button
          onClick={() => table.previousPage()}
          disabled={!canPrevious}
          className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <span className="text-sm font-medium px-2 text-gray-700 min-w-[80px] text-center">
          Page {currentPage} of {totalPages || 1}
        </span>

        <button
          onClick={() => table.nextPage()}
          disabled={!canNext}
          className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <button
          onClick={() => table.setPageIndex(totalPages - 1)}
          disabled={!canNext}
          className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600 transition-colors"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}