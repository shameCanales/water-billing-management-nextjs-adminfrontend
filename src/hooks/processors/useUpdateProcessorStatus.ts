import { updateProcessorStatus } from "@/lib/api/processors";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Processor, ProcessorStatus } from "@/types/processor";
import { notify } from "@/lib/utils/toast";
import { APIResponse } from "@/types/shared";

export const useUpdateProcessorStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    APIResponse<Processor>,
    Error,
    { id: string; status: ProcessorStatus }
  >({
    mutationFn: ({ id, status }) => {
      const promise = updateProcessorStatus(id, status);

      notify.promise(promise, {
        loading: "Updating Processor Status...",
        success: (data) => `Processor successfully set to ${status}`,
        error: (err) =>
          err instanceof Error ? err.message : "Failed to update status",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processors", "list"] });
    },
  });
};
