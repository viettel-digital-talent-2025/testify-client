export interface User {
  id: string;
  email: string;
  firstname: string;
  lastname: string;
}

export interface RegisterRequest {
  email: string;
  fullname: string;
  password: string;
}

export interface RegisterResponse {
  user: User;
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
