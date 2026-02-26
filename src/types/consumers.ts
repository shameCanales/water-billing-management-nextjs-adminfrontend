import { PaginationMeta } from "./pagination";

export interface Consumer {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
  birthDate: string;
  status: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginatedConsumerResult {
  consumers: Consumer[];
  pagination: PaginationMeta;
}

export interface ConsumerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "suspended" | "all" | "";
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
  status: "active" | "suspended";
}

export interface EditConsumerData extends Partial<CreateConsumerData> {}