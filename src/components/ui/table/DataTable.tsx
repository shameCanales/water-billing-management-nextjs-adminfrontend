import { Table, flexRender } from "@tanstack/react-table";
import { ReactNode } from "react";

interface DataTableProps<TData> {
  table: Table<TData>;
  isLoading: boolean;
  columnsLength: number;
  renderMobileCard: (row: TData) => ReactNode; // Custom renderer for mobile
  emptyMessage?: string;
}

export default function DataTable<TData>({
  table,
  isLoading,
  columnsLength,
  renderMobileCard,
  emptyMessage = "No records found.",
}: DataTableProps<TData>) {
  // Loading Skeleton
  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <>
      {/* DESKTOP TABLE */}
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
                        header.getContext()
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
                <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className="px-6 py-4 text-sm text-gray-700 whitespace-nowrap"
                    >
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
                  colSpan={columnsLength}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MOBILE CARDS */}
      <div className="md:hidden divide-y divide-gray-100">
        {table.getRowModel().rows.map((row) => (
          <div key={row.id}>{renderMobileCard(row.original)}</div>
        ))}
      </div>
    </>
  );
}
