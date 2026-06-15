<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { EnvelopeIcon, PhoneIcon } from '@heroicons/vue/24/outline'
import BaseTabs from '@shared/components/navigation/BaseTabs.vue'
import { useAuth } from '@modules/auth/composables/useAuth'
import EmailLoginForm from '@modules/auth/components/EmailLoginForm.vue'
import OtpVerification from '@modules/auth/components/OtpVerification.vue'
import PhoneLoginForm from '@modules/auth/components/PhoneLoginForm.vue'
import SignupForm from '@modules/auth/components/SignupForm.vue'
import { useAuthStore } from '@stores/auth.store'
import { resolveAuthRedirect } from '@modules/auth/utils/redirect'
import type { LoginPayload, SignupPayload } from '@modules/auth/model/types'

type AuthMode = 'login' | 'signup'
type LoginMethod = 'email' | 'phone'

const router = useRouter()
const authStore = useAuthStore()
const { signup, isLoading } = useAuth()
const { t } = useI18n()
const pendingOtpPhone = ref('')
const otpError = ref('')
const isResendingOtp = ref(false)
const loginMethod = ref<LoginMethod>('phone')
const mode = ref<AuthMode>(getInitialAuthMode())
const redirectTo = ref(getInitialAuthRedirect())

const isOtpStep = computed(() => Boolean(pendingOtpPhone.value))
const authMode = computed({
  get: () => mode.value,
  set: (nextMode: AuthMode) => {
    void setMode(nextMode)
  },
})

const authModeTabs = computed(() => [
  { label: t('auth.tabs.signIn'), value: 'login' },
  { label: t('auth.tabs.signUp'), value: 'signup' },
])

const loginMethodTabs = computed(() => [
  { label: t('auth.tabs.phone'), value: 'phone' },
  { label: t('auth.tabs.email'), value: 'email' },
])

function getInitialAuthMode(): AuthMode {
  return globalThis.history.state?.authMode === 'signup' ? 'signup' : 'login'
}

function getInitialAuthRedirect(): string {
  const redirectPath = globalThis.history.state?.authRedirect

  return typeof redirectPath === 'string' ? redirectPath : '/'
}

function setMode(nextMode: AuthMode): void {
  pendingOtpPhone.value = ''
  mode.value = nextMode

  globalThis.history.replaceState(
    {
      ...globalThis.history.state,
      authMode: nextMode,
    },
    '',
  )
}

async function submitSignup(payload: SignupPayload): Promise<void> {
  await signup(payload, redirectTo.value)
}

async function submitEmailLogin(payload: LoginPayload): Promise<void> {
  await authStore.login(payload)
  await completeOtp()
}

async function submitPhoneLogin(payload: LoginPayload): Promise<void> {
  await authStore.requestOtpLogin(payload)
  otpError.value = ''
  pendingOtpPhone.value = payload.phone ?? ''
}

async function verifyOtp(code: string): Promise<void> {
  otpError.value = ''

  try {
    await authStore.verifyOtp({
      phone: pendingOtpPhone.value,
      code,
    })

    await completeOtp()
  } catch (error) {
    otpError.value = error instanceof Error ? error.message : t('auth.validation.invalidOtp')
  }
}

async function resendOtp(): Promise<void> {
  otpError.value = ''
  isResendingOtp.value = true

  try {
    await authStore.resendCode({
      phone: pendingOtpPhone.value,
    })
  } catch (error) {
    otpError.value = error instanceof Error ? error.message : t('auth.validation.resendOtpFailed')
  } finally {
    isResendingOtp.value = false
  }
}

async function completeOtp(): Promise<void> {
  await router.replace(resolveAuthRedirect(redirectTo.value))
}

async function returnToLogin(): Promise<void> {
  await authStore.logout()
  otpError.value = ''
  pendingOtpPhone.value = ''
}
</script>

<template>
  <OtpVerification
    v-if="isOtpStep"
    :contact="pendingOtpPhone"
    :error="otpError"
    :loading="isLoading"
    :resend-loading="isResendingOtp"
    @verify="verifyOtp"
    @resend="resendOtp"
    @back="returnToLogin"
    @clear-error="otpError = ''"
  />

  <BaseTabs
    v-else
    v-model="authMode"
    class="auth-tabs auth-tabs--mode auth-mode-tabs"
    :tabs="authModeTabs"
    :aria-label="t('auth.modeLabel')"
  >
    <template #panel-login>
      <section class="auth-card auth-card--shine">
        <div class="auth-card__inner">
          <header>
            <div class="auth-card__brand">
              <img src="/favicon.svg" alt="" aria-hidden="true" />
              {{ t('auth.brand') }}
            </div>
            <h2>{{ t('auth.login.title') }}</h2>
            <p>{{ t('auth.login.subtitle') }}</p>
          </header>

          <div class="auth-form-shell">
            <BaseTabs
              v-model="loginMethod"
              class="auth-tabs auth-tabs--method"
              :tabs="loginMethodTabs"
              :aria-label="t('auth.methodLabel')"
            >
              <template #tab="{ tab }">
                <span class="auth-tab-label">
                  <span class="auth-tab-label__icon" aria-hidden="true">
                    <component :is="tab.value === 'phone' ? PhoneIcon : EnvelopeIcon" />
                  </span>
                  <span>{{ tab.label }}</span>
                </span>
              </template>

              <template #panel-phone>
                <PhoneLoginForm :loading="isLoading" @submit="submitPhoneLogin" />
              </template>

              <template #panel-email>
                <EmailLoginForm :loading="isLoading" @submit="submitEmailLogin" />
              </template>
            </BaseTabs>
          </div>
        </div>
      </section>
    </template>

    <template #panel-signup>
      <section class="auth-card auth-card--shine">
        <div class="auth-card__inner">
          <header>
            <div class="auth-card__brand">
              <img src="/favicon.svg" alt="" aria-hidden="true" />
              {{ t('auth.brand') }}
            </div>
            <h2>{{ t('auth.signup.title') }}</h2>
            <p>{{ t('auth.signup.subtitle') }}</p>
          </header>

          <SignupForm :loading="isLoading" @submit="submitSignup" @sign-in="setMode('login')" />
        </div>
      </section>
    </template>
  </BaseTabs>
</template>
