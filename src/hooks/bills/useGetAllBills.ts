import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { BillQueryParams, PaginatedBillResult } from "@/types/bills";
import { getAllBills } from "@/lib/api/bills";

export const useGetAllBills = (params: BillQueryParams = {}) => {
  return useQuery<PaginatedBillResult, Error>({
    queryKey: ["bills", "list", params],
    queryFn: ({ signal }) => getAllBills(params, signal),
    placeholderData: keepPreviousData,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
};
