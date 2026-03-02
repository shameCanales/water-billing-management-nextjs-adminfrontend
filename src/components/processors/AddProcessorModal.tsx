import { useAddProcessor } from "@/hooks/processors/useAddProcessor";
import { RootState } from "@/lib/store/store";
import { uiActions } from "@/lib/store/uiSlice";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Modal } from "../ui/Modal";
import FormInput from "../ui/form/FormInput";
import FormLabel from "../ui/form/FormLabel";
import FormSelect from "../ui/form/FormSelect";
import RequiredFormFieldIndicator from "../ui/form/RequiredFormFieldIndicator";
import FormValidationErrorMsg from "../ui/form/FormValidationErrorMsg";
import Button from "../ui/Button";

// Matches your backend validation exactly
const processorSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(40, "First name must be less than 40 characters"),
  middleName: z
    .string()
    .max(40, "Middle name must be less than 40 characters")
    .optional(),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(40, "Last name must be less than 40 characters"),
  email: z
    .string()
    .min(1, "Email is required")
    .email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
      message:
        "Password must contain uppercase, lowercase, number, and special character.",
    }),
  role: z.enum(["staff", "manager"]),
  status: z.enum(["active", "restricted"]),
});

type ProcessorFormValues = z.infer<typeof processorSchema>;

export default function AddProcessorModal() {
  const dispatch = useDispatch();
  

  const isOpen = useSelector(
    (state: RootState) => state.ui.addProcessorModalIsOpen
  );

  const {
    mutate: createProcessor,
    isPending: isCreatingProcessor,
    isError: errorCreatingProcessor,
    error: createProcessorError,
  } = useAddProcessor();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(processorSchema),
    defaultValues: {
      role: "staff",      // Defaulted to staff
      status: "active",   // Defaulted to active
      middleName: "",
    },
  });

  function handleClose() {
    reset();
    dispatch(uiActions.closeAddProcessorModal());
  }

  const onSubmit = (data: ProcessorFormValues) => {
    // Clean up optional fields before sending
    const payload = {
      ...data,
      middleName: data.middleName || undefined,
    };

    createProcessor(payload, {
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
      title="Add Processor"
      description="Fill in the details to register a new system processor"
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
              placeholder="e.g. Juan"
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
            <FormLabel htmlFor="lastName">
              Last Name <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput
              id="lastName"
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

          {/* Role */}
          <div>
            <FormLabel htmlFor="role">Role</FormLabel>
            <FormSelect id="role" {...register("role")}>
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
            </FormSelect>
          </div>

          {/* Status */}
          <div>
            <FormLabel htmlFor="status">Status</FormLabel>
            <FormSelect id="status" {...register("status")}>
              <option value="active">Active</option>
              <option value="restricted">Restricted</option>
            </FormSelect>
          </div>

          {/* Password - Full Width */}
          <div className="col-span-1 md:col-span-2">
            <FormLabel htmlFor="password">
              Password <RequiredFormFieldIndicator />
            </FormLabel>
            <FormInput 
              id="password" 
              type="password" 
              placeholder="Enter a secure password"
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

          <Button type="submit" isLoading={isCreatingProcessor}>
            Add Processor
          </Button>
        </div>

        {errorCreatingProcessor && (
          <p className="text-sm text-red-600 font-medium animate-pulse">
            {createProcessorError?.message || "Failed to create processor"}
          </p>
        )}
      </form>
    </Modal>
  );
}