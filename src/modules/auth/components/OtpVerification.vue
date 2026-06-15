<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeftIcon, ShieldCheckIcon } from '@heroicons/vue/24/outline'
import InputOtp from 'primevue/inputotp'
import BaseButton from '@shared/components/ui/BaseButton.vue'

const props = withDefaults(
  defineProps<{
    contact: string
    error?: string
    loading?: boolean
    resendLoading?: boolean
    inputCount?: number
    resendDelaySeconds?: number
  }>(),
  {
    error: '',
    loading: false,
    resendLoading: false,
    inputCount: 4,
    resendDelaySeconds: 180,
  },
)

const emit = defineEmits<{
  verify: [code: string]
  resend: []
  back: []
  clearError: []
}>()
const { t } = useI18n()

const otp = ref('')
const resendRemainingSeconds = ref(0)
let resendTimer: ReturnType<typeof globalThis.setInterval> | undefined

const otpLength = computed(() => Math.max(1, props.inputCount))
const canVerify = computed(() => otp.value.length === otpLength.value && !props.loading)
const canResend = computed(() => resendRemainingSeconds.value === 0 && !props.resendLoading)
const resendTimerLabel = computed(() => {
  const minutes = Math.floor(resendRemainingSeconds.value / 60)
  const seconds = resendRemainingSeconds.value % 60

  return `${minutes}:${String(seconds).padStart(2, '0')}`
})

function startResendTimer(): void {
  resendRemainingSeconds.value = Math.max(0, props.resendDelaySeconds)

  if (resendTimer) {
    globalThis.clearInterval(resendTimer)
  }

  resendTimer = globalThis.setInterval(() => {
    resendRemainingSeconds.value = Math.max(0, resendRemainingSeconds.value - 1)

    if (resendRemainingSeconds.value === 0 && resendTimer) {
      globalThis.clearInterval(resendTimer)
      resendTimer = undefined
    }
  }, 1000)
}

function verifyOtp(): void {
  if (!canVerify.value) {
    return
  }

  emit('clearError')
  emit('verify', otp.value)
}

function resendCode(): void {
  if (!canResend.value) {
    return
  }

  otp.value = ''
  emit('clearError')
  startResendTimer()
  emit('resend')
}

watch(otp, (value) => {
  if (props.error) {
    emit('clearError')
  }

  if (value.length === otpLength.value && !props.loading) {
    verifyOtp()
  }
})

onMounted(startResendTimer)

onBeforeUnmount(() => {
  if (resendTimer) {
    globalThis.clearInterval(resendTimer)
  }
})
</script>

<template>
  <section class="otp-card" aria-labelledby="otp-title">
    <div class="otp-card__glow" aria-hidden="true"></div>

    <form class="otp-card__content" autocomplete="one-time-code" novalidate @submit.prevent="verifyOtp">
      <div class="otp-card__topbar">
        <button type="button" class="otp-card__back" :disabled="loading" @click="emit('back')">
          <ArrowLeftIcon aria-hidden="true" />
          <span>{{ t('common.back') }}</span>
        </button>

        <span class="otp-card__step">{{ t('auth.otp.step') }}</span>
      </div>

      <header class="otp-card__header">
        <span class="otp-card__icon" aria-hidden="true">
          <ShieldCheckIcon />
        </span>

        <div>
          <div class="auth-card__brand otp-card__brand">
            <img src="/favicon.svg" alt="" aria-hidden="true" />
            {{ t('auth.brand') }}
          </div>
          <h2 id="otp-title">{{ t('auth.otp.title') }}</h2>
          <p>
            {{ t('auth.otp.instruction', { count: otpLength }) }}
            <strong>{{ contact }}</strong>
          </p>
        </div>
      </header>

      <div class="otp-card__field" :class="{ 'otp-card__field--invalid': Boolean(error) }">
        <InputOtp
          v-model="otp"
          :length="otpLength"
          integer-only
          :invalid="Boolean(error)"
          :aria-label="t('auth.otp.ariaLabel')"
          class="otp-card__input"
        />
        <p v-if="error" class="otp-card__message">{{ error }}</p>
      </div>

      <div class="otp-card__actions">
        <BaseButton type="submit" size="lg" :loading="loading" :disabled="!canVerify">
          {{ t('auth.otp.submit') }}
        </BaseButton>

        <div class="otp-card__resend-row">
          <span v-if="resendRemainingSeconds">{{ t('auth.otp.resendAvailable', { time: resendTimerLabel }) }}</span>
          <span v-else-if="resendLoading">{{ t('auth.otp.sending') }}</span>
          <span v-else>{{ t('auth.otp.notReceived') }}</span>
          <button
            type="button"
            class="otp-card__resend"
            :disabled="!canResend"
            @click="resendCode"
          >
            {{ t('auth.otp.resend') }}
          </button>
        </div>
      </div>
    </form>
  </section>
</template>

<style scoped>
.otp-card {
  position: relative;
  width: min(100%, 29rem);
  overflow: hidden;
  border: 1px solid rgb(255 255 255 / 58%);
  border-radius: 1.1rem;
  background:
    linear-gradient(150deg, rgb(255 255 255 / 72%), rgb(255 255 255 / 38%)),
    color-mix(in srgb, var(--color-surface) 82%, transparent);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 78%) inset,
    0 24px 80px rgb(15 23 42 / 18%),
    0 4px 18px rgb(15 23 42 / 8%);
  backdrop-filter: blur(24px) saturate(140%);
}

.otp-card__glow {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(115deg, rgb(255 255 255 / 42%), transparent 35%),
    linear-gradient(245deg, color-mix(in srgb, var(--color-primary) 12%, transparent), transparent 44%);
  pointer-events: none;
}

