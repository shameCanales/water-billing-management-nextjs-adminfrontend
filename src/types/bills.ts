import { PaginationMeta } from "./pagination";
import type {
  ConnectionStatus,
  ConnectionType,
  ConnectionSummary,
} from "./connections";
import { ProcessorSummary } from "./processor";

export type BillStatus = "paid" | "unpaid" | "overdue";

export interface BillConsumer {
  firstName: string;
  middleName?: string;
  lastName: string;
  mobileNumber: string;
  // _id: string;
  // email: string;
  // address: string;
}

export interface BillConnection {
  _id: string;
  consumer: BillConsumer;
  meterNumber: number;
  address: string;
  type: ConnectionType;
  // connectionDate: string;
  // status: ConnectionStatus;
  // createdAt: string;
  // updatedAt: string;
  // __v: number;
}

// complete data for viewing
export interface Bill {
  _id: string;
  connection: BillConnection;
  monthOf: string;
  dueDate: string;
  meterReading: number;
  chargePerCubicMeter: number;
  appliedSurchargePercent: number;
  consumedUnits: number;
  billAmount: number;
  surchargeAmount: number;
  totalAmount: number;
  status: BillStatus;
  paidAt: string | null;
  createdBy: ProcessorSummary;
  lastEditBy: ProcessorSummary | null;
  lastEditAt: string | null;
  processedBy: ProcessorSummary | null;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

// lightweight data for list
export interface BillSummary {
  _id: string;
  connection: ConnectionSummary;
  monthOf: string;
  dueDate: string;
  meterReading: number;
  chargePerCubicMeter: number;
  consumedUnits: number;
  billAmount: number;
  surchargeAmount: number;
  totalAmount: number;
  status: BillStatus;
  paidAt: string | null;
  createdBy: ProcessorSummary;
  lastEditBy: ProcessorSummary;
  lastEditAt: string | null;
  processedBy: ProcessorSummary;
  createdAt: string;
}

export interface PaginatedBillResult {
  bills: BillSummary[];
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
