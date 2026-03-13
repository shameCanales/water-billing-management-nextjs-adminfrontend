import { PaginationMeta } from "./pagination";
import { ProcessorSummary } from "./processor";

export type ConsumerStatus = "active" | "suspended";

// full data for table
export interface Consumer {
  _id: string;
  firstName: string;
  middleName?: string | null;
  lastName: string;
  email: string;
  birthDate: string;
  mobileNumber: string;
  address: string;
  status: ConsumerStatus;
  createdBy: ProcessorSummary;
  lastEditBy: ProcessorSummary | null;
  lastEditAt: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// lightweight data for populating in connections and bills
export interface consumerSummary {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
}

export interface PaginatedConsumerResult {
  consumers: Consumer[];
  pagination: PaginationMeta;
}

export interface ConsumerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ConsumerStatus | "all" | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

//Create Consumer Interfaces
export interface CreateConsumerData {
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  birthDate: string; // YYYY-MM-DD
  mobileNumber: string;
  password: string;
  address: string;
  status: ConsumerStatus;
}

export interface EditConsumerData extends Partial<CreateConsumerData> {}
