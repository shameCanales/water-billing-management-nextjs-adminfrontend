import { PaginationMeta } from "./pagination";

export type ProcessorRole = "staff" | "manager";
export type ProcessorStatus = "active" | "restricted";

//full detail
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

// populate summary
export type ProcessorSummary = Pick<
  Processor,
  "firstName" | "middleName" | "lastName" | "role"
>;

export interface CreateProcessorData extends Omit<
  Processor,
  "_id" | "createdAt" | "updatedAt" | "__v"
> {
  password: string;
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

export interface EditProcessorData extends Partial<CreateProcessorData> {}
