export const storageKeys = {
  accessToken: 'starter.accessToken',
  locale: 'starter.locale',
  theme: 'starter.theme',
  sidebarCollapsed: 'starter.sidebarCollapsed',
} as const

export type StorageKey = keyof typeof storageKeys
