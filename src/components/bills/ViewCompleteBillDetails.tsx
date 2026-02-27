"use client";

import { useDispatch, useSelector } from "react-redux";
import { Modal } from "@/components/ui/Modal";
import { Bill } from "@/types/bills";
import { formatCurrency, formatDate } from "@/lib/utils/format";
import { RootState } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";

interface ViewBillDetailsModalProps {
  billToView: Bill | null;
}

export default function ViewBillDetailsModal({
  billToView,
}: ViewBillDetailsModalProps) {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.ui.viewBillDetailsModalIsOpen
  );

  const handleClose = () => {
    dispatch(uiActions.closeViewBillDetailsModal());
  };

  if (!billToView) return null;

  const hasConnection = billToView.connection !== null;
  const consumer = hasConnection ? billToView.connection.consumer : null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bill Details"
      description="Complete information about this billing record"
    >
      <div className="space-y-6">
        {/* Consumer Information */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Consumer Information
          </h3>
          {hasConnection && consumer ? (
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <DetailItem
                label="Name"
                value={`${consumer.firstName} ${consumer.middleName || ""} ${consumer.lastName}`}
              />
              <DetailItem label="Email" value={consumer.email} />
              <DetailItem label="Mobile" value={consumer.mobileNumber} />
              <DetailItem label="Address" value={consumer.address} />
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-600 font-medium">Consumer Not Found</p>
              <p className="text-sm text-red-500">Deleted or record missing</p>
            </div>
          )}
        </section>

        {/* Connection Information */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Connection Details
          </h3>
          {hasConnection ? (
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <DetailItem
                label="Meter Number"
                value={billToView.connection.meterNumber.toString()}
              />
              <DetailItem
                label="Connection Type"
                value={billToView.connection.type}
                className="capitalize"
              />
              <DetailItem
                label="Service Address"
                value={billToView.connection.address}
              />
              <DetailItem
                label="Status"
                value={billToView.connection.status}
                className={
                  billToView.connection.status === "connected"
                    ? "text-green-600 font-medium capitalize"
                    : "text-red-600 font-medium capitalize"
                }
              />
              <DetailItem
                label="Connected Since"
                value={formatDate(billToView.connection.connectionDate)}
              />
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-600 font-medium">Connection Deleted</p>
            </div>
          )}
        </section>

        {/* Billing Information */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Billing Information
          </h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <DetailItem
              label="Billing Period"
              value={formatDate(billToView.monthOf, "MMMM yyyy")}
            />
            <DetailItem
              label="Due Date"
              value={formatDate(billToView.dueDate)}
            />
            <DetailItem
              label="Current Reading"
              value={`${billToView.meterReading} m³`}
            />
            <DetailItem
              label="Consumed Units"
              value={`${billToView.consumedUnits} m³`}
            />
            <DetailItem
              label="Rate per m³"
              value={formatCurrency(billToView.chargePerCubicMeter)}
            />
            <DetailItem
              label="Total Amount"
              value={formatCurrency(billToView.amount)}
              className="text-lg font-bold text-blue-600"
            />
          </div>
        </section>

        {/* Payment Status */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            Payment Status
          </h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <DetailItem
              label="Status"
              value={billToView.status}
              className={`capitalize font-semibold ${
                billToView.status === "paid"
                  ? "text-green-600"
                  : billToView.status === "overdue"
                    ? "text-red-600"
                    : "text-orange-600"
              }`}
            />
            <DetailItem
              label="Paid At"
              value={
                billToView.paidAt ? formatDate(billToView.paidAt) : "Not yet paid"
              }
            />
          </div>
        </section>

        {/* System Information */}
        <section>
          <h3 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
            System Information
          </h3>
          <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
            <DetailItem
              label="Bill ID"
              value={billToView._id}
              className="font-mono text-xs"
            />
            <DetailItem
              label="Created"
              value={formatDate(billToView.createdAt)}
            />
            <DetailItem
              label="Last Updated"
              value={formatDate(billToView.updatedAt)}
            />
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Print Statement
          </button>
        </div>
      </div>
    </Modal>
  );
}

// Helper component for consistent detail items
function DetailItem({
  label,
  value,
  className = "",
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div>
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-sm text-gray-900 ${className}`}>{value}</p>
    </div>
  );
}