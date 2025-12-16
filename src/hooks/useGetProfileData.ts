import { getProfileData } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export const useGetProfileData = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: getProfileData,
    staleTime: 1000 * 60 * 5,
    retry: false,
    refetchOnWindowFocus: true,
  });
};
