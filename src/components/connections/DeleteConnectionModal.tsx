"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useDeleteConnection } from "@/hooks/connections/useDeleteConnection";
import { Modal } from "../ui/Modal";
import { Connection } from "@/types/connections";
import { AlertTriangle } from "lucide-react";

interface DeleteConnectionModalProps {
  connectionToDelete: Connection | null;
}

export default function DeleteConnectionModal({
  connectionToDelete,
}: DeleteConnectionModalProps) {
  const dispatch = useDispatch<AppDispatch>();

  const isOpen = useSelector(
    (state: RootState) => state.ui.deleteConnectionModalIsOpen,
  );

  const { mutate: deleteConnection, isPending: deletingConnection } =
    useDeleteConnection();

  const handleClose = () => {
    dispatch(uiActions.closeDeleteConnectionModal());
  };

  const handleDelete = () => {
    if (!connectionToDelete) return;

    deleteConnection(connectionToDelete._id, {
      onSuccess: () => {
        handleClose();
      },
      onError: (error) => {
        console.error("Failed to delete:", error);
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Delete Connection"
      description="Are you sure you want to delete this Connection? This action cannot be undone."
    >
      <div className="space-y-6">
        <div className="flex items-start gap-4 p-4 bg-red-50 rounded-lg border border-red-100">
          <div className="p-2 bg-white rounded-full shadow-sm">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h4 className="text-sm font-medium text-red-900">Warning</h4>
            <p className="text-sm text-red-700 mt-1">
              You are about to delete{" "}
              <strong>
                Meter No. {connectionToDelete?.meterNumber} from{" "}
                {connectionToDelete?.consumer?.lastName}
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
            disabled={deletingConnection}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {deletingConnection ? "Deleting..." : "Delete Connection"}
          </button>
        </div>
      </div>
    </Modal>
  );
}
