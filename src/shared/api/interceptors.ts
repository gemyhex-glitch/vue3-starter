import { apiClient } from '@shared/api/client'
import { attachAuthInterceptor } from '@shared/api/auth.interceptor'
import { attachErrorToastInterceptor } from '@shared/api/error-toast.interceptor'

let attached = false

export function attachApiInterceptors(): void {
  if (attached) {
    return
  }

  attachAuthInterceptor(apiClient)
  attachErrorToastInterceptor(apiClient)
  attached = true
}
