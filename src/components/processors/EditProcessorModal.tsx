"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { useEditProcessor } from "@/hooks/processors/useEditProcessor";
import { Modal } from "../ui/Modal";
import { Processor, EditProcessorData } from "@/types/processor";
import FormLabel from "../ui/form/FormLabel";
import FormInput from "../ui/form/FormInput";
import FormSelect from "../ui/form/FormSelect";
import FormValidationErrorMsg from "../ui/form/FormValidationErrorMsg";
import Button from "../ui/Button";

// --- 1. Zod Schema ---
// We use .partial() or make fields optional to match EditProcessorData
const editProcessorSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "First name must be less than 40 characters")
    .optional(),
  middleName: z.string().max(40).optional().or(z.literal("")),
  lastName: z.string().min(1, "Last name is required").max(40).optional(),
  email: z.string().email("Invalid email address").optional(),
  role: z.enum(["staff", "manager"]).optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message:
        "Password must contain uppercase, lowercase, number, and special character.",
    })
    .optional()
    .or(z.literal("")),
});

interface EditProcessorModalProps {
  processorToEdit: Processor | null;
}

export default function EditProcessorModal({
  processorToEdit,
}: EditProcessorModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector(
    (state: RootState) => state.ui.editProcessorModalIsOpen,
  );

  const { mutate: editProcessor, isPending: isEditing } = useEditProcessor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<EditProcessorData>({
    resolver: zodResolver(editProcessorSchema),
  });

  // --- 2. Sync Form with Selected Processor ---
  useEffect(() => {
    if (isOpen && processorToEdit) {
      reset({
        firstName: processorToEdit.firstName,
        middleName: processorToEdit.middleName || "",
        lastName: processorToEdit.lastName,
        email: processorToEdit.email,
        role: processorToEdit.role,

        password: "", // Security: never pre-fill existing passwords
      });
    }
  }, [isOpen, processorToEdit, reset]);

  const handleClose = () => {
    reset();
    dispatch(uiActions.closeEditProcessorModal());
  };

  const onSubmit = (data: EditProcessorData) => {
    if (!processorToEdit) return;

    // Filter out empty strings so we don't overwrite valid data with empty values
    const cleanData = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v !== "" && v !== undefined),
    ) as EditProcessorData;

    editProcessor(
      { id: processorToEdit._id, data: cleanData },
      {
        onSuccess: () => handleClose(),
        onError: (err) => console.error("Update failed:", err),
      },
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Edit Processor"
      description={`Modify account details for ${processorToEdit?.firstName} ${processorToEdit?.lastName}`}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <FormLabel htmlFor="firstName">First Name</FormLabel>
            <FormInput id="firstName" {...register("firstName")} />
            {errors.firstName && (
              <FormValidationErrorMsg error={errors.firstName.message} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="middleName">Middle Name</FormLabel>
            <FormInput id="middleName" {...register("middleName")} />
            {errors.middleName && (
              <FormValidationErrorMsg error={errors.middleName.message} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="lastName">Last Name</FormLabel>
            <FormInput id="lastName" {...register("lastName")} />
            {errors.lastName && (
              <FormValidationErrorMsg error={errors.lastName.message} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput id="email" type="email" {...register("email")} />
            {errors.email && (
              <FormValidationErrorMsg error={errors.email.message} />
            )}
          </div>

          <div>
            <FormLabel htmlFor="role">Role</FormLabel>
            <FormSelect id="role" {...register("role")}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </FormSelect>
          </div>

          <div>
            <FormLabel htmlFor="password">
              New Password{" "}
              <span className="text-xs text-gray-400 font-normal">
                (Optional)
              </span>
            </FormLabel>
            <FormInput
              id="password"
              type="password"
              placeholder="Leave blank to keep current password"
              {...register("password")}
            />
            {errors.password && (
              <FormValidationErrorMsg error={errors.password.message} />
            )}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <Button type="button" variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isEditing || !isDirty}
            isLoading={isEditing}
          >
            Save Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
