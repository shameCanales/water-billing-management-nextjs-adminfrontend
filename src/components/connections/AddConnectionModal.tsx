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
import FormInput from "@/components/ui/form/FormInput";
import FormLabel from "@/components/ui/form/FormLabel";
import FormSelect from "../ui/form/FormSelect";
import RequiredFormFieldIndicator from "../ui/form/RequiredFormFieldIndicator";
import FormValidationErrorMsg from "../ui/form/FormValidationErrorMsg";
import Button from "../ui/Button";
import { useAddConnection } from "@/hooks/connections/useAddConnection";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const connectionSchema = z.object({
  consumer: z.string().min(1, "Consumer is required"),

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

  status: z.enum(["active", "disconnected"]),
});

type ConnectionFormValues = z.infer<typeof connectionSchema>;

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
      sortOrder: "asc",
      sortBy: "firstName",
    });

  const consumers = consumerData?.consumers || [];

  const {
    mutate: addConnection,
    isPending: isCreatingConnection,
    isError: errorCreatingConnection,
    error: createConnectionError,
  } = useAddConnection();

  const today = new Date().toLocaleDateString("en-CA");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(connectionSchema),
    defaultValues: {
      connectionDate: today,
      type: "residential",
      status: "active",
    },
  });

  function handleClose() {
    dispatch(uiActions.closeAddConnectionModal());
    reset();
  }

  const onSubmit = (data: ConnectionFormValues) => {
    addConnection(
      {
        ...data,
      },
      {
        onSuccess: () => handleClose(),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleClose()}
      title="Add New Connection"
      description="Fill in the details to create a new water connection"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="consumer">
              Consumer <RequiredFormFieldIndicator />
            </FormLabel>
            <div className="relative">
              <FormSelect
                id="consumer"
                disabled={isLoadingConsumers}
                {...register("consumer")}
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
              <FormValidationErrorMsg error={errors.consumer.message} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="meterNumber">
              Meter Number <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput
              id="meterNumber"
              type="number"
              placeholder="e.g. 100234"
              {...register("meterNumber")}
            />
            {errors.meterNumber && (
              <FormValidationErrorMsg error={errors.meterNumber.message} />
            )}
          </div>
        </div>

        {/* Row 2: Address */}
        <div>
          <FormLabel htmlFor="address">
            Address <RequiredFormFieldIndicator />
          </FormLabel>
          <FormInput
            id="address"
            placeholder="Complete address (Barangay, City, Province)"
            {...register("address")}
          />
          {errors.address && (
            <FormValidationErrorMsg error={errors.address.message} />
          )}
        </div>

        {/* Row 3: Date & Type */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <FormLabel htmlFor="connectionDate">Connection Date</FormLabel>
            <FormInput
              id="connectionDate"
              type="date"
              {...register("connectionDate")}
            />
            {errors.connectionDate && (
              <FormValidationErrorMsg error={errors.connectionDate.message} />
            )}
          </div>

          <div className="space-y-1">
            <FormLabel htmlFor="type">Type</FormLabel>

            <FormSelect id="type" {...register("type")}>
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
            </FormSelect>
          </div>
        </div>

        {/* Row 4: Status */}
        <div>
          <FormLabel htmlFor="status">Status</FormLabel>
          <FormSelect id="status" {...register("status")} defaultValue="active">
            <option value="active">Active</option>
            <option value="disconnected">Disconnected</option>
          </FormSelect>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="outline" onClick={() => handleClose()}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isCreatingConnection}>
            Create Connection
          </Button>
        </div>
      </form>
    </Modal>
  );
}
