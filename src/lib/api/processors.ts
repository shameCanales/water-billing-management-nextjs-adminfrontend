import { api } from "./api";
import { APIResponse } from "@/types/shared";
import {
  ProcessorQueryParams,
  PaginatedProcessorResult,
  CreateProcessorData,
  Processor,
  EditProcessorData,
} from "@/types/processor";

export const getAllProcessors = async (
  params: ProcessorQueryParams = {}, // Default to empty object
  signal?: AbortSignal,
) => {
  const response = await api.get<APIResponse<PaginatedProcessorResult>>(
    "/processors",
    { params, signal },
  );
  return response.data.data;
};

export const addProcessor = async (
  data: CreateProcessorData,
): Promise<APIResponse<Processor>> => {
  const response = await api.post("/processors", data);
  return response.data;
};

// Update processor status (active/restricted)
export const updateProcessorStatus = async (
  id: string,
  status: "active" | "restricted",
): Promise<APIResponse<Processor>> => {
  const response = await api.patch<APIResponse<Processor>>(
    `/processors/${id}/status`,
    { status },
  );
  return response.data;
};

// // Get a single processor by ID
// export const getProcessorById = async (
//   id: string,
//   signal?: AbortSignal,
// ): Promise<APIResponse<Processor>> => {
//   const response = await api.get<APIResponse<Processor>>(
//     `/processors/${id}`,
//     { signal }
//   );
//   return response.data;
// };

// // Edit a processor's details
// export const editProcessor = async (
//   id: string,
//   data: EditProcessorData,
// ): Promise<APIResponse<Processor>> => {
//   const response = await api.patch<APIResponse<Processor>>(
//     `/processors/${id}`,
//     data,
//   );
//   return response.data;
// };

// // Delete a processor
// export const deleteProcessor = async (
//   id: string,
// ): Promise<{
//   success: boolean;
//   message: string;
// }> => {
//   const response = await api.delete(`/processors/${id}`);
//   return response.data;
// };

// // Register the very first manager (Initial setup / Public route)
// export const registerManager = async (
//   data: CreateProcessorData,
// ): Promise<APIResponse<Processor>> => {
//   const response = await api.post<APIResponse<Processor>>(
//     "/processors/register",
//     data,
//   );
//   return response.data;
// };
