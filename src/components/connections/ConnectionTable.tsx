"use client";

import { useDispatch } from "react-redux";
import { Connection } from "@/types/connections";
import { useState, useEffect, useCallback, useMemo } from "react";
import {
  SortingState,
  PaginationState,
  flexRender,
  getCoreRowModel,
} from "@tanstack/react-table";
import { useGetAllConnections } from "@/hooks/connections/useGetAllConnections";
import { uiActions } from "@/lib/store/uiSlice";
import { ActionMenu, ActionMenuItem } from "../ActionMenu";
import { StatusBadge } from "../ui/StatusBadge";

import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import { useReactTable } from "@tanstack/react-table";
import { getConnectionColumns } from "./ConnectionColumns";
import AddConnectionModal from "./AddConnectionModal";
import TableToolbar from "../ui/table/TableToolbar";
import PaginationButton from "../ui/pagination/PaginationButton";
import PaginationInfo from "../ui/pagination/PaginationInfo";
import PaginationPageCounter from "../ui/pagination/PaginationCounter";
import PaginationPageSizeSelect from "../ui/pagination/PaginationPageSizeSelect";
import DeleteConnectionModal from "./DeleteConnectionModal";
import {
  TableContainer,
  TableScrollArea,
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableSkeleton,
  TableMobileList,
} from "../ui/table/Table";

type StatusFilterType = "active" | "disconnected" | "all" | "";
type TypeFilterType = "residential" | "commercial" | "all" | "";

