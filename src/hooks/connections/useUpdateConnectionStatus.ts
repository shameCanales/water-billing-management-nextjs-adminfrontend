import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConnectionStatus } from "@/lib/api/connections";
import type { Connection } from "@/types/connections";
import { APIResponse } from "@/types/shared";
import { notify } from "@/lib/utils/toast";

export const useUpdateConnectionStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    APIResponse<Connection>,
    Error,
    { id: string; status: "connected" | "disconnected" }
  >({
    mutationFn: ({ id, status }) => {
      const promise = updateConnectionStatus(id, status);

      notify.promise(promise, {
        loading: "Updating Connection Status...",
        success: (data) => `Connection successfully set to ${status}`,
        error: (err) =>
          err instanceof Error ? err.message : "Failed to update status",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections", "list"] });
    },
  });
};
