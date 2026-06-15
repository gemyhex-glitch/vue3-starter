import { apiClient } from '@shared/api/client'
import type { AxiosRequestConfig } from 'axios'
import type { ApiResponse } from '@shared/types/api'
import type {
  AuthEndpointPayload,
  AuthSession,
  LoginPayload,
  ResendCodePayload,
  SignupPayload,
  VerifyOtpPayload,
} from '@modules/auth/model/types'

async function unwrapData<TData>(request: Promise<{ data: ApiResponse<TData> }>): Promise<TData> {
  const response = await request
  return response.data.data
}

export const authService = {
  signIn(payload: LoginPayload, config?: AxiosRequestConfig): Promise<AuthSession> {
    return unwrapData(apiClient.post<ApiResponse<AuthSession>>('login', payload, config))
  },

  signUp(payload: SignupPayload): Promise<AuthSession> {
    return unwrapData(apiClient.post<ApiResponse<AuthSession>>('register', payload))
  },

  sendOtp(payload: VerifyOtpPayload, config?: AxiosRequestConfig): Promise<AuthSession> {
    return unwrapData(apiClient.post<ApiResponse<AuthSession>>('verify', payload, config))
  },

  logout() {
    return apiClient.post('logout')
  },

  resendCode(payload: ResendCodePayload, config?: AxiosRequestConfig): Promise<unknown> {
    return unwrapData(apiClient.post<ApiResponse<unknown>>('resend-code', payload, config))
  },

  forgetPasswordRequest(payload: AuthEndpointPayload): Promise<unknown> {
    return unwrapData(apiClient.post<ApiResponse<unknown>>('forget-password-request', payload))
  },

  verifyCodeForgetPassword(payload: AuthEndpointPayload): Promise<unknown> {
    return unwrapData(apiClient.post<ApiResponse<unknown>>('verify-code-forget-password', payload))
  },

  forgetPassword(payload: AuthEndpointPayload): Promise<unknown> {
    return unwrapData(apiClient.post<ApiResponse<unknown>>('forget-password', payload))
  },
}
