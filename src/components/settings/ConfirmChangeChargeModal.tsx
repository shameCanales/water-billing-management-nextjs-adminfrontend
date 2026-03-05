"use client";

import { Modal } from "../ui/Modal";
import { AlertCircle, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

interface ConfirmSettingChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  newAmount: number | null;
  currentAmount?: number;
  isUpdating: boolean;
  settingName: string;
  unit: "₱" | "%";
}

export default function ConfirmSettingChangeModal({
  isOpen,
  onClose,
  onConfirm,
  newAmount,
  currentAmount,
  isUpdating,
  settingName,
  unit,
}: ConfirmSettingChangeModalProps) {
  
  const formatValue = (val: number | null | undefined) => {
    const num = val ?? 0;
    // For surchargeRate, backend needs a decimal (0.2), UI shows % (20)
    const formatted = num.toLocaleString(undefined, { minimumFractionDigits: 2 });
    return unit === "₱" ? `₱${formatted}` : `${num}%`;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirm Setting Change"
      description={`Review the updates to the ${settingName.toLowerCase()} configuration.`}
    >
      <div className="space-y-6">
        {/* Visual Comparison Section */}
        <div className="grid grid-cols-1 gap-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div className="space-y-1">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Current {settingName}</p>
              <p className="text-lg font-bold text-gray-600 line-through decoration-gray-300">
                {formatValue(currentAmount)}
              </p>
            </div>

            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-50 text-blue-600">
              <ArrowRight size={20} />
            </div>

            <div className="space-y-1 text-right">
              <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider">New {settingName}</p>
              <p className="text-xl font-black text-gray-900">
                {formatValue(newAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Warning Alert */}
        <div className="flex items-start gap-3 p-4 bg-amber-50/50 rounded-xl border border-amber-100">
          <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-amber-900">Verification Required</h4>
            <p className="text-xs leading-relaxed text-amber-700">
              Applying this change will update the system-wide <strong>{settingName}</strong>. 
              All new billing calculations generated from this point forward will utilize this updated value.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isUpdating}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            isLoading={isUpdating}
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
          >
            Confirm & Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
}