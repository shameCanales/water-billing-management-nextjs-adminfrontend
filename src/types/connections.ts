export interface Connection {
  _id: string;
  consumer: string;
  meterNumber: number;
  address: string;
  connectionDate: string;
  type: "residential" | "commercial";
  status: "active" | "disconnected";
  createdAt: string;
  updatedAt: string;
}
