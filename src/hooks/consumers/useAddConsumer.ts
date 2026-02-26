import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addConsumer } from "@/lib/api/consumers";
import type { Consumer, CreateConsumerData } from "@/types/consumers";
import { notify } from "@/lib/utils/toast";
import { APIResponse } from "@/types/shared";

export const useAddConsumer = () => {
  const queryClient = useQueryClient();

  return useMutation<APIResponse<Consumer>, Error, CreateConsumerData>({
    mutationFn: (data) => {
      const promise = addConsumer(data);

      notify.promise(promise, {
        loading: "Adding new consumer...",
        success: "Consumer added successfully!", // Can also be: (res) => `Added ${res.firstName}`
        error: (err) =>
          err instanceof Error ? err.message : "Failed to add consumer",
      });

      return promise;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
