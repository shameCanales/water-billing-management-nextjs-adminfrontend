import { getAllProcessors } from "@/lib/api/processors";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  ProcessorQueryParams,
  PaginatedProcessorResult,
} from "@/types/processor";

export const useGetAllProcessors = (params: ProcessorQueryParams = {}) => {
  return useQuery<PaginatedProcessorResult, Error>({
    queryKey: ["processors", "list", params],
    queryFn: ({ signal }) => getAllProcessors(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
