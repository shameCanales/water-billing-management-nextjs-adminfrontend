"use client";

import { Modal } from "../ui/Modal";
import { AlertCircle } from "lucide-react";

interface ConfirmChangeChargeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newAmount: number | null;
  currentAmount?: number;
  isUpdating: boolean;
}

export default function ConfirmChangeChargeModal({
  isOpen,
  onClose,
  onConfirm,
  newAmount,
  currentAmount,
  isUpdating,
}: ConfirmChangeChargeModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Rate Change"
      description="Are you sure you want to update the default charge rate?"
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <AlertCircle className="w-5 h-5 text-yellow-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-yellow-900">Please Verify</h4>
            <p className="text-sm text-yellow-700 mt-1">
              You are about to change the default charge from{" "}
              <strong>₱ {currentAmount?.toFixed(2) ?? "0.00"}</strong> to{" "}
              <strong>₱ {newAmount?.toFixed(2) ?? "0.00"}</strong>. All new bills created from now on will use this rate.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isUpdating}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isUpdating ? "Saving..." : "Confirm Change"}
          </button>
        </div>
      </div>
    </Modal>
  );
}