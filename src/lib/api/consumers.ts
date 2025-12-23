import { api } from "./api";
import { APIResponse } from "@/types/user";
import {
  ConsumerQueryParams,
  PaginatedConsumerResult,
  CreateConsumerData,
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

export const addConsumer = async (data: CreateConsumerData) => {
  const response = await api.post("/consumers", data);
  return response.data;
};
