export interface User {
  _id: string;
  username: string;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token?: string;
  };
}

export interface LoginCredentials {
  username: string;
  password: string;
}
