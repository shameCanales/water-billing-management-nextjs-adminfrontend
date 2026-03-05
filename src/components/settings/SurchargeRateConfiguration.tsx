"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, Save } from "lucide-react";

import { useUpdateSetting } from "@/hooks/settings.ts/useUpdateSetting";
import { useGetSettings } from "@/hooks/settings.ts/useGetSettings";

import FormInput from "@/components/ui/form/FormInput";
import FormLabel from "@/components/ui/form/FormLabel";
import RequiredFormFieldIndicator from "@/components/ui/form/RequiredFormFieldIndicator";
import FormValidationErrorMsg from "@/components/ui/form/FormValidationErrorMsg";
import Button from "@/components/ui/Button";
import ConfirmChangeChargeModal from "./ConfirmChangeChargeModal";

const surchargeSchema = z.object({
  percentage: z.coerce
    .number()
    .min(0, "Surcharge cannot be negative")
    .max(100, "Surcharge cannot exceed 100%"),
});

type SurchargeFormValues = z.infer<typeof surchargeSchema>;

export default function SurchargeConfiguration() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingPercentage, setPendingPercentage] = useState<number | null>(
    null,
  );

  const { data: settings, isLoading: isLoadingSettings } = useGetSettings();
  const { mutate: updateSetting, isPending: isUpdating } = useUpdateSetting();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(surchargeSchema),
    defaultValues: { percentage: 0 },
  });

  const watchedValue = watch("percentage");
  const currentInputPercentage = Number(watchedValue) || 0;

  useEffect(() => {
    if (settings?.surchargeRate !== undefined) {
      setValue("percentage", settings.surchargeRate * 100);
    }
  }, [settings?.surchargeRate, setValue]);

  const onSubmit = (data: SurchargeFormValues) => {
    const dbValueInPercentage = (settings?.surchargeRate || 0) * 100;
    if (data.percentage === dbValueInPercentage) return;

    setPendingPercentage(data.percentage);
    setIsModalOpen(true);
  };

  const handleConfirmUpdate = () => {
    if (pendingPercentage === null) return;
    updateSetting(
      { key: "surchargeRate", value: pendingPercentage / 100 },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setPendingPercentage(null);
        },
      },
    );
  };

  const exampleBase = 1000;
  const exampleSurcharge = exampleBase * (currentInputPercentage / 100);

  return (
    <div className="bg-white border border-slate-200/60 mt-5 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow max-w-3xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <h2 className="text-lg font-bold text-gray-900">
            Late Payment Surcharge
          </h2>
        </div>
        <p className="text-gray-500 text-sm">
          Set the penalty percentage for overdue bills
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Input Area */}
        <div className="space-y-2">
          <FormLabel
            htmlFor="percentage"
            className="text-slate-900 font-medium"
          >
            Surcharge Percentage (%) <RequiredFormFieldIndicator />
          </FormLabel>

          <div className="flex gap-3 items-start">
            <div className="relative flex-1 max-w-xs">
              <FormInput
                id="percentage"
                type="number"
                step="0.01"
                placeholder="20"
                disabled={isLoadingSettings}
                className="pr-8 text-[14px]"
                {...register("percentage")}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 text-sm">
                %
              </span>
            </div>

            <Button
              type="submit"
              isLoading={isUpdating}
              disabled={isLoadingSettings}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="w-4 h-4 mr-2" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          <p className="text-[12px] text-slate-500">
            This penalty will be automatically applied to bills that are past
            their due date.
          </p>
          {errors.percentage && (
            <FormValidationErrorMsg error={errors.percentage.message} />
          )}
        </div>

        {/* Surcharge Information Box */}
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <h4 className="text-[13px] text-slate-900 mb-3 font-semibold">
            Surcharge Calculation Example
          </h4>
          <div className="space-y-2">
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-600">Original Bill Amount:</span>
              <span className="text-slate-900 font-medium font-mono">
                ₱1,000.00
              </span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-slate-600">
                Surcharge ({currentInputPercentage}%):
              </span>
              <span className="text-orange-600 font-semibold font-mono text-right">
                + ₱
                {exampleSurcharge.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>
            <div className="pt-2 border-t border-orange-200">
              <div className="flex justify-between text-[13px]">
                <span className="text-slate-900 font-semibold">
                  Total Amount Due:
                </span>
                <span className="text-slate-900 font-bold font-mono text-base">
                  ₱
                  {(exampleBase + exampleSurcharge).toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[13px] text-slate-900 font-semibold">
              Important Notice
            </h4>
            <p className="text-[12px] text-slate-600 leading-relaxed">
              Changes to the surcharge percentage will only apply to new overdue
              bills. Existing bills with applied surcharges will retain their
              original penalty calculations.
            </p>
          </div>
        </div>
      </form>

      <ConfirmChangeChargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmUpdate}
        newAmount={pendingPercentage}
        currentAmount={(settings?.surchargeRate || 0) * 100}
        isUpdating={isUpdating}
        settingName="Surcharge Rate"
        unit="%"
      />
    </div>
  );
}
