"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Consumer } from "@/types/consumers";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Info } from "lucide-react";
import { ActionMenuItem, ActionMenu } from "./ActionMenu";
import { Eye, Edit, UserX, Trash2 } from "lucide-react";

// CHANGED: Export a function instead of a constant array
export const getColumns = (
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void
): ColumnDef<Consumer>[] => [
  {
    accessorKey: "lastName", // should match from data fields received from api?
    header: "Name",
    cell: ({ row }) => (
      <div className="font-medium text-gray-900">
        {row.original.firstName}{" "}
        {row.original.middleName ? row.original.middleName : ""}{" "}
        {row.original.lastName}
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
      return (
        <span className="text-gray-600">
          {new Intl.DateTimeFormat("en-Us", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          }).format(date)}
        </span>
      );
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
        >
          {/* ✅ Specific Actions defined here using the reusable wrapper */}
          <ActionMenuItem
            className="text-gray-700"
            onClick={() => console.log("View", row.original._id)}
          >
            <Eye size={14} /> View Details
          </ActionMenuItem>

          <ActionMenuItem
            className="text-gray-700"
            onClick={() => console.log("Edit", row.original._id)}
          >
            <Edit size={14} /> Edit Consumer
          </ActionMenuItem>

          <ActionMenuItem
            className="text-gray-700"
            onClick={() => console.log("Suspend", row.original._id)}
          >
            <UserX size={14} /> Suspend Account
          </ActionMenuItem>

          <ActionMenuItem
            className="text-red-600 hover:bg-red-50"
            onClick={() => console.log("Delete", row.original._id)}
          >
            <Trash2 size={14} /> Delete Consumer
          </ActionMenuItem>
        </ActionMenu>
      </div>
    ),
  },
];
