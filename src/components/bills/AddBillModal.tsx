"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Store & Hooks
import { RootState } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useAddBill } from "@/hooks/bills/useAddBill";
import { useGetAllConnections } from "@/hooks/connections/useGetAllConnections"; // You'll need this hook

// UI Components
import { Modal } from "@/components/ui/Modal";
import FormInput from "@/components/ui/form/FormInput";
import FormLabel from "@/components/ui/form/FormLabel";
import FormSelect from "../ui/form/FormSelect";
import RequiredFormFieldIndicator from "../ui/form/RequiredFormFieldIndicator";
import FormValidationErrorMsg from "../ui/form/FormValidationErrorMsg";
import Button from "../ui/Button";

const billSchema = z.object({
  connection: z.string().min(1, "Connection/Meter is required"),

  monthOf: z.string().min(1, "Billing month is required"),

  dueDate: z.string().min(1, "Due date is required"),

  meterReading: z.number().min(0, "Meter reading cannot be negative"),

  status: z.enum(["paid", "unpaid", "overdue"]),
});

type BillFormValues = z.infer<typeof billSchema>;

export default function AddBillModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector((state: RootState) => state.ui.addBillModalIsOpen);

  // Fetch connections to populate the dropdown
  const { data: connectionData, isLoading: isLoadingConnections } =
    useGetAllConnections({
      status: "connected",
      limit: 100,
    });

  const connections = connectionData?.connections || [];

  const { mutate: addBill, isPending: isCreatingBill } = useAddBill();

  // Default dates
  const firstDayOfMonth = new Date(
    new Date().getFullYear(),
    new Date().getMonth(),
    1,
  )
    .toISOString()
    .split("T")[0];

  const defaultDueDate = new Date();
  defaultDueDate.setDate(defaultDueDate.getDate() + 15); // Default 15 days from now

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BillFormValues>({
    resolver: zodResolver(billSchema),
    defaultValues: {
      monthOf: firstDayOfMonth,
      dueDate: defaultDueDate.toISOString().split("T")[0],
      status: "unpaid",
    },
  });

  function handleClose() {
    dispatch(uiActions.closeAddBillModal());
    reset();
  }

  const onSubmit = (data: BillFormValues) => {
    // Format dates to ISO strings for the backend
    const payload = {
      ...data,
      monthOf: new Date(data.monthOf).toISOString(),
      dueDate: new Date(data.dueDate).toISOString(),
    };

    addBill(payload, {
      onSuccess: () => handleClose(),
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Create New Bill"
      description="Enter the meter reading and billing period for this connection."
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Connection Selection */}
        <div>
          <FormLabel htmlFor="connection">
            Select Connection <RequiredFormFieldIndicator />
          </FormLabel>
          <div className="relative">
            <FormSelect
              id="connection"
              disabled={isLoadingConnections}
              {...register("connection")}
            >
              <option value="">Select a meter/consumer</option>
              {connections.map((conn) => (
                <option
                  key={conn._id}
                  value={conn._id}
                  disabled={!conn.consumer}
                >
                  {conn.consumer
                    ? `${conn.consumer.lastName}, ${conn.consumer.firstName} (Meter: ${conn.meterNumber})`
                    : `Consumer Not Found - Meter: ${conn.meterNumber} (Deleted)`}
                </option>
              ))}
            </FormSelect>

            {isLoadingConnections && (
              <div className="absolute right-8 top-2.5">
                <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
              </div>
            )}
          </div>
          {errors.connection && (
            <FormValidationErrorMsg error={errors.connection.message} />
          )}
        </div>

        {/* Row: Month and Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="monthOf">
              Billing Month <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput id="monthOf" type="date" {...register("monthOf")} />
            {errors.monthOf && (
              <FormValidationErrorMsg error={errors.monthOf.message} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="dueDate">
              Due Date <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput id="dueDate" type="date" {...register("dueDate")} />
            {errors.dueDate && (
              <FormValidationErrorMsg error={errors.dueDate.message} />
            )}
          </div>
        </div>

        {/* Row: Meter Reading and Status */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="meterReading">
              Current Meter Reading <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput
              id="meterReading"
              type="number"
              step="1"
              placeholder="0"
              {...register("meterReading", { valueAsNumber: true })}
            />
            {errors.meterReading && (
              <FormValidationErrorMsg error={errors.meterReading.message} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="status">Initial Status</FormLabel>
            <FormSelect id="status" {...register("status")}>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
            </FormSelect>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isCreatingBill}>
            Generate Bill
          </Button>
        </div>
      </form>
    </Modal>
  );
}
