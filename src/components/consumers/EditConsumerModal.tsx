"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useEditConsumer } from "@/hooks/consumers/useEditConsumer";
import { Modal } from "../ui/Modal";
import { Consumer } from "@/types/consumers";
import FormLabel from "../ui/form/FormLabel";
import FormInput from "../ui/form/FormInput";
import FormSelect from "../ui/form/FormSelect";
import FormValidationErrorMsg from "../ui/form/FormValidationErrorMsg";
import Button from "../ui/Button";

// --- 1. Zod Schema (Matches Backend Exactly) ---
const editConsumerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "First name must be less than 40 characters")
    .optional(),
  middleName: z.string().max(40).optional().or(z.literal("")),
  lastName: z.string().min(1, "Last name is required").max(40).optional(),
  email: z.string().email("Invalid email address").optional(),
  birthDate: z.string().optional(),
  mobileNumber: z
    .string()
    .regex(/^09\d{9}$/, "Must be a valid PH mobile number")
    .optional(),
  address: z.string().min(5).max(100).optional(),
  status: z.enum(["active", "suspended"]).optional(),
  password: z.string().min(6).optional().or(z.literal("")),
});

type EditConsumerFormValues = z.infer<typeof editConsumerSchema>;

interface EditConsumerModalProps {
  consumerToEdit: Consumer | null;
}

export default function EditConsumerModal({
  consumerToEdit,
}: EditConsumerModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector(
    (state: RootState) => state.ui.editConsumerModalIsOpen
  );

  const {
    mutate: editConsumer,
    isPending: isEditingConsumer,
    isError: errorEditingConsumer,
    error: editConsumerError,
  } = useEditConsumer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditConsumerFormValues>({
    resolver: zodResolver(editConsumerSchema),
  });

  // --- 2. Pre-fill Form when Modal Opens ---
  useEffect(() => {
    if (isOpen && consumerToEdit) {
      reset({
        firstName: consumerToEdit.firstName,
        middleName: consumerToEdit.middleName || "",
        lastName: consumerToEdit.lastName,
        email: consumerToEdit.email,
        // Format date to YYYY-MM-DD for date input
        birthDate: consumerToEdit.birthDate
          ? new Date(consumerToEdit.birthDate).toISOString().split("T")[0]
          : "",
        mobileNumber: consumerToEdit.mobileNumber,
        address: consumerToEdit.address,
        status: consumerToEdit.status,
        password: "", // Always start blank
      });
    }
  }, [isOpen, consumerToEdit, reset]);

  function handleClose() {
    reset();
    dispatch(uiActions.closeEditConsumerModal());
  }

  const onSubmit = (data: EditConsumerFormValues) => {
    if (!consumerToEdit) return;

    // Filter out empty strings/undefined to send partial updates
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "" && v !== undefined)
    );

    editConsumer(
      { id: consumerToEdit._id, data: cleanData },
      {
        onSuccess: () => {
          handleClose();
        },
        onError: (err) => console.error(err),
      }
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Consumer"
      description={`Update details for ${consumerToEdit?.firstName} ${consumerToEdit?.lastName}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <FormInput id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <FormValidationErrorMsg error={errors.firstName.message} />
            )}
          </div>

          {/* Middle Name */}
          <div>
            <FormLabel htmlFor="middleName">Middle Name</FormLabel>
            <FormInput id="middleName" {...register("middleName")} />
            {errors.middleName && (
              <FormValidationErrorMsg error={errors.middleName.message} />
            )}
          </div>

          {/* Last Name */}
          <div>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <FormInput id="lastName" {...register("lastName")} />

            {errors.lastName && (
              <FormValidationErrorMsg error={errors.lastName.message} />
            )}
          </div>

          {/* Email */}
          <div>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput id="email" type="email" {...register("email")} />

            {errors.email && (
              <FormValidationErrorMsg error={errors.email.message} />
            )}
          </div>

          {/* Birth Date */}
          <div>
            <FormLabel htmlFor="birthDate">Birth Date</FormLabel>
            <FormInput id="birthDate " type="date" {...register("birthDate")} />

            {errors.birthDate && (
              <FormValidationErrorMsg error={errors.birthDate.message} />
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <FormLabel htmlFor="mobileNumber">Mobile Number</FormLabel>
            <FormInput
              id="mobileNumber"
              maxLength={11}
              {...register("mobileNumber")}
            />

            {errors.mobileNumber && (
              <FormValidationErrorMsg error={errors.mobileNumber.message} />
            )}
          </div>

          {/* Address - Full Width */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <FormLabel htmlFor="address">Address</FormLabel>
            <FormInput id="address" {...register("address")} />

            {errors.address && (
              <FormValidationErrorMsg error={errors.address.message} />
            )}
          </div>

          {/* Status */}
          <div>
            <FormLabel htmlFor="status">Status</FormLabel>

            <FormSelect id="status" {...register("status")}>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </FormSelect>
          </div>

          {/* Password (Optional) */}
          <div>
            <FormLabel htmlFor="password">
              Password{" "}
              <span className="text-gray-400 font-normal">(Optional)</span>
            </FormLabel>

            <FormInput
              id="password"
              type="password"
              placeholder="Leave blank to keep current"
              {...register("password")}
            />

            {errors.password && (
              <FormValidationErrorMsg error={errors.password.message} />
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>

          {/* isDirty: true(dirty) - changed at least one field, false(clean) - unchanged valuess  */}
          <Button
            type="submit"
            disabled={isEditingConsumer || !isDirty}
            isLoading={isEditingConsumer}
          >
            Edit Consumer
          </Button>
        </div>
      </form>
    </Modal>
  );
}
