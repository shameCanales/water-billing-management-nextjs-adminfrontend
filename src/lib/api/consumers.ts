import { api } from "./api";
import { APIResponse } from "@/types/user";
import {
  ConsumerQueryParams,
  PaginatedConsumerResult,
} from "@/types/consumers";

export const getAllConsumers = async (
  params: ConsumerQueryParams = {}, // default to empty object
  signal?: AbortSignal
) => {
  const response = await api.get<APIResponse<PaginatedConsumerResult>>(
    "/consumers",
    {
      params, // Axios automatically converts this object to ?page=1&limit=10...
      signal,
    }
  );
  return response.data.data;
};
