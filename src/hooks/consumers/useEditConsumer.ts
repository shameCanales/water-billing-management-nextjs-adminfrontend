import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editConsumer } from "@/lib/api/consumers";
import { EditConsumerData, EditConsumerResponse } from "@/types/consumers";
import { notify } from "@/lib/utils/toast"; // 1. Import notify

export const useEditConsumer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    EditConsumerResponse,
    Error,
    { id: string; data: EditConsumerData }
  >({
    mutationFn: ({ id, data }) => {
      const promise = editConsumer(id, data);

      notify.promise(promise, {
        loading: "Saving changes...",
        success: "Consumer updated successfully!",

        error: (err) =>
          err instanceof Error ? err.message : "Failed to update consumer",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
