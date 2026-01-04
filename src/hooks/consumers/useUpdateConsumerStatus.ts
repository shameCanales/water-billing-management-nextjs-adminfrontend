import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConsumerStatus } from "@/lib/api/consumers";
import { CreateConsumerResponse } from "@/types/consumers";
import { notify } from "@/lib/utils/toast";

export const useUpdateConsumerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateConsumerResponse,
    Error,
    { id: string; status: "active" | "suspended" }
  >({
    mutationFn: ({ id, status }) => {
      const promise = updateConsumerStatus(id, status);

      notify.promise(promise, {
        loading: "Updating Consumer Status...",
        success: (data) => `Consumer successfully set to ${status}`,
        error: (err) =>
          err instanceof Error ? err.message : "Failed to update status",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
