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
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
        {/* Card Header */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-2 mb-1.5">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-slate-900 leading-none tracking-tight">
              Billing Configuration
            </h3>
          </div>
          <p className="text-sm text-slate-500">
            Set the default charge rate for water consumption
          </p>
        </div>

        {/* Card Content */}
        <div className="p-6 pt-4 space-y-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <FormLabel htmlFor="amount">
                Charge per Cubic Meter (₱) <RequiredFormFieldIndicator />
              </FormLabel>

              <div className="flex gap-3 items-start">
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                    ₱
                  </span>
                  <FormInput
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="25.00"
                    disabled={isLoadingSettings}
                    className="pl-7 text-[14px]"
                    {...register("amount")}
                  />
                </div>

                <Button
                  type="submit"
                  isLoading={isUpdating}
                  disabled={isLoadingSettings}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Save className="mr-2 w-4 h-4" />
                  {isUpdating ? "Saving..." : "Save Changes"}
                </Button>
              </div>

              <p className="text-[12px] text-slate-500">
                This rate will be used as the default when creating new bills.
                Philippine Peso (PHP) currency.
              </p>
              {errors.amount && (
                <FormValidationErrorMsg error={errors.amount.message} />
              )}
            </div>

            {/* Information Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h4 className="text-[13px] text-slate-900 mb-2 font-semibold">
                Current Settings
              </h4>
              <div className="space-y-1.5">
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-600">Default Rate:</span>
                  <span className="text-slate-900 font-medium">
                    ₱
                    {settings?.chargePerCubicMeter.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                    }) ?? "0.00"}{" "}
                    per m³
                  </span>
                </div>
                <div className="flex justify-between text-[13px]">
                  <span className="text-slate-600">Currency:</span>
                  <span className="text-slate-900 font-medium">
                    Philippine Peso (PHP)
                  </span>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* --- Confirmation Modal --- */}
      <ConfirmChangeChargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        newAmount={pendingAmount}
        currentAmount={settings?.chargePerCubicMeter}
        isUpdating={isUpdating}
        settingName="Water Charge"
        unit="₱"
      />
    </div>
  );
}
