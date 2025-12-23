import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addConsumer } from "@/lib/api/consumers";

export const useAddCOnsumer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addConsumer,
  });
};
