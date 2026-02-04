import { PaginationMeta } from "./pagination";

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
  type: "residential" | "commercial";
  status: "active" | "disconnected";
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Bill {
  _id: string; //
  connection: BillConnection;
  monthOf: string;
  dueDate: string;
  meterReading: number;
  chargePerCubicMeter: number; //
  consumedUnits: number; //
  amount: number; //
  status: "paid" | "unpaid" | "overdue";
  paidAt: string | null; //
  createdAt: string; //
  updatedAt: string; //
  __v: number; //
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

// export interface CreateBillData {
//   connection: string;
//   monthOf: string;
//   dueDate: string;
//   meterReading: number;
//   status: "paid" | "unpaid" | "overdue";
// }

export type CreateBillData = Omit<
  Bill,
  | "_id"
  | "connection" // Add this to omit
  | "chargePerCubicMeter"
  | "consumedUnits"
  | "amount"
  | "paidAt"
  | "createdAt"
  | "updatedAt"
  | "__v"
> & {
  connection: string; // Override with string type
};
