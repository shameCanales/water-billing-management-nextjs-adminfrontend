"use client";

import { useGetAllProcessors } from "@/hooks/processors/useGetAllProcessors";
import { useState, useEffect, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { StatusBadge } from "../ui/StatusBadge";
import {
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Shield,
} from "lucide-react";
import { getProcessorColumns } from "./ProcessorColumns";
import TableToolbar from "../ui/table/TableToolbar";
import { TableContainer } from "../ui/table/Table";
import PaginationButton from "../ui/pagination/PaginationButton";
import PaginationInfo from "../ui/pagination/PaginationInfo";
import PaginationPageSizeSelect from "../ui/pagination/PaginationPageSizeSelect";
import PaginationPageCounter from "../ui/pagination/PaginationCounter";
import {
  PaginationContainer,
  PaginationFlexRow,
} from "../ui/pagination/PaginationContainer";
import type { ProcessorRole, ProcessorStatus } from "@/types/processor";

type StatusFilterType = ProcessorStatus | "all" | "";
type RoleFilterType = ProcessorRole | "all" | "";

export default function ProcessorTable() {
  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("");

  // DEFAULT TO "staff"
  const [roleFilter, setRoleFilter] = useState<RoleFilterType>("staff");

  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ==========================================
  // 2. DATA FETCHING (React Query)
  // ==========================================
  const { data, isLoading, isError, error } = useGetAllProcessors({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    status:
      statusFilter === "" || statusFilter === "all" ? undefined : statusFilter,
    role: roleFilter === "" || roleFilter === "all" ? undefined : roleFilter,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  const processors = data?.processors || [];
  const totalPages = data?.pagination.totalPages || 0;
  const totalRecords = data?.pagination.total || 0;

  // ==========================================
  // 3. TABLE CONFIGURATION
  // ==========================================
  const columns = useMemo(
    () => getProcessorColumns(openMenuRowId, setOpenMenuRowId),
    [openMenuRowId],
  );

  const table = useReactTable({
    data: processors,
    columns,
    state: { sorting, pagination },
    manualPagination: true,
    manualSorting: true,
    pageCount: totalPages,
    onPaginationChange: setPagination,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
  });

  // ==========================================
  // 4. RENDER PHASE
  // ==========================================
  if (isError) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p className="font-bold">Error Loading Data</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans mt-8">
      <TableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search staff by name or email..."
        onAddClick={() => console.log("Open Add Processor Modal")} // Placeholder
        addButtonLabel="Add Processor"
      >
        <div className="flex gap-2">
          {/* Role Filter Dropdown */}
          <div className="relative">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as RoleFilterType)}
              className="appearance-none w-full sm:w-36 pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-600 capitalize"
            >
              <option value="staff">Staff Only</option>
              <option value="manager">Managers Only</option>
              <option value="all">All Roles</option>
            </select>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilterType)
              }
              className="appearance-none w-full sm:w-36 pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-600 capitalize"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
            </select>
          </div>
        </div>
      </TableToolbar>

      <TableContainer>
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div className="hidden md:block overflow-x-auto">
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
                        No processors found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW */}
            <div className="md:hidden divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => {
                const processor = row.original;
                return (
                  <div key={row.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900 capitalize">
                          {processor.firstName} {processor.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {processor.email}
                        </p>
                        <p className="text-xs text-blue-600 font-medium mt-1 capitalize">
                          {processor.role}
                        </p>
                      </div>
                      <StatusBadge status={processor.status || "active"} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PAGINATION */}
        <PaginationContainer>
          <PaginationFlexRow>
            <PaginationInfo
              currentCount={processors.length}
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
