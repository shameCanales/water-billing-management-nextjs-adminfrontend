import { getAllConsumers } from "@/lib/api/consumers";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  ConsumerQueryParams,
  PaginatedConsumerResult,
} from "@/types/consumers";

// 1. Accept params as an argument (default to empty object)
export const useGetAllConsumers = (params: ConsumerQueryParams = {}) => {
  return useQuery<PaginatedConsumerResult, Error>({
    // 2. Add 'params' to the query key
    // This is CRITICAL. It tells tanstack: "If params change (page 1 -> page 2", fetch new data)
    queryKey: ["consumers", "list", params],
    // Pass to the fetcher function
    queryFn: ({ signal }) => getAllConsumers(params, signal),
    // Use keepPreviousData
    // This prevents the "loading..." spinner from showing when you click "next page"
    // instead, it keeps the old data on screen until the new data arrives.
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
