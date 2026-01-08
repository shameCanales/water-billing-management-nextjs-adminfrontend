import { getAllConnections } from "@/lib/api/connections";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type {
  ConnectionQueryParams,
  PaginatedConnectionResult,
} from "@/types/connections";

export const useGetAllConnections = (params: ConnectionQueryParams = {}) => {
  return useQuery<PaginatedConnectionResult, Error>({
    queryKey: ["connections", "list", params],
    queryFn: ({ signal }) => getAllConnections(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
