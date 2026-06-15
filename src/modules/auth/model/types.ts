import type { User } from '@models/user/model'

export interface LoginPayload {
  email?: string
  country_id?: number
  phone?: string
  password: string
  type?: 'regular'
}

export interface SignupPayload {
  country_id: number
  phone: string
  password: string
  password_confirmation: string
  type: 'regular'
}

export interface VerifyOtpPayload {
  phone: string
  code: string
}

export interface ResendCodePayload {
  phone: string
}

export type AuthEndpointPayload = Record<string, unknown>

export interface AuthSession {
  accessToken?: string
  access_token?: string
  token?: string
  user?: User
}
