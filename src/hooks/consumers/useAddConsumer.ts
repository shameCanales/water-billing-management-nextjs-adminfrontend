import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addConsumer } from "@/lib/api/consumers";
import type {
  CreateConsumerData,
  CreateConsumerResponse,
} from "@/types/consumers";

export const useAddConsumer = () => {
  const queryClient = useQueryClient();

  return useMutation<CreateConsumerResponse, Error, CreateConsumerData>({
    mutationFn: addConsumer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
