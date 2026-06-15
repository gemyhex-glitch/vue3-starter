import { storage } from '@shared/utils/storage'

export const tokenService = {
  getAccessToken(): string | null {
    return storage.get('accessToken')
  },

  setAccessToken(accessToken: string): void {
    storage.set('accessToken', accessToken)
  },

  clearTokens(): void {
    storage.remove('accessToken')
  },
}
