import { i18n } from '@app/plugins/i18n'
import { useToastStore } from '@stores/toast.store'
import type { ApiError } from '@shared/api/error.handler'

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

export function showApiErrorToast(error: ApiError): void {
  useToastStore().show({
    type: 'error',
    title: getErrorTitle(error.status),
    description: error.message,
  })
}

