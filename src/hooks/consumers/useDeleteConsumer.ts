import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteConsumer } from "@/lib/api/consumers";

export const useDeleteConsumer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteConsumer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consumers", "list"] });
    },
  });
};
