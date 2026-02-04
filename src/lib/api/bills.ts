import { api } from "./api";
import { APIResponse } from "@/types/shared";
import { Bill, BillQueryParams } from "@/types/bills";
import { PaginatedBillResult } from "@/types/bills";
import { CreateBillData } from "@/types/bills";

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

export const addBill = async (
  data: CreateBillData,
): Promise<APIResponse<Bill>> => {
  const response = await api.post("/bills", data);

  return response.data;
};
