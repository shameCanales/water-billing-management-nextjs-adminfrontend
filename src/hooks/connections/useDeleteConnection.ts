import { deleteConnection } from "@/lib/api/connections";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/lib/utils/toast";

export const useDeleteConnection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      const promise = deleteConnection(id);

      notify.promise(promise, {
        loading: "Deleting Connection...",
        success: "Connection deleted successfully!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to delete Connection",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections", "list"] });
    },
  });
};
