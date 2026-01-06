import { api } from "./api";
import { APIResponse } from "@/types/user";

export const getAllConnections = async (signal?: AbortSignal) => {
  const response = await api.get("/connections", { signal });
  return response.data.data;
};
