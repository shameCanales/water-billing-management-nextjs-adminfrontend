export interface UserProfile {
  _id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  email: string;
  role?: "staff" | "manager";
  status?: "active" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface APIResponse<T> {
  success: boolean;
  message: string;
  data: T;
}
