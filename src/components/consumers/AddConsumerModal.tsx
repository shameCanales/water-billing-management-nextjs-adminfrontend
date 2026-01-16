import { useAddConsumer } from "@/hooks/consumers/useAddConsumer";
import { RootState } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Modal } from "../ui/Modal";
import FormInput from "../ui/FormInput";
import FormLabel from "../ui/FormLabel";
import FormSelect from "../ui/FormSelect";
import RequiredFormFieldIndicator from "../ui/RequiredFormFieldIndicator";
import FormValidationErrorMsg from "../ui/FormValidationErrorMsg";
import Button from "../ui/Button";

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
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
      message: "Please enter a valid email address",
    }),
  birthDate: z
    .string()
    .min(1, "Birth date is required")
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    }),
  mobileNumber: z
    .string()
    .min(1, "Mobile number is required")
    .regex(/^09\d{9}$/, {
      message: "Please enter a valid PH mobile number (e.g., 09171234567)",
    }),
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

  const today = new Date().toLocaleDateString("en-CA");

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
      birthDate: today,
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
      },
      onError: (error) => {
        console.error("error: ", error);
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
          <div>
            <FormLabel htmlFor="firstName">
              First Name <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput
              id="firstName"
              placeholder="e.g. Juan "
              {...register("firstName")}
            />

            {errors.firstName && (
              <FormValidationErrorMsg error={errors.firstName.message} />
            )}
          </div>

          {/* Middle Name */}
          <div>
            <FormLabel htmlFor="middleName">Middle Name</FormLabel>
            <FormInput
              id="middleName"
              placeholder="e.g. Dela"
              {...register("middleName")}
            />
            {errors.middleName && (
              <FormValidationErrorMsg error={errors.middleName.message} />
            )}
          </div>

          {/* Last Name */}
          <div>
            <FormLabel htmlFor="lastname">
              Last Name <RequiredFormFieldIndicator />
            </FormLabel>

            <FormInput
              id="lastname"
              placeholder="e.g. Cruz"
              {...register("lastName")}
            />

            {errors.lastName && (
              <FormValidationErrorMsg error={errors.lastName.message} />
            )}
          </div>

          {/* Email */}
          <div>
            <FormLabel htmlFor="email">
              Email <RequiredFormFieldIndicator />
            </FormLabel>

            <FormInput
              id="email"
              placeholder="e.g. example@gmail.com"
              {...register("email")}
            />

            {errors.email && (
              <FormValidationErrorMsg error={errors.email.message} />
            )}
          </div>

          {/* Birth Date */}
          <div>
            <FormLabel htmlFor="birthDate">
              Birth Date <RequiredFormFieldIndicator />
            </FormLabel>

            <FormInput id="birthDate" type="date" {...register("birthDate")} />

            {errors.birthDate && (
              <FormValidationErrorMsg error={errors.birthDate.message} />
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <FormLabel htmlFor="mobileNumber">
              Mobile Number <RequiredFormFieldIndicator />
            </FormLabel>

            <FormInput
              id="mobileNumber"
              maxLength={11}
              placeholder="09123456789"
              {...register("mobileNumber")}
            />

            {errors.mobileNumber && (
              <FormValidationErrorMsg error={errors.mobileNumber.message} />
            )}
          </div>

          {/* Address - Full Width */}
          <div className="col-span-1 md:col-span-2 ">
            <FormLabel htmlFor="address">
              Address <RequiredFormFieldIndicator />
            </FormLabel>

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

          {/* Password */}
          <div>
            <FormLabel htmlFor="password">
              Password <RequiredFormFieldIndicator />
            </FormLabel>

            <FormInput id="password" {...register("password")} />

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

          <Button type="submit" isLoading={isCreatingConsumer}>
            Create Consumer
          </Button>
        </div>

        {errorCreatingConsumer && (
          <p className="text-sm text-red-600 font-medium animate-pulse">
            {createConsumerError?.message || "Failed to create consumer"}
          </p>
        )}
      </form>
    </Modal>
  );
}