.otp-card__content {
  position: relative;
  z-index: 1;
  display: grid;
  gap: var(--space-5);
  padding: var(--space-8);
}

.otp-card__topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
}

.otp-card__back {
  display: inline-flex;
  min-height: 2.25rem;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-2);
  border: 0;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 850;
  transition:
    background 160ms ease,
    color 160ms ease,
    transform 160ms ease;
}

.otp-card__back svg {
  width: 1rem;
  height: 1rem;
}

.otp-card__back:not(:disabled):hover {
  background: color-mix(in srgb, var(--color-surface-muted) 72%, transparent);
  color: var(--color-text);
  transform: translateX(-1px);
}

.otp-card__back:disabled {
  cursor: not-allowed;
  opacity: 0.58;
}

[dir='rtl'] .otp-card__back svg {
  transform: rotate(180deg);
}

[dir='rtl'] .otp-card__back:not(:disabled):hover {
  transform: translateX(1px);
}

.otp-card__step {
  display: inline-flex;
  min-height: 1.75rem;
  align-items: center;
  padding: 0 var(--space-3);
  border: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-surface-muted) 70%, transparent);
  color: var(--color-text-muted);
  font-size: 0.72rem;
  font-weight: 850;
}

.otp-card__header {
  display: grid;
  justify-items: center;
  gap: var(--space-3);
  text-align: center;
}

.otp-card__icon {
  display: grid;
  width: 3.35rem;
  height: 3.35rem;
  place-items: center;
  border: 1px solid color-mix(in srgb, var(--color-primary) 25%, var(--color-border));
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 62%), transparent),
    color-mix(in srgb, var(--color-primary) 12%, var(--color-surface));
  color: var(--color-primary);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 70%) inset,
    0 14px 30px color-mix(in srgb, var(--color-primary) 15%, transparent);
}

.otp-card__icon svg {
  width: 1.55rem;
  height: 1.55rem;
}

.otp-card__brand {
  margin-bottom: var(--space-3);
}

.otp-card h2 {
  margin: 0;
  color: var(--color-text);
  font-size: clamp(1.75rem, 7vw, 2.15rem);
  line-height: 1.08;
  text-align: center;
}

.otp-card p {
  margin: var(--space-2) 0 0;
  color: var(--color-text-muted);
  line-height: 1.58;
  text-align: center;
}

.otp-card strong {
  display: inline-block;
  color: var(--color-text);
  font-weight: 900;
  direction: ltr;
}

.otp-card__field {
  display: grid;
  gap: var(--space-2);
  justify-items: center;
  padding: var(--space-1) 0;
}

.otp-card__input {
  display: grid;
  width: min(100%, 17.5rem);
  justify-self: center;
  grid-template-columns: repeat(v-bind(otpLength), minmax(0, 1fr));
  gap: var(--space-2);
}

.otp-card__input :deep(.p-inputtext) {
  width: 100%;
  min-width: 0;
  aspect-ratio: 1;
  border: 1px solid color-mix(in srgb, var(--color-border) 74%, transparent);
  border-radius: 0.9rem;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 72%), transparent),
    color-mix(in srgb, var(--color-surface) 92%, transparent);
  color: var(--color-text);
  font-size: clamp(1.15rem, 5vw, 1.45rem);
  font-weight: 900;
  text-align: center;
  box-shadow:
    0 1px 0 rgb(255 255 255 / 70%) inset,
    0 10px 24px rgb(15 23 42 / 6%);
  transition:
    border-color 160ms ease,
    box-shadow 160ms ease,
    transform 160ms ease;
}

.otp-card__input :deep(.p-inputtext:hover) {
  border-color: color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
}

.otp-card__input :deep(.p-inputtext:focus) {
  border-color: color-mix(in srgb, var(--color-primary) 68%, var(--color-border));
  box-shadow:
    0 0 0 3px color-mix(in srgb, var(--color-primary) 13%, transparent),
    0 12px 28px rgb(15 23 42 / 8%);
  outline: none;
  transform: translateY(-1px);
}

.otp-card__field--invalid .otp-card__input :deep(.p-inputtext),
.otp-card__input :deep(.p-invalid) {
  border-color: var(--color-danger);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-danger) 12%, transparent);
}

.otp-card__message {
  width: 100%;
  margin: 0;
  color: var(--color-danger);
  font-size: 0.82rem;
  font-weight: 750;
  text-align: center;
}

.otp-card__actions {
  display: grid;
  gap: var(--space-3);
  width: min(100%, 17.5rem);
  justify-self: center;
}

.otp-card__actions :deep(.base-button) {
  width: 100%;
}

.otp-card__resend-row {
  display: flex;
  min-height: 2.35rem;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

.otp-card__resend {
  padding: 0;
  border: 0;
  background: transparent;
  color: var(--color-primary);
  cursor: pointer;
  font-weight: 900;
}

.otp-card__resend:disabled {
  color: var(--color-text-muted);
  cursor: not-allowed;
  opacity: 0.68;
}

:root.dark .otp-card {
  background:
    linear-gradient(150deg, rgb(17 24 39 / 78%), rgb(17 24 39 / 44%)),
    color-mix(in srgb, var(--color-surface) 78%, transparent);
}

@media (max-width: 420px) {
  .otp-card__content {
    gap: var(--space-5);
    padding: var(--space-6);
  }

  .otp-card__topbar {
    align-items: flex-start;
  }

  .otp-card__input {
    gap: var(--space-1);
  }

  .otp-card__input :deep(.p-inputtext) {
    border-radius: 0.75rem;
  }

  .otp-card__resend-row {
    flex-wrap: wrap;
  }
}
</style>
