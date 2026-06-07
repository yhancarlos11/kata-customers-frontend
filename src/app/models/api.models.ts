export interface AuthResponse {
  token: string;
  refreshToken: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
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

export interface Product {
  id: number;
  name: string;
  price: number;
  description?: string;
}

export interface CreateProductRequest {
  name: string;
  price: number;
  description?: string;
}

export interface CustomerDetail extends Customer {
  createdAt: string;
  products: Product[];
}
