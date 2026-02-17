import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateSetting,
  type SettingKey,
  type Settings,
} from "@/lib/api/settings";
import { notify } from "@/lib/utils/toast";

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation<Settings, Error, { key: SettingKey; value: number }>({
    mutationFn: ({ key, value }) => {
      const promise = updateSetting(key, value);

      notify.promise(promise, {
        loading: "Updating setting...",
        success: `${key} updated successfully!`,
        error: (err) =>
          err instanceof Error ? err.message : "Failed to update setting",
      });

      return promise;
    },

    onSuccess: (updatedSettings) => {
      queryClient.setQueryData(["settings"], updatedSettings);
    },
  });
};
