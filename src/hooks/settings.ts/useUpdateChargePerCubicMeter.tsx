import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getChargePerCubicMeter,
  updateChargePerCubicMeter,
} from "@/lib/api/settings";
import { notify } from "@/lib/utils/toast";

export const useUpdateChargePerCubicMeter = () => {
  const queryClient = useQueryClient();

  return useMutation<number, Error, number>({
    mutationFn: (amount) => {
      const promise = updateChargePerCubicMeter(amount);

      notify.promise(promise, {
        loading: "Updating charge rate...",
        success: "Charge rate updated successfully!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to update charge rate",
      });

      return promise;
    },

    onSuccess: (newRate) => {
      queryClient.invalidateQueries({
        queryKey: ["settings", "chargePerCubicMeter"],
      });

      queryClient.setQueryData(["settings", "chargePerCubicMeter"], newRate);
    },
  });
};
