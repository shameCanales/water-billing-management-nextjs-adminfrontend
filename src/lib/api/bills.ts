import { api } from "./api";
import { APIResponse } from "@/types/shared";
import { BillQueryParams } from "@/types/bills";
import { PaginatedBillResult } from "@/types/bills";

export const getAllBills = async (
  params: BillQueryParams = {},
  signal?: AbortSignal,
) => {
  const response = await api.get<APIResponse<PaginatedBillResult>>("/bills", {
    params,
    signal,
  });

  return response.data.data;
};
