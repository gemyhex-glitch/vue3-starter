import type { AxiosError, AxiosInstance } from 'axios'
import { normalizeApiError } from '@shared/api/error.handler'
import { router } from '@app/router'
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

export function attachAuthInterceptor(client: AxiosInstance): void {
  client.interceptors.request.use((config) => {
    const accessToken = tokenService.getAccessToken()

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`
    }

    return config
  })

  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      const status = error.response?.status

      if (status === 401 && !isAuthEndpoint(error.config?.url)) {
        redirectToAuth()
      }

      if (status === 403) {
        redirectToForbidden()
      }

      return Promise.reject(normalizeApiError(error))
    },
  )
}
