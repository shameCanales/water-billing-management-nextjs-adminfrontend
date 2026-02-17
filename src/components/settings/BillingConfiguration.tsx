"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DollarSign, Save } from "lucide-react";
import ConfirmChangeChargeModal from "./ConfirmChangeChargeModal";

// Hooks
import { useUpdateSetting } from "@/hooks/settings.ts/useUpdateSetting";
import { useGetSettings } from "@/hooks/settings.ts/useGetSettings";

// UI Components
import FormInput from "@/components/ui/form/FormInput";
import FormLabel from "@/components/ui/form/FormLabel";
import RequiredFormFieldIndicator from "@/components/ui/form/RequiredFormFieldIndicator";
import FormValidationErrorMsg from "@/components/ui/form/FormValidationErrorMsg";
import Button from "@/components/ui/Button";

// Schema
const billingSchema = z.object({
  amount: z.coerce
    .number()
    .int("charge must be an integer")
    .positive("charge must be positive"),
});

type BillingFormValues = z.infer<typeof billingSchema>;

export default function BillingConfiguration() {
  // Local state for the modal and holding the pending form submission
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAmount, setPendingAmount] = useState<number | null>(null);

  // 1. Fetch Data
  const { data: settings, isLoading: isLoadingSettings } = useGetSettings();

  // 2. Mutation Hook
  const { mutate: updateSetting, isPending: isUpdating } = useUpdateSetting();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(billingSchema),
    defaultValues: { amount: 0 },
  });

  // 3. Sync API data to Form when it loads
  useEffect(() => {
    if (settings?.chargePerCubicMeter !== undefined) {
      setValue("amount", settings.chargePerCubicMeter);
    }
  }, [settings?.chargePerCubicMeter, setValue]);

  // 4. Form Submit Handler - Open modal instead of calling API directly
  const onSubmit = (data: BillingFormValues) => {
    // Check if the value actually changed to prevent unnecessary API calls
    if (data.amount === settings?.chargePerCubicMeter) return;

    setPendingAmount(data.amount);
    setIsModalOpen(true);
  };

  // 5. Modal Confirm Handler - Call API and close modal on success
  const handleConfirmUpdate = () => {
    if (pendingAmount === null) return;

    updateSetting(
      { key: "chargePerCubicMeter", value: pendingAmount },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setPendingAmount(null);
        },
        onError: (error) => {
          console.error("Failed to update rate:", error);
          // Optionally handle error state here (e.g., show toast notification)
        },
      },
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-3xl">
      {/* --- Header --- */}
      <div className="flex items-start gap-3 mb-6">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
          <DollarSign className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-gray-900">
            Billing Configuration
          </h2>
          <p className="text-gray-500 text-sm">
            Set the default charge rate for water consumption
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <FormLabel htmlFor="amount">
            Charge per Cubic Meter (₱) <RequiredFormFieldIndicator />
          </FormLabel>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Input Wrapper */}
            <div>
              <FormInput
                id="amount"
                type="number"
                step="0.01"
                placeholder="0.00"
                disabled={isLoadingSettings}
                {...register("amount")}
              />
              {errors.amount && (
                <FormValidationErrorMsg error={errors.amount.message} />
              )}
            </div>

            <Button
              type="submit"
              isLoading={isUpdating}
              disabled={isLoadingSettings}
              className="w-full sm:w-auto"
            >
              <Save className="mr-2 w-4 h-4" />
              Save Changes
            </Button>
          </div>

          <p className="text-xs text-gray-400 mt-2">
            This rate will be used as the default when creating new bills.
            Philippine Peso (PHP).
          </p>
        </div>

        {/* --- Info Box --- */}
        <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-5 mt-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Current Settings
          </h3>

          <div className="grid gap-2 text-sm">
            <div className="flex justify-between items-center border-b border-blue-100 pb-2">
              <span className="text-gray-500">Default Rate:</span>
              <span className="font-mono font-bold text-gray-900 text-base">
                ₱ {settings?.chargePerCubicMeter.toFixed(2) ?? "0.00"} per m³
              </span>
            </div>

            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-500">Currency:</span>
              <span className="font-medium text-gray-900">
                Philippine Peso (PHP)
              </span>
            </div>
          </div>
        </div>
      </form>

      {/* --- Confirmation Modal --- */}
      <ConfirmChangeChargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        newAmount={pendingAmount}
        currentAmount={settings?.chargePerCubicMeter}
        isUpdating={isUpdating}
      />
    </div>
  );
}