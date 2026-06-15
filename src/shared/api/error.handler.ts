import axios from 'axios'
import { i18n } from '@app/plugins/i18n'
import type { ApiErrorPayload } from '@shared/types/api'

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

export function normalizeApiError(error: unknown): ApiError {
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

