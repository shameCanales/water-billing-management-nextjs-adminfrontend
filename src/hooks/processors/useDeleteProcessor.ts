import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProcessor } from "@/lib/api/processors";
import { notify } from "@/lib/utils/toast";

export const useDeleteProcessor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const promise = deleteProcessor(id);

      notify.promise(promise, {
        loading: "Deleting processor...",
        success: "Processor deleted successfully!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to delete processor",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["processors", "list"] });
    },
  });
};
