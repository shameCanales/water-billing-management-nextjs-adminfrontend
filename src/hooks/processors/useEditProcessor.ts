import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editProcessor } from "@/lib/api/processors";
import type { EditProcessorData, Processor } from "@/types/processor";
import { APIResponse } from "@/types/shared";
import { notify } from "@/lib/utils/toast";

export const useEditProcessor = () => {
  const queryClient = useQueryClient();

  return useMutation<
    APIResponse<Processor>,
    Error,
    { id: string; data: EditProcessorData }
  >({
    mutationFn: ({ id, data }) => {
      const promise = editProcessor(id, data);

      notify.promise(promise, {
        loading: "Saving changes...",
        success: "Processor updated successfully!",

        error: (err) =>
          err instanceof Error ? err.message : "Failed to update processor",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processors", "list"] });
    },
  });
};
