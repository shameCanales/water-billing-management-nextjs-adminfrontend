import { PaginationMeta } from "./pagination";

export type BillStatus = "paid" | "unpaid" | "overdue";
export type ConnectionType = "residential" | "commercial";
export type ConnectionStatus = "connected" | "disconnected";

export interface BillConsumer {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  address: string;
}

export interface BillConnection {
  _id: string;
  consumer: BillConsumer;
  meterNumber: number;
  address: string;
  connectionDate: string;
  type: ConnectionType;
  status: ConnectionStatus;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Bill {
  _id: string;
  connection: BillConnection;
  monthOf: string;
  dueDate: string;
  meterReading: number;
  chargePerCubicMeter: number;
  consumedUnits: number;
  amount: number;
  status: BillStatus;
  paidAt: string | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface PaginatedBillResult {
  bills: Bill[];
  pagination: PaginationMeta;
}

export interface BillQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "paid" | "unpaid" | "overdue" | "all";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface CreateBillData extends Pick<
  Bill,
  "monthOf" | "dueDate" | "meterReading" | "status"
> {
  connection: string;
}

export interface EditBillData extends Partial<
  Omit<CreateBillData, "connection">
> {}
