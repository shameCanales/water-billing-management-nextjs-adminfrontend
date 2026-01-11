"use client";

import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

// Store & Hooks
import { RootState } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useGetAllConsumers } from "@/hooks/consumers/useGetAllConsumers";

// UI Components
import { Modal } from "@/components/ui/Modal";
import FormInput from "@/components/ui/FormInput";
import FormLabel from "@/components/ui/FormLabel";
import FormSelect from "../ui/FormSelect";
import { useAddConnection } from "@/hooks/connections/useAddConnection";

interface AddConnectionForm {
  consumer: string;
  meterNumber: string;
  address: string;
  connectionDate: string;
  type: "residential" | "commercial";
  status: "active" | "disconnected";
}

export default function AddConnectionModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.ui.addConnectionModalIsOpen
  );

  const { data: consumerData, isLoading: isLoadingConsumers } =
    useGetAllConsumers({
      page: 1,
      limit: 100,
      status: "active",
    });

  const consumers = consumerData?.consumers || [];

  const { mutate: addConnection, isPending } = useAddConnection();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddConnectionForm>();

  const onClose = () => {
    dispatch(uiActions.closeAddConnectionModal());
    reset();
  };

  const onSubmit = (data: AddConnectionForm) => {
    addConnection(
      {
        ...data,
        meterNumber: Number(data.meterNumber), // Backend expects number
      },
      {
        onSuccess: () => onClose(),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add New Connection"
      description="Fill in the details to create a new water connection"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Row 1: Consumer & Meter Number */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <FormLabel htmlFor="consumer">Consumer *</FormLabel>
            <div className="relative">
              <FormSelect
                id="consumer"
                disabled={isLoadingConsumers}
                {...register("consumer", { required: "Consumer is required" })}
              >
                <option value="">Select consumer</option>
                {consumers.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.firstName} {c.lastName}
                  </option>
                ))}
              </FormSelect>
              {isLoadingConsumers && (
                <div className="absolute right-8 top-2.5">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                </div>
              )}
            </div>
            {errors.consumer && (
              <span className="text-xs text-red-500">
                {errors.consumer.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <FormLabel htmlFor="meterNumber">Meter Number *</FormLabel>
            <FormInput
              id="meterNumber"
              type="number"
              placeholder="e.g. 100234"
              {...register("meterNumber", {
                required: "Meter number is required",
              })}
            />
            {errors.meterNumber && (
              <span className="text-xs text-red-500">
                {errors.meterNumber.message}
              </span>
            )}
          </div>
        </div>

        {/* Row 2: Address */}
        <div className="space-y-1">
          <FormLabel htmlFor="address">Address *</FormLabel>
          <FormInput
            id="address"
            placeholder="Complete address (Barangay, City, Province)"
            {...register("address", { required: "Address is required" })}
          />
          {errors.address && (
            <span className="text-xs text-red-500">
              {errors.address.message}
            </span>
          )}
        </div>

        {/* Row 3: Date & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <FormLabel htmlFor="connectionDate">Connection Date *</FormLabel>
            <FormInput
              id="connectionDate"
              type="date"
              {...register("connectionDate", { required: "Date is required" })}
            />
            {errors.connectionDate && (
              <span className="text-xs text-red-500">
                {errors.connectionDate.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <FormLabel htmlFor="type">Type *</FormLabel>

            <FormSelect id="type" {...register("type", { required: true })}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </FormSelect>
          </div>
        </div>

        {/* Row 4: Status */}
        <div className="space-y-1">
          <FormLabel htmlFor="status">Status *</FormLabel>
          <FormSelect
            id="status"
            {...register("status", { required: true })}
            defaultValue="active"
          >
            <option value="active">Active</option>
            <option value="disconnected">Disconnected</option>
          </FormSelect>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            Create Connection
          </button>
        </div>
      </form>
    </Modal>
  );
}
