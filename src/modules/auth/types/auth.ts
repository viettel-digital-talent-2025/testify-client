export interface RegisterRequest {
  email: string;
  fullname: string;
  password: string;
}

export interface RegisterResponse {
  accessToken: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}
