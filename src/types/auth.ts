export interface User {
  _id: string;
  email: string;
  role: string;
  type: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
