import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editConnection } from "@/lib/api/connections";
import { EditConnectionData, Connection } from "@/types/connections";
import { APIResponse } from "@/types/shared";
import { notify } from "@/lib/utils/toast";

export const useEditConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<
    APIResponse<Connection>,
    Error,
    { id: string; data: EditConnectionData }
  >({
    mutationFn: ({ id, data }) => {
      const promise = editConnection(id, data);

      notify.promise(promise, {
        loading: "Saving changes...",
        success: "Connection updated successfully!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to update connection",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections", "list"] });
    },
  });
};
