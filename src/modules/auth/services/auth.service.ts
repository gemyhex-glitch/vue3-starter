import { apiClient } from '@shared/api/client'
import type { ApiResponse } from '@shared/types/api'
import type {
  AuthEndpointPayload,
  AuthSession,
  LoginPayload,
  ResendCodePayload,
  SignupPayload,
  VerifyOtpPayload,
} from '@modules/auth/model/types'

export const authService = {
  signIn(payload: LoginPayload) {
    return apiClient.post<ApiResponse<AuthSession>>('login', payload)
  },

  signUp(payload: SignupPayload) {
    return apiClient.post<ApiResponse<AuthSession>>('register', payload)
  },

  sendOtp(payload: VerifyOtpPayload) {
    return apiClient.post<ApiResponse<AuthSession>>('verify', payload)
  },

  logout() {
    return apiClient.post('logout')
  },

  resendCode(payload: ResendCodePayload) {
    return apiClient.post<ApiResponse<unknown>>('resend-code', payload)
  },

  forgetPasswordRequest(payload: AuthEndpointPayload) {
    return apiClient.post<ApiResponse<unknown>>('forget-password-request', payload)
  },

  verifyCodeForgetPassword(payload: AuthEndpointPayload) {
    return apiClient.post<ApiResponse<unknown>>('verify-code-forget-password', payload)
  },

  ForgetPassword(payload: AuthEndpointPayload) {
    return apiClient.post<ApiResponse<unknown>>('forget-password', payload)
  },
}
