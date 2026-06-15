import axios from 'axios'
import type { AxiosInstance } from 'axios'
import { i18n } from '@app/plugins/i18n'
import { normalizeApiError } from '@shared/api/error.handler'
import { useToastStore } from '@stores/toast.store'

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

export function attachErrorToastInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
      if (axios.isCancel(error)) {
        return Promise.reject(error)
      }

      const apiError = normalizeApiError(error)

      useToastStore().show({
        type: 'error',
        title: getErrorTitle(apiError.status),
        description: apiError.message,
      })

      return Promise.reject(apiError)
    },
  )
}
