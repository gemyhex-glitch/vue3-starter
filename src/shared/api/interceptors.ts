import axios from 'axios'
import type { AxiosError } from 'axios'
import { router } from '@app/router'
import { apiClient } from '@shared/api/client'
import { normalizeApiError } from '@shared/api/error.handler'
import { showApiErrorToast } from '@shared/api/error-toast.interceptor'
import { tokenService } from '@shared/api/token.service'
import { useAuthStore } from '@stores/auth.store'

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

  if (error.config?.skipAuthRedirect) {
    return
  }

  if (status === 401 && !isAuthEndpoint(error.config?.url)) {
    redirectToAuth()
  }

  if (status === 403) {
    redirectToForbidden()
  }
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

      if (!axios.isAxiosError(error) || !error.config?.suppressErrorToast) {
        showApiErrorToast(apiError)
      }

      return Promise.reject(apiError)
    },
  )

  interceptorsAttached = true
}
