import { api } from "./api";
import { APIResponse } from "@/types/user";
import {
  ConsumerQueryParams,
  PaginatedConsumerResult,
  CreateConsumerData,
  CreateConsumerResponse,
  EditConsumerData,
  EditConsumerResponse,
  UpdateConsumerResponse,
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

export const addConsumer = async (
  data: CreateConsumerData
): Promise<CreateConsumerResponse> => {
  const response = await api.post("/consumers", data);
  return response.data;
};

export const editConsumer = async (
  id: string,
  data: EditConsumerData
): Promise<EditConsumerResponse> => {
  const response = await api.patch(`/consumers/${id}`, data);
  return response.data;
};

export const deleteConsumer = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
}> => {
  const response = await api.delete(`/consumers/${id}`);
  return response.data;
};

export const updateConsumerStatus = async (
  id: string,
  status: "active" | "suspended"
): Promise<UpdateConsumerResponse> => {
  const response = await api.patch(`/consumers/${id}/status`, { status });
  return response.data;
};
