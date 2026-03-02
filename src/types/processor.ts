import { PaginationMeta } from "./pagination";

export type ProcessorRole = "staff" | "manager";
export type ProcessorStatus = "active" | "restricted";

export interface Processor {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role: ProcessorRole;
  status: ProcessorStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginatedProcessorResult {
  processors: Processor[];
  pagination: PaginationMeta;
}

export interface ProcessorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: ProcessorRole | "all" | "";
  status?: ProcessorStatus | "all" | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateProcessorData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  password: string;
  role: ProcessorRole;
  status: ProcessorStatus;
}

// 6. Edit Payload (Automatically makes all create fields optional)
export interface EditProcessorData extends Partial<CreateProcessorData> {}
