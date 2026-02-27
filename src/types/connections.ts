import { PaginationMeta } from "./pagination";

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

export interface Connection {
  _id: string;
  consumer: ConnectionConsumer;
  meterNumber: number;
  address: string;
  connectionDate: string;
  type: ConnectionType;
  status: ConnectionStatus;
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
