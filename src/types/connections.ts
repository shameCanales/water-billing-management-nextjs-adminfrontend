import { PaginationMeta } from "./pagination";
import type { consumerSummary } from "./consumers";
import { ProcessorSummary } from "./processor";

export type ConnectionType = "residential" | "commercial";
export type ConnectionStatus = "connected" | "disconnected";

export interface ConnectionConsumer {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
}

// should we have different types for fulldetails, listdetails, and populatesummarydetails?

export interface Connection {
  _id: string;
  consumer: consumerSummary;
  meterNumber: number;
  address: string;
  type: ConnectionType;
  status: ConnectionStatus;
  connectionDate: string;
  creatdBy: ProcessorSummary;
  lastEditBy: ProcessorSummary | null;
  lastEditAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConnectionSummary {
  consumer: consumerSummary;
  meterNumber: number;
  address: string;
  type: ConnectionType;
}

export interface PaginatedConnectionResult {
  connections: Connection[];
  pagination: PaginationMeta;
}

export interface ConnectionQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ConnectionStatus | "all" | "";
  type?: ConnectionType | "all" | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateConnectionData extends Pick<
  Connection,
  "meterNumber" | "address" | "connectionDate" | "type" | "status"
> {
  consumer: string;
}

export interface EditConnectionData extends Partial<
  Omit<CreateConnectionData, "consumer" | "status">
> {}