export default function ConnectionsTable() {
  const dispatch = useDispatch();
  const [selectedConnection, setSelectedConnection] =
    useState<Connection | null>(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("");
  const [typeFilter, setTypeFilter] = useState<TypeFilterType>("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  useEffect(() => {
    console.log("📍 openMenuRowId changed to:", openMenuRowId);
  }, [openMenuRowId]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isError, error } = useGetAllConnections({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch,
    status:
      statusFilter === "" || statusFilter === "all" ? undefined : statusFilter,
    type: typeFilter === "" || typeFilter === "all" ? undefined : typeFilter,
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  //pagination
  const connections = data?.connections || [];
  const totalPages = data?.pagination.totalPages || 0;
  const totalRecords = data?.pagination.total || 0;

  // --- Handlers (Memoized) ---
  const handleEditClick = useCallback(
    (connection: Connection) => {
      setSelectedConnection(connection);
      dispatch(uiActions.openEditConnectionModal());
    },
    [dispatch],
  );

  const handleDeleteClick = useCallback(
    (connection: Connection) => {
      console.log("🟢 handleDeleteClick CALLED");
      console.log("🟢 Connection object:", connection);
      console.log("🟢 Connection ID:", connection._id);

      setSelectedConnection(connection);
      console.log("🟢 About to dispatch openDeleteConnectionModal");
      dispatch(uiActions.openDeleteConnectionModal());
      console.log("🟢 Dispatch complete");
    },
    [dispatch],
  );

  const columns = useMemo(
    // the problem might be here
    () => {
      const cols = getConnectionColumns(
        openMenuRowId,
        setOpenMenuRowId,
        handleEditClick,
        handleDeleteClick,
      );
      console.log("🟣 COLUMNS CREATED:", cols);
      console.log("🟣 Number of columns:", cols.length);
      console.log(
        "🟣 Actions column:",
        cols.find((c) => c.id === "actions"),
      );
      return cols;
    },
    [openMenuRowId, handleEditClick, handleDeleteClick],
  );

  const table = useReactTable({
    data: connections,
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
        <p className="font-bold">Error Loading Data</p>
        <p className="text-sm">
          {(error as Error)?.message || "Failed to load connections"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans mt-8">
      <AddConnectionModal />
      {/* <EditConnectionModal connectionToEdit={selectedConnection} /> */}
      <DeleteConnectionModal connectionToDelete={selectedConnection} />

      <TableToolbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search consumer, meter # or addresss."
        onAddClick={() => dispatch(uiActions.openAddConnectionModal())}
        addButtonLabel="Add Connection"
      >
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as TypeFilterType)}
            className="appearance-none w-full sm:w-40 pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-600"
          >
            <option value="">All Types</option>
            <option value="residential">Residential</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as StatusFilterType)
            }
            className="appearance-none w-full sm:w-40 pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-600"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="disconnected">Disconnected</option>
          </select>
        </div>
      </TableToolbar>

      {/* --- ATOMIC TABLE COMPOSITION START --- */}
      <TableContainer>
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* DESKTOP VIEW */}
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
                        No connections found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          {/* MOBILE VIEW */}
            <div className="md:hidden space-y-4">
              {table.getRowModel().rows.map((row) => {
                const conn = row.original;
                return (
                  <div
                    key={row.id}
                    className="bg-white p-4 border-b border-gray-200 flex flex-col gap-3"
                  >
                    {/* Header: Meter # & Status */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                          Meter No.
                        </p>
                        <div className="font-bold text-gray-900 text-lg font-mono">
                          {conn.meterNumber}
                        </div>
                      </div>
                      <StatusBadge status={conn.status} />
                    </div>

                    {/* Content: Consumer Info */}
                    <div>
                      <div className="font-medium text-gray-900 text-base">
                        {conn.consumer ? (
                          `${conn.consumer.firstName} ${conn.consumer.lastName}`
                        ) : (
                          <span className="text-red-500 italic text-sm">
                            Deleted Consumer
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-500 truncate mt-0.5">
                        {conn.address}
                      </div>
                    </div>

                    {/* Info Row: Type & Date */}
                    <div className="flex justify-between items-center py-2 border-t border-gray-50 border-dashed">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border 
                          ${
                            conn.type === "residential"
                              ? "bg-blue-50 text-blue-700 border-blue-100"
                              : conn.type === "commercial"
                              ? "bg-purple-50 text-purple-700 border-purple-100"
                              : "bg-orange-50 text-orange-700 border-orange-100"
                          }`}
                      >
                        {conn.type}
                      </span>
                      <div className="text-right flex items-center gap-2">
                         <span className="text-[10px] text-gray-400 uppercase font-semibold">Connected:</span>
                         <span className="text-xs font-medium text-gray-700">
                          {new Date(conn.connectionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* ACTION BUTTONS ROW */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                       <button 
                         onClick={() => console.log("View", conn._id)}
                         className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-gray-600 bg-gray-50 rounded hover:bg-gray-100 transition-colors border border-gray-200"
                       >
                         <Eye size={14} /> View
                       </button>
                       
                       <button 
                         onClick={() => handleEditClick(conn)}
                         className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-blue-600 bg-blue-50 rounded hover:bg-blue-100 transition-colors border border-blue-100"
                       >
                         <Edit size={14} /> Edit
                       </button>

                       <button 
                         onClick={() => handleDeleteClick(conn)}
                         className="flex items-center justify-center gap-1.5 py-2 text-xs font-medium text-red-600 bg-red-50 rounded hover:bg-red-100 transition-colors border border-red-100"
                       >
                         <Trash2 size={14} /> Delete
                       </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PAGINATION FOOTER */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <PaginationInfo
              currentCount={connections.length}
              totalCount={totalRecords}
            />

            <PaginationPageSizeSelect
              pageSize={table.getState().pagination.pageSize}
              onPageSizeChange={(newSize) => {
                table.setPageSize(newSize);
                table.setPageIndex(0);
              }}
            />
          </div>

          <div className="flex items-center gap-2">
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
          </div>
        </div>
      </TableContainer>
    </div>
  );
}

// <div className="md:hidden divide-y divide-gray-100">
//   {table.getRowModel().rows.map((row) => {
//     const conn = row.original;
//     return (
//       <div key={row.id} className="p-4 flex flex-col gap-3">
//         <div className="flex justify-between items-start">
//           <div>
//             <h3 className="text-sm font-bold text-gray-900">
//               Meter: {conn.meterNumber}
//             </h3>
//             <p className="text-xs text-gray-500">
//               {conn.consumer
//                 ? `${conn.consumer.firstName} ${conn.consumer.lastName}`
//                 : "No Consumer"}
//             </p>
//           </div>
//           <StatusBadge status={conn.status} />
//         </div>
//       </div>
//     );
//   })}
// </div>;
