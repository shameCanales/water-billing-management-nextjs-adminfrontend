"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Bill, BillSummary } from "@/types/bills";
import { ActionMenu, ActionMenuItem } from "@/components/ActionMenu";
import { Eye, Printer, CreditCard, Info } from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { format } from "date-fns";
import { AuditTrailContent } from "./AuditTrailContent";

export const getBillColumns = (
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void,
  onView: (bill: BillSummary) => void,
): ColumnDef<BillSummary>[] => {
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
              <span
                className={`${connection.type === "residential" ? " text-blue-700" : " text-purple-500"} mr-1`}
              >
                {connection.type[0].toLocaleUpperCase()}
              </span>
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
          <div className="group relative">
            <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full hover:bg-blue-50 transition-colors">
              <Info size={18} />
            </button>

      
            <div className="invisible group-hover:visible absolute right-full mr-2 bottom-0 z-[9999] w-max min-w-[220px] bg-white border border-gray-200 shadow-2xl rounded-xl p-4 transition-opacity">
              <h3 className="text-[10px] font-bold border-b border-gray-100 pb-2 mb-3 text-gray-400 uppercase tracking-widest">
                Audit History
              </h3>
              <div className="whitespace-normal">
                <AuditTrailContent bill={row.original} />
              </div>

             
              <div className="absolute bottom-2 -right-1.5 w-3 h-3 bg-white border-t border-r border-gray-200 rotate-45"></div>
            </div>
          </div>

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
