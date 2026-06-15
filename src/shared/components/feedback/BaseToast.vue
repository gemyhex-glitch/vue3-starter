<script setup lang="ts">
import {
  CheckCircleIcon,
  InformationCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from '@heroicons/vue/24/outline'
import Button from 'primevue/button'
import { useNow } from '@vueuse/core'
import { useI18n } from 'vue-i18n'
import { useToastStore } from '@stores/toast.store'
import type { ToastMessage } from '@stores/toast.store'
import type { ToastType } from '@stores/toast.store'

const toastStore = useToastStore()
const now = useNow({ interval: 100 })
const { t } = useI18n()

const icons: Record<ToastType, typeof CheckCircleIcon> = {
  success: CheckCircleIcon,
  info: InformationCircleIcon,
  error: XCircleIcon,
}

function getProgress(message: ToastMessage): number {
  const elapsed = now.value.getTime() - message.createdAt
  return Math.max(0, Math.min(1, 1 - elapsed / message.duration))
}
</script>

<template>
  <div class="toast-region" aria-live="polite" aria-relevant="additions removals">
    <article
      v-for="message in toastStore.messages"
      :key="message.id"
      class="toast"
      :class="`toast--${message.type}`"
    >
      <span class="toast__icon">
        <component :is="icons[message.type]" aria-hidden="true" />
      </span>

      <div class="toast__content">
        <strong>{{ message.title }}</strong>
        <p v-if="message.description">{{ message.description }}</p>
      </div>

      <Button
        type="button"
        unstyled
        class="toast__close"
        :aria-label="t('feedback.dismissNotification')"
        @click="toastStore.dismiss(message.id)"
      >
        <XMarkIcon aria-hidden="true" />
      </Button>

      <span
        class="toast__progress"
        :style="{ transform: `scaleX(${getProgress(message)})` }"
        aria-hidden="true"
      />
    </article>
  </div>
</template>
