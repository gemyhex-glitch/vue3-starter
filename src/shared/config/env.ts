function envBoolean(value: unknown, fallback: boolean): boolean {
  if (value === 'true') return true
  if (value === 'false') return false

  return fallback
}

function envString(value: unknown, fallback: string): string {
  return typeof value === 'string' && value.trim() ? value : fallback
}

export const env = {
  apiBaseUrl: envString(import.meta.env.VITE_API_BASE_URL, '/api'),
  apiKey: envString(import.meta.env.VITE_API_KEY, ''),
  defaultLocale: envString(import.meta.env.VITE_DEFAULT_LOCALE, 'en'),
  useMockApi: envBoolean(import.meta.env.VITE_USE_MOCK_API, true),
} as const
