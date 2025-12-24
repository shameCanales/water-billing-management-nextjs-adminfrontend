import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editConsumer } from "@/lib/api/consumers";
import { EditConsumerData, EditConsumerResponse } from "@/types/consumers";

export const useEditConsumer = () => {
  const queryClient = useQueryClient();

  return useMutation<
    EditConsumerResponse,
    Error,
    { id: string; data: EditConsumerData }
  >({
    mutationFn: ({ id, data }) => editConsumer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
