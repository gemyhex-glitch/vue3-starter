import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { authService } from '@modules/auth/services/auth.service'
import { profileService } from '@modules/profile/services/profile.service'
import type {
  AuthSession,
  LoginPayload,
  ResendCodePayload,
  SignupPayload,
  VerifyOtpPayload,
} from '@modules/auth/model/types'
import type { User } from '@models/user/model'
import { tokenService } from '@shared/api/token.service'

function getSessionAccessToken(session: AuthSession): string | undefined {
  return session.accessToken ?? session.access_token ?? session.token
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const accessToken = ref(tokenService.getAccessToken())
  const isLoading = ref(false)
  const isProfileLoading = ref(false)
  let profileRequest: Promise<void> | undefined

  const isAuthenticated = computed(() => Boolean(accessToken.value))

  function applySession(session: AuthSession): void {
    const nextAccessToken = getSessionAccessToken(session)

    if (nextAccessToken) {
      tokenService.setAccessToken(nextAccessToken)
      accessToken.value = nextAccessToken
    }

    if (session.user) {
      user.value = session.user
    }
  }

  function clearSession(): void {
    tokenService.clearTokens()
    accessToken.value = null
    user.value = null
  }

  async function login(payload: LoginPayload): Promise<void> {
    isLoading.value = true

    try {
      const response = await authService.signIn(payload)
      applySession(response.data.data)
    } finally {
      isLoading.value = false
    }
  }

  async function signup(payload: SignupPayload): Promise<void> {
    isLoading.value = true

    try {
      const response = await authService.signUp(payload)
      applySession(response.data.data)
    } finally {
      isLoading.value = false
    }
  }

  async function verifyOtp(payload: VerifyOtpPayload): Promise<void> {
    isLoading.value = true

    try {
      const response = await authService.sendOtp(payload)
      applySession(response.data.data)
    } finally {
      isLoading.value = false
    }
  }

  async function resendCode(payload: ResendCodePayload): Promise<void> {
    await authService.resendCode(payload)
  }

  async function fetchProfile(force = false): Promise<void> {
    if (!accessToken.value) {
      return
    }

    if (user.value && !force) {
      return
    }

    if (profileRequest) {
      return profileRequest
    }

    isProfileLoading.value = true
    profileRequest = profileService
      .getProfile()
      .then((response) => {
        user.value = response.data.data
      })
      .finally(() => {
        isProfileLoading.value = false
        profileRequest = undefined
      })

    return profileRequest
  }

  async function logout(): Promise<void> {
    try {
      if (tokenService.getAccessToken()) {
        await authService.logout()
      }
    } finally {
      clearSession()
    }
  }

  return {
    user,
    isLoading,
    isProfileLoading,
    isAuthenticated,
    login,
    signup,
    verifyOtp,
    resendCode,
    fetchProfile,
    clearSession,
    logout,
  }
})
