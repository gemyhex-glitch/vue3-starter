import { storageKeys, type StorageKey } from '@shared/constants/storage'

function resolveKey(key: StorageKey): string {
  return storageKeys[key]
}

export const storage = {
  get(key: StorageKey): string | null {
    if (typeof window === 'undefined') {
      return null
    }

    return window.localStorage.getItem(resolveKey(key))
  },

  set(key: StorageKey, value: string): void {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.setItem(resolveKey(key), value)
  },

  remove(key: StorageKey): void {
    if (typeof window === 'undefined') {
      return
    }

    window.localStorage.removeItem(resolveKey(key))
  },
}
