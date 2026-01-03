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

export interface CreateConsumerResponse {
  success: boolean;
  message: string;
  data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    birthDate: string; // YYYY-MM-DD
    mobileNumber: string;
    address: string;
    status: "active" | "suspended";
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}
export interface UpdateConsumerResponse {
  success: boolean;
  message: string;
  data: {
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    birthDate: string; // YYYY-MM-DD
    mobileNumber: string;
    address: string;
    status: "active" | "suspended";
    _id: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
}

// Edit Consumer Interface
export interface EditConsumerData {
  firstName?: string;
  middleName?: string;
  lastName?: string;
  email?: string;
  birthDate?: string; // YYYY-MM-DD
  mobileNumber?: string;
  password?: string;
  address?: string;
  status?: "active" | "suspended";
}

export interface EditConsumerResponse {
  success: boolean;
  message: string;
  data: Consumer;
}
