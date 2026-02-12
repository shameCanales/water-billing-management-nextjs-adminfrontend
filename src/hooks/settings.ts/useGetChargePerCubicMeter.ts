import { useQuery } from "@tanstack/react-query";
import { getChargePerCubicMeter } from "@/lib/api/settings";

export const useGetChargePerCubicMeter = () => {
  return useQuery({
    queryKey: ["settings", "chargePerCubicMeter"],
    queryFn: () => getChargePerCubicMeter(),
    staleTime: 1000 * 60 * 5,
  });
};
