import { useAddConsumer } from "@/hooks/useAddConsumer";
import { RootState } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Modal } from "../ui/Modal";

const consumerSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "First name must be less than 40 characters"),
  middleName: z
    .string()
    .max(40, "Middle name must be less that 40 characters")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(40, "Last name must be less than 40 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: "Please enter a valid email address" }),

  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((date) => !isNaN(Date.parse(date)), { message: "Invalid date format" }),

  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(
      /^09\d{9}$/,
      { message: "Please enter a valid PH mobile number (e.g., 09171234567)" }
    ),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  address: z
    .string()
    .min(5, "Address must be at least 5 characters")
    .max(100, "Address must be less than 100 characters"),

  status: z.enum(["active", "suspended"]),
});

type ConsumerFormValues = z.infer<typeof consumerSchema>;

export default function AddConsumerModal() {
  const dispatch = useDispatch();
  const isOpen = useSelector(
    (state: RootState) => state.ui.addConsumerModalIsOpen
  );

  const {
    mutate: createConsumer,
    isPending: isCreatingConsumer,
    isError: errorCreatingConsumer,
    error: createConsumerError,
  } = useAddConsumer();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(consumerSchema),
    defaultValues: {
      status: "active",
      middleName: "",
    },
  });

  function handleClose() {
    reset();
    dispatch(uiActions.closeAddConsumerModal());
  }

  const onSubmit = (data: ConsumerFormValues) => {
    // Clean up optional fields before sending

    const payload = {
      ...data,
      middleName: data.middleName || undefined,
    };

    createConsumer(payload, {
      onSuccess: () => {
        handleClose();
        //show success  toast here
      },
      onError: (error) => {
        console.error("error: ", error);
        // show error toast
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => handleClose()}
      title="Add Consumer Modal"
      description="Fill in the details to create a new consumer"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              First Name *
            </label>
            <input
              {...register("firstName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.firstName && (
              <p className="text-xs text-red-500">{errors.firstName.message}</p>
            )}
          </div>

          {/* Middle Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Middle Name
            </label>
            <input
              {...register("middleName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.middleName && (
              <p className="text-xs text-red-500">
                {errors.middleName.message}
              </p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Last Name *
            </label>
            <input
              {...register("lastName")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.lastName && (
              <p className="text-xs text-red-500">{errors.lastName.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Email *</label>
            <input
              type="email"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          {/* Birth Date */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Birth Date *
            </label>
            <input
              type="date"
              {...register("birthDate")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600"
            />
            {errors.birthDate && (
              <p className="text-xs text-red-500">{errors.birthDate.message}</p>
            )}
          </div>

          {/* Mobile Number */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Mobile Number *
            </label>
            <input
              placeholder="09171234567"
              maxLength={11}
              {...register("mobileNumber")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.mobileNumber && (
              <p className="text-xs text-red-500">
                {errors.mobileNumber.message}
              </p>
            )}
          </div>

          {/* Address - Full Width */}
          <div className="col-span-1 md:col-span-2 space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Address *
            </label>
            <input
              {...register("address")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.address && (
              <p className="text-xs text-red-500">{errors.address.message}</p>
            )}
          </div>

          {/* Status */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              {...register("status")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Password *
            </label>
            <input
              type="password"
              {...register("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
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
            disabled={isCreatingConsumer}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isCreatingConsumer ? "Creating..." : "Create Consumer"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
