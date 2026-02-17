import { useQuery } from "@tanstack/react-query";
import { getSettings } from "@/lib/api/settings";

export const useGetSettings = () => {
  return useQuery({
    queryKey: ["settings"],
    queryFn: () => getSettings(),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};