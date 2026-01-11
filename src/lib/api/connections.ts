import { api } from "./api";
import { APIResponse } from "@/types/shared";
import {
  ConnectionQueryParams,
  PaginatedConnectionResult,
  CreateConnectionData,
  Connection,
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

export const addConnection = async (
  data: CreateConnectionData
): Promise<APIResponse<Connection>> => {
  const response = await api.post<APIResponse<Connection>>(
    "/connections",
    data
  );
  return response.data;
};
