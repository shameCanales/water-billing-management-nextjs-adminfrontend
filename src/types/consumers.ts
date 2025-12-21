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

// 1. THe Output: What the backend sends back inside data
export interface PaginationMeta {
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface PaginatedConsumerResult {
  consumers: Consumer[];
  pagination: PaginationMeta;
}

// 2. The Input: What we send to the backend
export interface ConsumerQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: "active" | "suspended" | "all" | "";
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
