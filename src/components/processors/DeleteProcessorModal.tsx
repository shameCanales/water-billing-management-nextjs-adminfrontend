"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useDeleteProcessor } from "@/hooks/processors/useDeleteProcessor";
import { Modal } from "../ui/Modal";
import type { Processor } from "@/types/processor";
import { AlertTriangle } from "lucide-react";

interface DeleteProcessorModalProps {
  processorToDelete: Processor | null;
}

export default function DeleteProcessorModal({
  processorToDelete,
}: DeleteProcessorModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const isOpen = useSelector(
    (state: RootState) => state.ui.deleteProcessorModalIsOpen,
  );

  const { mutate: deleteProcessor, isPending: isDeleting } =
    useDeleteProcessor();

  const handleClose = () => {
    dispatch(uiActions.closeDeleteProcessorModal());
  };

  const handleDelete = () => {
    if (!processorToDelete) return;

    deleteProcessor(processorToDelete._id, {
      onSuccess: () => {
        handleClose();
      },
      onError: (error) => {
        console.error("Failed to delete processor:", error);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Processor"
      description="This action is permanent and will revoke all system access for this user."
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-red-900">
              Critical Action
            </h4>
            <p className="text-sm text-red-700 mt-1">
              You are about to delete the {processorToDelete?.role} account:{" "}
              <strong>
                {processorToDelete?.firstName} {processorToDelete?.lastName}
              </strong>
              . They will no longer be able to log in or manage billing records.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
