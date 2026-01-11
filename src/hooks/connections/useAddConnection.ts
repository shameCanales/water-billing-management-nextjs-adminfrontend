import { addConnection } from "@/lib/api/connections";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { notify } from "@/lib/utils/toast";
import { CreateConnectionData, Connection } from "@/types/connections";
import { APIResponse } from "@/types/shared";

export const useAddConnection = () => {
  const queryClient = useQueryClient();

  return useMutation<APIResponse<Connection>, Error, CreateConnectionData>({
    mutationFn: (data) => {
      const promise = addConnection(data);

      notify.promise(promise, {
        loading: "Adding new connection...",
        success: "Connection added successfully!",
        error: (err) =>
          err instanceof Error ? err.message : "Failed to add connection",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["connections", "list"] });
    },
  });
};
