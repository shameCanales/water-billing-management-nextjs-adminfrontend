import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateConsumerStatus } from "@/lib/api/consumers";
import { CreateConsumerResponse } from "@/types/consumers";

export const useUpdateConsumerStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    CreateConsumerResponse,
    Error,
    { id: string; status: "active" | "suspended" }
  >({
    mutationFn: ({ id, status }) => updateConsumerStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
