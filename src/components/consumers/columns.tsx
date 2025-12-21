"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Consumer } from "@/types/consumers";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Info } from "lucide-react";
import { ActionMenu } from "./ActionMenu";

// CHANGED: Export a function instead of a constant array
export const getColumns = (
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void
): ColumnDef<Consumer>[] => [
  {
    accessorKey: "lastName",
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.original.firstName} {row.original.lastName}
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "mobileNumber",
    header: "Mobile Number",
    cell: ({ getValue }) => (
      <span className="text-gray-600">{getValue() as string}</span>
    ),
  },
  {
    accessorKey: "address",
    header: "Address",
    cell: ({ getValue }) => (
      <span
        className="text-gray-600 truncate max-w-[200px] block"
        title={getValue() as string}
      >
        {getValue() as string}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
  },
  {
    accessorKey: "createdAt",
    header: "Registered",
    cell: ({ getValue }) => {
      const date = new Date(getValue() as string);
      return <span className="text-gray-600">{date.toLocaleDateString()}</span>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors">
          <Info size={18} />
        </button>

        {/* CHANGED: Pass controlled props to ActionMenu */}
        <ActionMenu
          // 1. Am I the open one?
          isOpen={openMenuId === row.original._id}
          // 2. Logic to Toggle
          onToggle={() => {
            if (openMenuId === row.original._id) {
              setOpenMenuId(null); // Close if clicking self
            } else {
              setOpenMenuId(row.original._id); // Open me (closes others automatically)
            }
          }}
          // 3. Logic to Close
          onClose={() => setOpenMenuId(null)}
        />
      </div>
    ),
  },
];
