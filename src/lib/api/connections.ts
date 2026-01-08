import { api } from "./api";
import { APIResponse } from "@/types/user";
import {
  ConnectionQueryParams,
  PaginatedConnectionResult,
} from "@/types/connections";

export const getAllConnections = async (
  params: ConnectionQueryParams,
  signal?: AbortSignal
) => {
  const response = await api.get<APIResponse<PaginatedConnectionResult>>(
    "/connections",
    { params, signal }
  );
  return response.data.data;
};
