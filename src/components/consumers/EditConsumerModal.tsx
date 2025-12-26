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

// --- 1. Zod Schema (Matches Backend Exactly) ---
const editConsumerSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(40).optional(),
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

export default function EditConsumerModal({ consumerToEdit }: EditConsumerModalProps) {
  const dispatch = useDispatch<AppDispatch>();
  const isOpen = useSelector((state: RootState) => state.ui.editConsumerModalIsOpen);

  const { mutate: editConsumer, isPending } = useEditConsumer();

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

  const handleClose = () => {
    reset();
    dispatch(uiActions.closeEditConsumerModal());
  };

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
          // Optional: toast.success("Consumer updated successfully");
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">First Name</label>
            <input
              {...register("firstName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
          </div>

          {/* Middle Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Middle Name</label>
            <input
              {...register("middleName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.middleName && <p className="text-xs text-red-500">{errors.middleName.message}</p>}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Last Name</label>
            <input
              {...register("lastName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Birth Date</label>
            <input
              type="date"
              {...register("birthDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
            />
            {errors.birthDate && <p className="text-xs text-red-500">{errors.birthDate.message}</p>}
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Mobile Number</label>
            <input
              placeholder="09171234567"
              maxLength={11}
              {...register("mobileNumber")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.mobileNumber && <p className="text-xs text-red-500">{errors.mobileNumber.message}</p>}
          </div>

          {/* Address - Full Width */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <input
              {...register("address")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Password (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              New Password <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              type="password"
              {...register("password")}
              placeholder="Leave blank to keep current"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !isDirty} // Disable if saving OR no changes made
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}