import { getAllConsumers } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import type { Consumer } from "@/types/consumers";

export const useGetAllConsumers = () => {
  return useQuery<Consumer[], Error>({
    queryKey: ["consumers", "list"],
    queryFn: ({ signal }) => getAllConsumers(signal),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
