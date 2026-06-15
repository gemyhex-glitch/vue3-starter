import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@stores/auth.store'
import { resolveAuthRedirect } from '@modules/auth/utils/redirect'
import type { LoginPayload, SignupPayload } from '@modules/auth/model/types'

export function useAuth() {
  const router = useRouter()
  const authStore = useAuthStore()
  const { user, isAuthenticated, isLoading, isProfileLoading } = storeToRefs(authStore)

  async function login(payload: LoginPayload, redirectTo = '/'): Promise<void> {
    await authStore.login(payload)
    await router.replace(resolveAuthRedirect(redirectTo))
  }

  async function signup(payload: SignupPayload, redirectTo = '/'): Promise<void> {
    await authStore.signup(payload)
    await router.replace(resolveAuthRedirect(redirectTo))
  }

  async function logout(): Promise<void> {
    await authStore.logout()
    await router.push({ name: 'auth' })
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isProfileLoading,
    fetchProfile: authStore.fetchProfile,
    login,
    signup,
    logout,
  }
}
