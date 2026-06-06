export interface AuthResponse {
  token: string;
}

export interface AuthMeResponse {
  username: string;
  email: string;
  role: string;
}

export interface LogoutResponse {
  message: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface CreateCustomerRequest {
  name: string;
  email: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
}

export interface EnvironmentInfo {
  application: string;
  port: string;
  message: string;
  activeProfile: string;
}
