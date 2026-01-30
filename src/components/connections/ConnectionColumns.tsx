"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Connection } from "@/types/connections";
import { ActionMenu, ActionMenuItem } from "@/components/ActionMenu";
// import { ActionMenu, ActionMenuItem } from "../ActionMenu";

import { Eye, Edit, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";

export const getConnectionColumns = (
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void,
  onEdit: (connection: Connection) => void,
  onDelete: (connection: Connection) => void, // also check here the problem
): ColumnDef<Connection>[] => {


  return [
    {
      accessorKey: "meterNumber",
      header: "Meter Number",
      cell: ({ getValue }) => (
        <span className="font-bold text-gray-900 font-mono text-sm">
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "consumer",
      header: "Consumer",
      cell: ({ row }) => {
        const consumer = row.original.consumer;

        if (!consumer) {
          return (
            <div className="flex flex-col">
              <span className="font-medium text-red-500 text-sm italic">
                Consumer Not Found
              </span>
              <span className="text-xs text-gray-400">
                not existing or might be deleted
              </span>
            </div>
          );
        }

        const { firstName, middleName, lastName, email } =
          row.original.consumer;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-sm">
              {firstName} {middleName} {lastName}
            </span>
            <span className="text-xs text-gray-500">{email}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "address",
      header: "Address",
      cell: ({ getValue }) => (
        <span
          className="text-gray-600 text-sm truncate max-w-[200px] block"
          title={getValue() as string}
        >
          {getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ getValue }) => {
        const type = getValue() as string;

        // Matching the styling from your mobile view
        const styles = {
          residential: "bg-blue-50 text-blue-700 border-blue-200",
          commercial: "bg-purple-50 text-purple-700 border-purple-200",
        };

        const style =
          styles[type as keyof typeof styles] ||
          "bg-gray-50 text-gray-600 border-gray-200";

        return (
          <span
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${style} uppercase tracking-wide`}
          >
            {type}
          </span>
        );
      },
    },
    {
      accessorKey: "connectionDate",
      header: "Connected",
      cell: ({ getValue }) => (
        <span className="text-gray-600 font-medium text-sm">
          {new Date(getValue() as string).toLocaleDateString()}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => <StatusBadge status={getValue() as string} />,
    },

    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        // ✅ NO <td> here - just return the div directly
        <div className="flex justify-end">
          <ActionMenu
            isOpen={openMenuId === row.original._id}
            onToggle={() =>
              setOpenMenuId(
                openMenuId === row.original._id ? null : row.original._id,
              )
            }
            onClose={() => setOpenMenuId(null)}
          >
            <ActionMenuItem
              className="text-gray-700"
              onClick={() => {
                console.log("View", row.original._id);
                setOpenMenuId(null);
              }}
            >
              <Eye size={14} /> View Details
            </ActionMenuItem>

            <ActionMenuItem
              className="text-gray-700"
              onClick={() => {
                onEdit(row.original);
                setOpenMenuId(null);
              }}
            >
              <Edit size={14} /> Edit Connection
            </ActionMenuItem>

            <ActionMenuItem
              className="text-red-600 hover:bg-red-50"
              onClick={() => {
                console.log("🔴 DELETE CLICKED", row.original);
                onDelete(row.original);
                setOpenMenuId(null);
              }}
            >
              <Trash2 size={14} /> Delete Connection
            </ActionMenuItem>
          </ActionMenu>
        </div>
      ),
    },
  ];
};
