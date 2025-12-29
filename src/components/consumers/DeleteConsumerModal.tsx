"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useDeleteConsumer } from "@/hooks/consumers/useDeleteConsumer";
import { Modal } from "../ui/Modal";
import { Consumer } from "@/types/consumers";
import { AlertTriangle } from "lucide-react";

interface DeleteConsumerModalProps {
  consumerToDelete: Consumer | null;
}

export default function DeleteConsumerModal({
  consumerToDelete,
}: DeleteConsumerModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  // Make sure you add 'deleteConsumerModalIsOpen' to your Redux uiSlice!
  const isOpen = useSelector(
    (state: RootState) => state.ui.deleteConsumerModalIsOpen
  );

  const { mutate: deleteConsumer, isPending } = useDeleteConsumer();

  const handleClose = () => {
    dispatch(uiActions.closeDeleteConsumerModal());
  };

  const handleDelete = () => {
    if (!consumerToDelete) return;

    deleteConsumer(consumerToDelete._id, {
      onSuccess: () => {
        handleClose();
        // toast.success("Consumer deleted successfully");
      },
      onError: (error) => {
        console.error("Failed to delete:", error);
        // toast.error("Failed to delete consumer");
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Consumer"
      description="Are you sure you want to delete this account? This action cannot be undone."
    >
      <div className="space-y-6">
        {/* Warning Icon & Text */}
        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-900">Warning</h4>
            <p className="text-sm text-red-700 mt-1">
              You are about to delete{" "}
              <strong>
                {consumerToDelete?.firstName} {consumerToDelete?.lastName}
              </strong>
              . All associated data (bills, history) might be affected.
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={isPending}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? "Deleting..." : "Delete Consumer"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
