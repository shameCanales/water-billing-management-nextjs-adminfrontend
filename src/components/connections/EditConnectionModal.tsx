"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { User, Info } from "lucide-react";

// Store & Hooks
import { RootState, AppDispatch } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useEditConnection } from "@/hooks/connections/useEditConnection";

// Types
import { Connection } from "@/types/connections";

// UI Components
import { Modal } from "../ui/Modal";
import FormLabel from "../ui/form/FormLabel";
import FormInput from "../ui/form/FormInput";
import FormSelect from "../ui/form/FormSelect";
import FormValidationErrorMsg from "../ui/form/FormValidationErrorMsg";
import Button from "../ui/Button";
import RequiredFormFieldIndicator from "../ui/form/RequiredFormFieldIndicator";

// --- 1. Zod Schema ---
const editConnectionSchema = z.object({
  meterNumber: z.coerce
    .number()
    .int("Meter number must be an integer")
    .positive("Meter number must be positive"),

  address: z.string().min(1, "Address is required"),

  connectionDate: z
    .string()
    .refine((date) => new Date(date).toString() !== "Invalid Date", {
      message: "A valid connection date is required",
    }),

  type: z.enum(["residential", "commercial"]),
  status: z.enum(["connected", "disconnected"]),
});

// Infer the type for use in onSubmit
type EditConnectionFormValues = z.infer<typeof editConnectionSchema>;

interface EditConnectionModalProps {
  connectionToEdit: Connection | null;
}

export default function EditConnectionModal({
  connectionToEdit,
}: EditConnectionModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector(
    (state: RootState) => state.ui.editConnectionModalIsOpen,
  );

  const { mutate: editConnection, isPending: isEditingConnection } =
    useEditConnection();

  // ✅ FIX: Removed <EditConnectionFormValues> generic.
  // We let useForm infer the types directly from the resolver to avoid the 'unknown' vs 'number' conflict.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm({
    resolver: zodResolver(editConnectionSchema),
    defaultValues: {
      meterNumber: 0,
      address: "",
      connectionDate: "",
      type: "residential" as const,
      status: "connected" as const,
    },
  });

  // --- 2. Pre-fill Form Data ---
  useEffect(() => {
    if (isOpen && connectionToEdit) {
      reset({
        meterNumber: connectionToEdit.meterNumber,
        address: connectionToEdit.address,
        // Format ISO date (2024-03-10T...) to YYYY-MM-DD for HTML input
        connectionDate: connectionToEdit.connectionDate
          ? new Date(connectionToEdit.connectionDate)
              .toISOString()
              .split("T")[0]
          : "",
        type: connectionToEdit.type,
        status: connectionToEdit.status,
      });
    }
  }, [isOpen, connectionToEdit, reset]);

  function handleClose() {
    reset();
    dispatch(uiActions.closeEditConnectionModal());
  }

  const onSubmit = (data: EditConnectionFormValues) => {
    if (!connectionToEdit) return;

    editConnection(
      { id: connectionToEdit._id, data },
      {
        onSuccess: () => {
          handleClose();
        },
      },
    );
  };

  const consumerName = connectionToEdit?.consumer
    ? `${connectionToEdit.consumer.firstName} ${connectionToEdit.consumer.lastName}`
    : "Unknown Consumer";

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Connection"
      description={`Update details for Meter No. ${connectionToEdit?.meterNumber}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* --- Read-Only Consumer Display --- */}
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start gap-3">
          <div className="p-2 bg-white rounded-full text-blue-600 shadow-sm shrink-0">
            <User size={18} />
          </div>
          <div>
            <p className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-0.5">
              Current Owner
            </p>
            <p className="text-sm font-medium text-blue-900">{consumerName}</p>
            <div className="flex items-center gap-1.5 mt-1 text-xs text-blue-600/80">
              <Info size={12} />
              <span>
                Transfer of ownership is currently not supported or not allowed
                to change consumer.{" "}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Meter Number */}
          <div>
            <FormLabel htmlFor="meterNumber">
              Meter Number <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput
              id="meterNumber"
              type="number"
              {...register("meterNumber")}
            />
            {errors.meterNumber && (
              <FormValidationErrorMsg
                error={errors.meterNumber.message as string}
              />
            )}
          </div>

          {/* Connection Date */}
          <div>
            <FormLabel htmlFor="connectionDate">
              Connection Date <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput
              id="connectionDate"
              type="date"
              {...register("connectionDate")}
            />
            {errors.connectionDate && (
              <FormValidationErrorMsg
                error={errors.connectionDate.message as string}
              />
            )}
          </div>
        </div>

        {/* Address */}
        <div>
          <FormLabel htmlFor="address">
            Address <RequiredFormFieldIndicator />
          </FormLabel>
          <FormInput id="address" {...register("address")} />
          {errors.address && (
            <FormValidationErrorMsg error={errors.address.message as string} />
          )}
        </div>

        {/* Type & Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="type">Type</FormLabel>
            <FormSelect id="type" {...register("type")}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </FormSelect>
            {errors.type && (
              <FormValidationErrorMsg error={errors.type.message as string} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="status">Status</FormLabel>
            <FormSelect id="status" {...register("status")}>
              <option value="connected">Connected</option>
              <option value="disconnected">Disconnected</option>
            </FormSelect>
            {errors.status && (
              <FormValidationErrorMsg error={errors.status.message as string} />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          <Button
            type="submit"
            disabled={isEditingConnection || !isDirty}
            isLoading={isEditingConnection}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
