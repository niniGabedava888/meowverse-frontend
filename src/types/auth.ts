export interface RegisterRequest {
  email: string;
  name: string;
  surname: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: number;
  email: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}
