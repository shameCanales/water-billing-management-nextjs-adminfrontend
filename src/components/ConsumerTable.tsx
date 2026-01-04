"use client";

import { useGetAllConsumers } from "@/hooks/consumers/useGetAllConsumers";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { StatusBadge } from "./ui/StatusBadge";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Plus,
} from "lucide-react";
import { getColumns } from "./consumers/columns";
import AddConsumerModal from "./consumers/AddConsumerModal";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { Consumer } from "@/types/consumers";
import EditConsumerModal from "./consumers/EditConsumerModal";
import DeleteConsumerModal from "./consumers/DeleteConsumerModal";
import { useUpdateConsumerStatus } from "@/hooks/consumers/useUpdateConsumerStatus";

type StatusFilterType = "active" | "suspended" | "all" | "";

export default function ConsumerTable() {
  const dispatch = useDispatch<AppDispatch>();
  const [selectedConsumer, setSelectedConsumer] = useState<Consumer | null>(
    null
  );

  // ==========================================
  // 1. STATE MANAGEMENT
  // ==========================================

  /**
   * Search State
   * searchTerm: What the user types immediately.
   * debouncedSearch: The value used for the API call after a delay.
   */
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  /**
   * Filter State
   * Controls the "Active/Suspended" dropdown.
   */
  const [statusFilter, setStatusFilter] = useState<StatusFilterType>("");

  /**
   * Sorting State (TanStack Table)
   * Stores an array of sorted columns. Example: [{ id: 'lastName', desc: true }]
   */
  const [sorting, setSorting] = useState<SortingState>([]);

  /**
   * Pagination State (TanStack Table)
   * pageIndex: 0-based index (0 is Page 1).
   * pageSize: Number of rows per page.
   */
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 15,
  });

  /**
   * Action Menu State (Lifting State Up)
   * Stores the ID of the row that currently has its Action Menu open.
   * If null, no menu is open.
   * This ensures only one menu is visible at a time.
   */
  const [openMenuRowId, setOpenMenuRowId] = useState<string | null>(null);

  /**
   * Debounce Effect
   * Waits for 500ms after the user stops typing before updating 'debouncedSearch'.
   * This prevents spamming the API with a request for every keystroke.
   */
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // ==========================================
  // 2. DATA FETCHING (React Query)
  // ==========================================
  const { data, isLoading, isError, error } = useGetAllConsumers({
    // Convert 0-based index to 1-based for the Backend
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
    search: debouncedSearch, // run if changes (after debounce)
    // Logic: If filter is empty or 'all', send undefined (removes param from URL).
    status:
      statusFilter === "" || statusFilter === "all" ? undefined : statusFilter,
    // Extract sorting parameters for the backend
    sortBy: sorting[0]?.id,
    sortOrder: sorting[0]?.desc ? "desc" : "asc",
  });

  // Safe fallback values to prevent crashes if data is undefined
  const consumers = data?.consumers || [];
  const totalPages = data?.pagination.totalPages || 0;
  const totalRecords = data?.pagination.total || 0;

  // ==========================================
  // 3. TABLE CONFIGURATION
  // ==========================================

  /**
   * Dynamic Columns Definition (useMemo)
   * We generate the columns dynamically because they depend on 'openMenuRowId'.
   * useMemo ensures we don't re-create the columns on every render, only when
   * the open menu changes.
   */

  const handleEditClick = useCallback(
    (consumer: Consumer) => {
      setSelectedConsumer(consumer);
      dispatch(uiActions.openEditConsumerModal()); // Open the modal via Redux
    },
    [dispatch]
  );

  const handleDeleteClick = useCallback(
    (consumer: Consumer) => {
      setSelectedConsumer(consumer);
      dispatch(uiActions.openDeleteConsumerModal()); // You need to add this to Redux uiSlice
    },
    [dispatch]
  );

  const { mutate: updateConsumerStatus, isPending: updatingConsumerStatus } =
    useUpdateConsumerStatus();

  const handleUpdateConsumerStatus = useCallback(
    (id: string, status: "active" | "suspended") => {
      updateConsumerStatus({ id, status });
    },
    [updateConsumerStatus]
  );

  // You are using useMemo here. This is a performance trick. It says: "Only re-create this column definition if openMenuRowId changes." If you didn't do this, the table logic would reset every time you typed a letter in the search bar.s
  const columns = useMemo(
    () =>
      getColumns(
        openMenuRowId,
        setOpenMenuRowId,
        handleEditClick,
        handleDeleteClick,
        handleUpdateConsumerStatus
      ),
    [
      openMenuRowId,
      handleDeleteClick,
      handleEditClick,
      handleUpdateConsumerStatus,
    ]
  );

  const table = useReactTable({
    data: consumers,
    columns, // Pass our memoized columns
    state: {
      sorting,
      pagination,
    },
    /**
     * Server-Side Configuration:
     * We tell TanStack NOT to paginate/sort the data itself (because we only have 10 rows).
     * Instead, we tell it how many total pages exist on the server.
     */
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

  // Error State Handling
  if (isError) {
    return (
      <div className="p-6 text-center text-red-500 bg-red-50 rounded-lg border border-red-200">
        <p className="font-bold">Error Loading Data</p>
        <p className="text-sm">{error?.message}</p>
      </div>
    );
  }

  // const handleEditClick = (consumer: Consumer) => {
  //   setSelectedConsumer(consumer);
  //   dispatch(uiActions.openEditConsumerModal()); // Open the modal via Redux
  // };

  return (
    <div className="space-y-6 font-sans mt-8">
      <AddConsumerModal />
      <EditConsumerModal consumerToEdit={selectedConsumer} />
      <DeleteConsumerModal consumerToDelete={selectedConsumer} />

      {/* TOOLBAR SECTION
        Contains: Search Bar, Status Filter, and Add Button
      */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input (Styled gray background) */}
          <div className="relative w-full sm:w-[320px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email or mobile..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-gray-400"
            />
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value as StatusFilterType)
              }
              className="appearance-none w-full sm:w-40 pl-10 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-600"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Add Consumer Button (Blue) */}
        <button
          onClick={() => dispatch(uiActions.openAddConsumerModal())}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          <Plus size={18} />
          Add Consumer
        </button>
      </div>

      {/* TABLE CONTAINER
       */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden min-h-[400px]">
        {isLoading ? (
          // Loading Skeleton
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* DESKTOP VIEW
              Hidden on small screens (md:block)
            */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  {/* Render Header Groups */}
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
                            {/* flexRender: Renders the header text defined in columns.tsx */}
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {/* Sort Indicator Arrows */}
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
                  {/* Render Rows */}
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
                            {/* flexRender: Renders the custom cell (like StatusBadge) defined in columns.tsx */}
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
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
                        No consumers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* MOBILE VIEW (Cards)
               Shown only on small screens (md:hidden)
            */}
            <div className="md:hidden divide-y divide-gray-100">
              {table.getRowModel().rows.map((row) => {
                const consumer = row.original;
                return (
                  <div key={row.id} className="p-4 flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-bold text-gray-900">
                          {consumer.firstName} {consumer.lastName}
                        </h3>
                        <p className="text-xs text-gray-500">
                          {consumer.email}
                        </p>
                      </div>
                      <StatusBadge status={consumer.status || "active"} />
                    </div>
                    {/* Add more fields here for mobile view if needed */}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {/* PAGINATION FOOTER
          Contains "Showing X results", Limit Dropdown, and Nav Buttons
        */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              Showing <span className="font-medium">{consumers.length}</span> of{" "}
              <span className="font-medium">{totalRecords}</span> results
            </span>

            {/* Limit Selector */}
            <select
              value={table.getState().pagination.pageSize}
              onChange={(e) => {
                table.setPageSize(Number(e.target.value));
                table.setPageIndex(0); // ✅ Best Practice: Reset to page 1 to avoid empty views
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
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
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
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-gray-600"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
