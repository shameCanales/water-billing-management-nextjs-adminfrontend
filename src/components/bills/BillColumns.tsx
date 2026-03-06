"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Bill } from "@/types/bills";
import { ActionMenu, ActionMenuItem } from "@/components/ActionMenu";
import { Eye, Printer, CreditCard, Info } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";

export const getBillColumns = (
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void,
  onView: (bill: Bill) => void,
): ColumnDef<Bill>[] => {
  return [
    {
      accessorKey: "connection.consumer",
      header: "Consumer",
      cell: ({ row }) => {
        const consumer = row.original.connection?.consumer;

        if (!consumer) {
          return (
            <div className="flex flex-col">
              <span className="font-medium text-red-500 text-sm italic">
                Consumer Not Found
              </span>
              <span className="text-xs text-gray-400">
                deleted or record missing
              </span>
            </div>
          );
        }

        const { firstName, middleName, lastName, mobileNumber } = consumer;
        return (
          <div className="flex flex-col">
            <span className="font-medium text-gray-900 text-sm">
              {firstName} {middleName || ""} {lastName}
            </span>
            <span className="text-xs text-gray-500">{mobileNumber}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "connection.meterNumber",
      header: "Meter & Location",
      cell: ({ row }) => {
        const connection = row.original.connection;
        if (!connection)
          return (
            <span className="text-xs text-gray-400 italic">
              Connection deleted
            </span>
          );

        return (
          <div className="flex flex-col">
            <span className="font-bold text-gray-900 font-mono text-sm">
              {connection.meterNumber}
            </span>
            <span
              className="text-xs text-gray-400 truncate max-w-[180px]"
              title={connection.address}
            >
              {connection.address}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "monthOf",
      header: "Billing Period",
      cell: ({ getValue }) => (
        <span className="text-gray-600 text-sm font-medium">
          {format(new Date(getValue() as string), "MMM yyyy")}
        </span>
      ),
    },
    {
      id: "readings",
      header: "Readings (Prev → Curr)",
      cell: ({ row }) => {
        const { meterReading, consumedUnits } = row.original;
        const previous = meterReading - consumedUnits;
        return (
          <div className="flex items-center gap-1.5 text-sm">
            <span className="text-gray-400 font-mono">{previous}</span>
            <span className="text-gray-300">→</span>
            <span className="text-gray-900 font-bold font-mono">
              {meterReading}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "consumedUnits",
      header: "Usage",
      cell: ({ getValue, row }) => (
        <div className="flex flex-col">
          <span className="font-bold text-gray-900 text-sm">
            {row.original.consumedUnits} m³
          </span>
          <span className="text-[10px] text-gray-400">
            @ ₱{row.original.chargePerCubicMeter.toFixed(2)}/m³
          </span>
        </div>
      ),
    },
    {
      accessorKey: "billAmount",
      header: "Bill Amount",
      cell: ({ getValue }) => (
        <span className="text-gray-700 text-sm font-medium">
          ₱
          {(getValue() as number).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: "surchargeAmount",
      header: "Surcharge",
      cell: ({ row }) => {
        const amount = row.original.surchargeAmount;
        return (
          <span
            className={`text-sm ${amount > 0 ? "text-red-500 font-bold" : "text-gray-400"}`}
          >
            {amount > 0
              ? `+ ₱${amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              : "₱0.00"}
          </span>
        );
      },
    },
    {
      accessorKey: "totalAmount",
      header: "Total Due",
      cell: ({ getValue }) => (
        <span className="font-bold text-blue-600 text-sm">
          ₱
          {(getValue() as number).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}
        </span>
      ),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ getValue }) => (
        <span className="text-gray-600 font-medium text-sm">
          {format(new Date(getValue() as string), "MM/dd/yyyy")}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ getValue }) => {
        const status = getValue() as string;
        return <StatusBadge status={status} />;
      },
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onView(row.original)}
            className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <Info size={18} />
          </button>

          <ActionMenu
            isOpen={openMenuId === row.original._id}
            onToggle={() =>
              setOpenMenuId(
                openMenuId === row.original._id ? null : row.original._id,
              )
            }
            onClose={() => setOpenMenuId(null)}
          >
            <ActionMenuItem onClick={() => onView(row.original)}>
              <Eye size={14} /> View Details
            </ActionMenuItem>

            {row.original.status !== "paid" && (
              <ActionMenuItem
                onClick={() => console.log("Pay", row.original._id)}
              >
                <CreditCard size={14} /> Record Payment
              </ActionMenuItem>
            )}

            <ActionMenuItem onClick={() => window.print()}>
              <Printer size={14} /> Print Statement
            </ActionMenuItem>
          </ActionMenu>
        </div>
      ),
    },
  ];
};
