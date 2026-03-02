import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addProcessor } from "@/lib/api/processors";
import type { Processor, CreateProcessorData } from "@/types/processor";
import { notify } from "@/lib/utils/toast";
import { APIResponse } from "@/types/shared";

export const useAddProcessor = () => {
  const queryClient = useQueryClient();

  return useMutation<APIResponse<Processor>, Error, CreateProcessorData>({
    mutationFn: (data) => {
      const promise = addProcessor(data);

      notify.promise(promise, {
        loading: "Adding new Processor Member...",
        success: "Processor Member added successfully!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to add Processor Member",
      });

      return promise;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processors", "list"] });
    },
  });
};
