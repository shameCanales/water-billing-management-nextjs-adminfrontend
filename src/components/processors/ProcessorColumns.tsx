"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Processor, ProcessorStatus } from "@/types/processor";
import { StatusBadge } from "@/components/ui/StatusBadge";
import {
  Info,
  Shield,
  UserCog,
  UserLock,
  UserCheck,
  Edit,
  Trash2,
} from "lucide-react";
import { ActionMenuItem, ActionMenu } from "../ActionMenu";

export const getProcessorColumns = (
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void,
  onEdit: (processor: Processor) => void,
  onDelete: (processor: Processor) => void,
  onUpdateProcessorStatus: (id: string, status: ProcessorStatus) => void,
): ColumnDef<Processor>[] => [
  {
    accessorKey: "lastName",
    header: "Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        {row.original.role === "manager" ? (
          <Shield size={22} className="text-blue-500 mr-1" />
        ) : (
          <UserCog size={22} className="text-gray-500 mr-1" />
        )}
        <div className="font-medium text-gray-900 capitalize">
          {row.original.firstName}{" "}
          {row.original.middleName ? row.original.middleName : ""}{" "}
          {row.original.lastName}
        </div>
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
    accessorKey: "role",
    header: "Role",
    cell: ({ getValue }) => (
      <StatusBadge status={getValue() as string} capsLock={true} />
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
          {new Intl.DateTimeFormat("en-US", {
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

        <ActionMenu
          isOpen={openMenuId === row.original._id}
          onToggle={() => {
            if (openMenuId === row.original._id) {
              setOpenMenuId(null);
            } else {
              setOpenMenuId(row.original._id);
            }
          }}
          onClose={() => setOpenMenuId(null)}
        >
          <ActionMenuItem
            className="text-gray-700"
            onClick={() => {
              onEdit(row.original);
              setOpenMenuId(null);
            }}
          >
            <Edit size={14} /> Edit Processor
          </ActionMenuItem>

          <ActionMenuItem
            className="text-gray-700"
            onClick={() => {
              const status =
                row.original.status === "active" ? "restricted" : "active";
              onUpdateProcessorStatus(row.original._id, status);
              setOpenMenuId(null);
            }}
          >
            {row.original.status === "active" ? (
              <>
                <UserLock size={14} />
                <p>Restrict</p>
              </>
            ) : (
              <>
                <UserCheck size={14} />
                <p>Activate</p>
              </>
            )}
          </ActionMenuItem>

          <ActionMenuItem
            className="text-red-600 hover:bg-red-50"
            onClick={() => {
              onDelete(row.original);
              setOpenMenuId(null);
            }}
          >
            <Trash2 size={14} /> Delete Processor
          </ActionMenuItem>
        </ActionMenu>
      </div>
    ),
  },
];
