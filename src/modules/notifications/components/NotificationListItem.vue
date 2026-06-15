<script setup lang="ts">
import {
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
import type { Component } from 'vue'
import { useI18n } from 'vue-i18n'
import type { NotificationItem } from '@modules/notifications/model/types'

const props = withDefaults(
  defineProps<{
    notification: NotificationItem
    compact?: boolean
  }>(),
  {
    compact: false,
  },
)

const typeIcons: Record<NotificationItem['type'], Component> = {
  info: InformationCircleIcon,
  success: CheckCircleIcon,
  warning: ExclamationTriangleIcon,
  danger: XCircleIcon,
}

const { locale, t } = useI18n()

function formatRelativeTime(value: string): string {
  const relativeTimeFormatter = new Intl.RelativeTimeFormat(locale.value, { numeric: 'auto' })
  const createdAt = new Date(value).getTime()
  const diffSeconds = Math.round((createdAt - Date.now()) / 1000)
  const absSeconds = Math.abs(diffSeconds)

  if (absSeconds < 60) {
    return relativeTimeFormatter.format(diffSeconds, 'second')
  }

  if (absSeconds < 3600) {
    return relativeTimeFormatter.format(Math.round(diffSeconds / 60), 'minute')
  }

  if (absSeconds < 86_400) {
    return relativeTimeFormatter.format(Math.round(diffSeconds / 3600), 'hour')
  }

  return relativeTimeFormatter.format(Math.round(diffSeconds / 86_400), 'day')
}
</script>

<template>
  <article
    class="notification-item"
    :class="[
      `notification-item--${props.notification.type}`,
      {
        'notification-item--compact': props.compact,
        'notification-item--unread': !props.notification.read,
      },
    ]"
  >
    <span class="notification-item__icon" aria-hidden="true">
      <component :is="typeIcons[props.notification.type]" />
    </span>

    <span class="notification-item__content">
      <span class="notification-item__header">
        <strong>{{ props.notification.title }}</strong>
        <time :datetime="props.notification.createdAt">
          {{ formatRelativeTime(props.notification.createdAt) }}
        </time>
      </span>
      <span class="notification-item__body">{{ props.notification.body }}</span>
    </span>

    <span v-if="!props.notification.read" class="notification-item__dot" :aria-label="t('notifications.unreadLabel')"></span>
  </article>
</template>

<style scoped>
.notification-item {
  position: relative;
  display: grid;
  grid-template-columns: auto minmax(0, 1fr) auto;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: var(--radius-md);
  background:
    linear-gradient(135deg, rgb(255 255 255 / 54%), rgb(255 255 255 / 18%)),
    color-mix(in srgb, var(--color-surface) 90%, transparent);
  box-shadow: 0 1px 0 rgb(255 255 255 / 48%) inset;
}

.notification-item--compact {
  padding: var(--space-3);
  border-radius: var(--radius-sm);
  box-shadow: none;
}

.notification-item--unread {
  border-color: color-mix(in srgb, var(--color-primary) 28%, var(--color-border));
  background:
    linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 8%, white), rgb(255 255 255 / 18%)),
    color-mix(in srgb, var(--color-surface) 92%, transparent);
}

.notification-item__icon {
  display: grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border-radius: 999px;
  background: color-mix(in srgb, var(--color-primary) 10%, var(--color-surface));
  color: var(--color-primary);
}

.notification-item--success .notification-item__icon {
  background: color-mix(in srgb, var(--color-success) 10%, var(--color-surface));
  color: var(--color-success);
}

.notification-item--warning .notification-item__icon {
  background: color-mix(in srgb, var(--color-warning) 12%, var(--color-surface));
  color: var(--color-warning);
}

.notification-item--danger .notification-item__icon {
  background: color-mix(in srgb, var(--color-danger) 10%, var(--color-surface));
  color: var(--color-danger);
}

.notification-item__icon svg {
  width: 1.15rem;
  height: 1.15rem;
}

.notification-item__content {
  display: grid;
  min-width: 0;
  gap: var(--space-1);
}

.notification-item__header {
  display: flex;
  min-width: 0;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-2);
}

.notification-item__header strong {
  min-width: 0;
  overflow: hidden;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 900;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.notification-item__header time {
  flex: 0 0 auto;
  color: var(--color-text-muted);
  font-size: 0.72rem;
  font-weight: 800;
}

.notification-item__body {
  display: -webkit-box;
  overflow: hidden;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  line-height: 1.5;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}

.notification-item__dot {
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 999px;
  margin-top: 0.5rem;
  background: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 14%, transparent);
}

:root.dark .notification-item,
:root.dark .notification-item--unread {
  background:
    linear-gradient(135deg, rgb(17 24 39 / 58%), rgb(17 24 39 / 24%)),
    color-mix(in srgb, var(--color-surface) 82%, transparent);
}
</style>
