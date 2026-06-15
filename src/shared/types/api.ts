export interface ApiResponse<TData> {
  data: TData
  message?: string
  meta?: Record<string, unknown>
}

export interface ApiErrorPayload {
  message: string
  code?: string
  status?: number
  details?: Record<string, string[]>
}
