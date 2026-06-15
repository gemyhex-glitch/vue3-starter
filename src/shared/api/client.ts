import axios from 'axios'
import type { AxiosError } from 'axios'
import { router } from '@app/router'
import { i18n } from '@app/plugins/i18n'
import { env } from '@shared/config/env'
import { tokenService } from '@shared/api/token.service'
import { useAuthStore } from '@stores/auth.store'
import { useToastStore } from '@stores/toast.store'
import type { ApiErrorPayload } from '@shared/types/api'

export const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    ...(env.apiKey ? { 'api-key': env.apiKey } : {}),
  },
  timeout: 20_000,
})

export class ApiError extends Error {
  readonly status: number | undefined
  readonly code: string | undefined
  readonly details: Record<string, string[]> | undefined

  constructor(payload: ApiErrorPayload) {
    super(payload.message)
    this.name = 'ApiError'
    this.status = payload.status
    this.code = payload.code
    this.details = payload.details
  }
}

const authEndpoints = [
  'login',
  'register',
  'verify',
  'logout',
  'resend-code',
  'forget-password-request',
  'verify-code-forget-password',
  'forget-password',
]

let interceptorsAttached = false

function isAuthEndpoint(url: string | undefined): boolean {
  const normalizedUrl = url?.replace(/^\/+/, '') ?? ''

  return authEndpoints.some(
    (endpoint) => normalizedUrl === endpoint || normalizedUrl.startsWith(`${endpoint}?`),
  )
}

function normalizeApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error
  }

  if (axios.isAxiosError(error)) {
    const payload = error.response?.data as Partial<ApiErrorPayload> | undefined

    return new ApiError({
      message: payload?.message ?? error.message ?? i18n.global.t('api.errors.fallback'),
      code: payload?.code,
      status: error.response?.status,
      details: payload?.details,
    })
  }

  if (error instanceof Error) {
    return new ApiError({ message: error.message })
  }

  return new ApiError({ message: i18n.global.t('api.errors.fallback') })
}

function getErrorTitle(status: number | undefined): string {
  if (status === 401) {
    return i18n.global.t('api.errors.authenticationFailed')
  }

  if (status === 403) {
    return i18n.global.t('api.errors.accessDenied')
  }

  if (status === 404) {
    return i18n.global.t('api.errors.notFound')
  }

  if (status && status >= 500) {
    return i18n.global.t('api.errors.serverError')
  }

  return i18n.global.t('api.errors.requestFailed')
}

function redirectToAuth(): void {
  useAuthStore().clearSession()

  if (router.currentRoute.value.name !== 'auth') {
    void router.push({
      name: 'auth',
      state: { authRedirect: router.currentRoute.value.fullPath },
    })
  }
}

function redirectToForbidden(): void {
  if (router.currentRoute.value.name !== 'forbidden') {
    void router.push({ name: 'forbidden' })
  }
}

function handleUnauthorized(error: AxiosError): void {
  const status = error.response?.status

  if (status === 401 && !isAuthEndpoint(error.config?.url)) {
    redirectToAuth()
  }

  if (status === 403) {
    redirectToForbidden()
  }
}

function showApiErrorToast(error: ApiError): void {
  useToastStore().show({
    type: 'error',
    title: getErrorTitle(error.status),
    description: error.message,
  })
}

export function attachApiInterceptors(): void {
  if (interceptorsAttached) {
    return
  }

  apiClient.interceptors.request.use((config) => {
    const accessToken = tokenService.getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }

      if (axios.isAxiosError(error)) {
        handleUnauthorized(error)
      }

      const apiError = normalizeApiError(error)
      showApiErrorToast(apiError)

      return Promise.reject(apiError)
    },
  )

  interceptorsAttached = true
}
