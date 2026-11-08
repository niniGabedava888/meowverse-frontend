import { http } from './http'
import type { AuthResponse, LoginRequest, RegisterRequest } from '@/types/auth'

export function register(data: RegisterRequest): Promise<AuthResponse> {
  return http<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(data: LoginRequest): Promise<AuthResponse> {
  return http<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}
