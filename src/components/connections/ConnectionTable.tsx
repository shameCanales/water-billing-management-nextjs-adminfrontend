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
import { ActionMenuItem } from "../ActionMenu";
import { StatusBadge } from "../ui/StatusBadge";
import { ActionMenu } from "../ActionMenu";

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
      dispatch(uiActions.openEditConnectionModal()); // Ensure this exists in uiSlice
    },
    [dispatch],
  );

  const handleDeleteClick = useCallback(
    (connection: Connection) => {
      setSelectedConnection(connection);
      dispatch(uiActions.openDeleteConnectionModal()); // Ensure this exists in uiSlice
    },
    [dispatch],
  );

  const columns = useMemo(
    () =>
      getConnectionColumns(
        openMenuRowId,
        setOpenMenuRowId,
        handleEditClick,
        handleDeleteClick,
      ),
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
      {/* --- MODALS --- */}
      <AddConnectionModal />
      {/* <EditConnectionModal connectionToEdit={selectedConnection} />
      <DeleteConnectionModal connectionToDelete={selectedConnection} /> */}

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
          <TableSkeleton />
        ) : (
          <>
            {/* DESKTOP VIEW */}
            <TableScrollArea>
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => (
                        <TableHead
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          className="cursor-pointer hover:bg-gray-100"
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
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        No connections found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableScrollArea>

            {/* MOBILE VIEW */}
            <TableMobileList>
              {table.getRowModel().rows.map((row) => {
                const conn = row.original;
                return (
                  <div
                    key={row.id}
                    className="p-4 flex flex-col gap-3 bg-white hover:bg-gray-50 transition-colors"
                  >
                    {/* Header: Meter # + Menu */}
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
                          Meter No.
                        </p>
                        <div className="font-bold text-gray-900 text-lg">
                          {conn.meterNumber}
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <StatusBadge status={conn.status} />

                        <ActionMenu
                          isOpen={openMenuRowId === conn._id}
                          onToggle={() =>
                            setOpenMenuRowId(
                              openMenuRowId === conn._id ? null : conn._id,
                            )
                          }
                          onClose={() => setOpenMenuRowId(null)}
                        >
                          <ActionMenuItem onClick={() => {}}>
                            <Eye size={14} /> View
                          </ActionMenuItem>
                          <ActionMenuItem onClick={() => handleEditClick(conn)}>
                            <Edit size={14} /> Edit
                          </ActionMenuItem>
                          <ActionMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(conn)}
                          >
                            <Trash2 size={14} /> Delete
                          </ActionMenuItem>
                        </ActionMenu>
                      </div>
                    </div>

                    {/* Content */}
                    <div>
                      <div className="font-medium text-gray-900 text-base">
                        {conn.consumer
                          ? `${conn.consumer.firstName} ${conn.consumer.lastName}`
                          : "Deleted Consumer"}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {conn.address}
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end pt-2 border-t border-gray-50 mt-1">
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
                      <div className="text-right">
                        <p className="text-[10px] text-gray-400 uppercase font-semibold">
                          Connected
                        </p>
                        <p className="text-xs font-medium text-gray-700">
                          {new Date(conn.connectionDate).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </TableMobileList>
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

// {/* --- TABLE CONTAINER --- */}
// <TableContainer>
//   {isLoading ? (
//     <TableSkeleton />
//   ) : (
//     <>
//       {/* DESKTOP TABLE */}
//       <TableScrollArea>
//         <Table>
//           <TableHead>
//             {table.getHeaderGroups().map((headerGroup) => (
//               <TableRow key={headerGroup.id}>
//                 {headerGroup.headers.map((header) => (
//                   <TableHead
//                     key={header.id}
//                     onClick={header.column.getToggleSortingHandler()}
//                     className="cursor-pointer hover:bg-gray-100"
//                   >
//                     <div className="flex items-center gap-2">
//                       {flexRender(
//                         header.column.columnDef.header,
//                         header.getContext(),
//                       )}
//                       {{
//                         asc: <span className="text-blue-600">▲</span>,
//                         desc: <span className="text-blue-600">▼</span>,
//                       }[header.column.getIsSorted() as string] ?? null}
//                     </div>
//                   </TableHead>
//                 ))}
//               </TableRow>
//             ))}
//           </TableHead>
//           <TableBody>
//             {table.getRowModel().rows.length > 0 ? (
//               table.getRowModel().rows.map((row) => (
//                 <TableRow key={row.id}>
//                   {row.getVisibleCells().map((cell) => (
//                     <TableCell key={cell.id}>
//                       {flexRender(
//                         cell.column.columnDef.cell,
//                         cell.getContext(),
//                       )}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell
//                   colSpan={columns.length}
//                   className="px-6 py-12 text-center text-gray-500"
//                 >
//                   No connections found.
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableScrollArea>

//       {/* MOBILE VIEW (Cards) - Specific to Connections */}
//       <div className="md:hidden divide-y divide-gray-100">
//         {table.getRowModel().rows.map((row) => {
//           const conn = row.original;
//           // Format name safely
//           const consumerName = conn.consumer
//             ? `${conn.consumer.firstName} ${conn.consumer.lastName}`
//             : "Deleted Consumer"; // Fallback text

//           return (
//             <div
//               key={row.id}
//               className="p-4 flex flex-col gap-3 bg-white hover:bg-gray-50 transition-colors"
//             >
//               {/* Header: Meter # + Menu */}
//               <div className="flex justify-between items-start">
//                 <div>
//                   <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold mb-0.5">
//                     Meter No.
//                   </p>
//                   <div className="font-bold text-gray-900 text-lg">
//                     {conn.meterNumber}
//                   </div>
//                 </div>
//                 <div className="flex items-center gap-1">
//                   <StatusBadge status={conn.status} />

//                   {/* Mobile Action Menu */}
//                   <ActionMenu
//                     isOpen={openMenuRowId === conn._id}
//                     onToggle={() =>
//                       setOpenMenuRowId(
//                         openMenuRowId === conn._id ? null : conn._id,
//                       )
//                     }
//                     onClose={() => setOpenMenuRowId(null)}
//                   >
//                     <ActionMenuItem
//                       onClick={() => {
//                         console.log("View", conn._id);
//                         setOpenMenuRowId(null);
//                       }}
//                     >
//                       <Eye size={14} /> View Details
//                     </ActionMenuItem>
//                     <ActionMenuItem
//                       onClick={() => {
//                         handleEditClick(conn);
//                         setOpenMenuRowId(null);
//                       }}
//                     >
//                       <Edit size={14} /> Edit Connection
//                     </ActionMenuItem>
//                     <ActionMenuItem
//                       className="text-red-600 hover:bg-red-50"
//                       onClick={() => {
//                         handleDeleteClick(conn);
//                         setOpenMenuRowId(null);
//                       }}
//                     >
//                       <Trash2 size={14} /> Delete Connection
//                     </ActionMenuItem>
//                   </ActionMenu>
//                 </div>
//               </div>

//               {/* Consumer Info */}
//               <div>
//                 <div className="font-medium text-gray-900 text-base">
//                   {consumerName}
//                 </div>
//                 <div className="text-sm text-gray-500 truncate">
//                   {conn.address}
//                 </div>
//               </div>

//               {/* Footer: Type + Date */}
//               <div className="flex justify-between items-end pt-2 border-t border-gray-50 mt-1">
//                 <span
//                   className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide border
//                     ${
//                       conn.type === "residential"
//                         ? "bg-blue-50 text-blue-700 border-blue-100"
//                         : conn.type === "commercial"
//                           ? "bg-purple-50 text-purple-700 border-purple-100"
//                           : "bg-orange-50 text-orange-700 border-orange-100"
//                     }`}
//                 >
//                   {conn.type}
//                 </span>
//                 <div className="text-right">
//                   <p className="text-[10px] text-gray-400 uppercase font-semibold">
//                     Connected
//                   </p>
//                   <p className="text-xs font-medium text-gray-700">
//                     {new Date(conn.connectionDate).toLocaleDateString()}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </>
//   )}

// </TableContainer>

{
  /* PAGINATION FOOTER
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium">{connections.length}</span>{" "}
              of <span className="font-medium">{totalRecords}</span> results
            </p>

            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
                table.setPageIndex(0);
              }}
              className="text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
            >
              {[10, 15, 20, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  {pageSize} per page
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-sm font-medium px-2 text-gray-700">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {totalPages || 1}
            </span>

            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-gray-600"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div> */
}
