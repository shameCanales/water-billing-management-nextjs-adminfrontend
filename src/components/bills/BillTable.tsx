"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useGetAllBills } from "@/hooks/bills/useGetAllBills";
import { getBillColumns } from "./BillColumns";
import { Bill } from "@/types/bills";
import TableToolbar from "../ui/table/TableToolbar";
import {
  PaginationContainer,
  PaginationFlexRow,
} from "../ui/pagination/PaginationContainer";
import PaginationButton from "../ui/pagination/PaginationButton";
import PaginationInfo from "../ui/pagination/PaginationInfo";
import PaginationPageCounter from "../ui/pagination/PaginationCounter";
import PaginationPageSizeSelect from "../ui/pagination/PaginationPageSizeSelect";
import { TableContainer } from "../ui/table/Table";

type BillStatusFilterType = "paid" | "unpaid" | "overdue" | "all";

export default function BillsTable() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BillStatusFilterType>("all");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useGetAllBills({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    status: statusFilter === "all" ? undefined : statusFilter,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const bills = data?.bills || [];
  const totalPages = data?.pagination.totalPages || 0;
  const totalRecords = data?.pagination.total || 0;

  const handleView = useCallback((bill: Bill) => {
    console.log("Viewing Bill:", bill._id);
  }, []);

  const columns = useMemo(
    () => getBillColumns(openMenuId, setOpenMenuId, handleView),
    [openMenuId, handleView],
  );

  const table = useReactTable({
    data: bills,
    columns,
    state: { sorting, pagination },
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isError) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p className="font-bold">Error Loading Bills</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans mt-8">
      <TableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search by meter number or consumer..."
        onAddClick={() => console.log("add")}
        addButtonLabel="Create Bill"
      >
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as BillStatusFilterType)
            }
            className="appearance-none w-full sm:w-40 pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-600"
          >
            <option value="all">All Statuses</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </TableToolbar>

      {/* TABLE CONTAINER */}
      <TableContainer>
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    className="bg-gray-50 border-b border-gray-200"
                  >
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        <div className="flex items-center gap-2">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {{
                            asc: <span className="text-blue-600">▲</span>,
                            desc: <span className="text-blue-600">▼</span>,
                          }[header.column.getIsSorted() as string] ?? null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="divide-y divide-gray-100">
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <tr
                      key={row.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td
                          key={cell.id}
                          className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={columns.length}
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No bills found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <PaginationContainer>
          <PaginationFlexRow>
            <PaginationInfo
              currentCount={bills.length}
              totalCount={totalRecords}
            />

            <PaginationPageSizeSelect
              pageSize={table.getState().pagination.pageSize}
              onPageSizeChange={(newSize) => {
                table.setPageSize(newSize);
                table.setPageIndex(0);
              }}
            />
          </PaginationFlexRow>

          <PaginationFlexRow>
            <PaginationButton
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronsLeft className="w-4 h-4" />
            </PaginationButton>

            <PaginationButton
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4" />
            </PaginationButton>

            <PaginationPageCounter
              currentPage={table.getState().pagination.pageIndex + 1}
              totalPages={totalPages}
            />

            <PaginationButton
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <ChevronRight className="w-4 h-4" />
            </PaginationButton>

            <PaginationButton
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
            >
              <ChevronsRight className="w-4 h-4" />
            </PaginationButton>
          </PaginationFlexRow>
        </PaginationContainer>
      </TableContainer>
    </div>
  );
}
