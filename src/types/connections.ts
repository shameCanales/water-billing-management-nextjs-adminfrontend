import { PaginationMeta } from "./pagination";

export interface ConnectionConsumer {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

export interface Connection {
  _id: string;
  consumer: ConnectionConsumer;
  meterNumber: number;
  address: string;
  connectionDate: string;
  type: "residential" | "commercial";
  status: "connected" | "disconnected";
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedConnectionResult {
  connections: Connection[];
  pagination: PaginationMeta;
}

export interface ConnectionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "connected" | "disconnected" | "all" | "";
  type?: "residential" | "commercial" | "all" | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateConnectionData {
  consumer: string;
  meterNumber: number;
  address: string;
  connectionDate: string;
  type: "residential" | "commercial";
  status: "connected" | "disconnected";
}

export interface EditConnectionData {
  meterNumber?: number;
  address?: string;
  connectionDate?: string;
  type?: "residential" | "commercial";
}
