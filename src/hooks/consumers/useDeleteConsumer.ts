import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConsumer } from "@/lib/api/consumers";
import { notify } from "@/lib/utils/toast";

export const useDeleteConsumer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const promise = deleteConsumer(id);

      notify.promise(promise, {
        loading: "Deleting consumer...",
        success: "Consumer deleted successfully!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to delete consumer",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
