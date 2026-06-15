<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { RouterLink } from 'vue-router'
import { BellIcon } from '@heroicons/vue/24/outline'
import BaseLoader from '@shared/components/feedback/BaseLoader.vue'
import NotificationListItem from '@modules/notifications/components/NotificationListItem.vue'
import { useNotifications } from '@modules/notifications/composables/useNotifications'

const rootRef = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const { t } = useI18n()
const {
  notifications,
  unreadCount,
  isLoading,
  isLoadingMore,
  hasMore,
  sentinelRef,
  scrollRootRef,
  loadInitial,
} = useNotifications({ perPage: 5 })

function toggleDropdown(): void {
  isOpen.value = !isOpen.value
}

function closeDropdown(): void {
  isOpen.value = false
}

function handleDocumentClick(event: MouseEvent): void {
  if (!rootRef.value?.contains(event.target as Node)) {
    closeDropdown()
  }
}

function setScrollRoot(element: Element | ComponentPublicInstance | null): void {
  scrollRootRef.value = element instanceof HTMLElement ? element : null
}

function setSentinel(element: Element | ComponentPublicInstance | null): void {
  sentinelRef.value = element instanceof HTMLElement ? element : null
}

onMounted(() => {
  globalThis.document.addEventListener('click', handleDocumentClick)
  void loadInitial()
})

onBeforeUnmount(() => {
  globalThis.document.removeEventListener('click', handleDocumentClick)
})
</script>

<template>
  <div ref="rootRef" class="notifications-dropdown">
    <button
      type="button"
      class="notifications-dropdown__trigger"
      :aria-expanded="isOpen"
      aria-haspopup="dialog"
      :aria-label="t('notifications.title')"
      @click.stop="toggleDropdown"
      @keydown.escape="closeDropdown"
    >
      <BellIcon aria-hidden="true" />
      <span v-if="unreadCount" class="notifications-dropdown__badge">
        {{ unreadCount }}
      </span>
    </button>

    <section v-if="isOpen" class="notifications-dropdown__panel" :aria-label="t('notifications.title')">
      <header class="notifications-dropdown__header">
        <div>
          <strong>{{ t('notifications.title') }}</strong>
          <small>{{ t('common.unread', { count: unreadCount }) }}</small>
        </div>
        <RouterLink to="/notifications" @click="closeDropdown">{{ t('common.viewAll') }}</RouterLink>
      </header>

      <div :ref="setScrollRoot" class="notifications-dropdown__list">
        <div v-if="isLoading" class="notifications-dropdown__loader">
          <BaseLoader size="sm" :label="t('notifications.loading')" />
        </div>

        <template v-else>
          <NotificationListItem
            v-for="notification in notifications"
            :key="notification.id"
            :notification="notification"
            compact
          />

          <p v-if="notifications.length === 0" class="notifications-dropdown__empty">
            {{ t('notifications.emptyDropdown') }}
          </p>

          <div :ref="setSentinel" class="notifications-dropdown__sentinel">
            <BaseLoader v-if="isLoadingMore" size="sm" :label="t('notifications.loadingMore')" />
            <span v-else-if="!hasMore && notifications.length">{{ t('notifications.caughtUp') }}</span>
          </div>
        </template>
      </div>
    </section>
  </div>
</template>

<style scoped>
.notifications-dropdown {
  position: relative;
}

.notifications-dropdown__trigger {
  position: relative;
  display: inline-grid;
  width: 2.25rem;
  height: 2.25rem;
  place-items: center;
  border: 0;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  transition:
    background 140ms ease,
    color 140ms ease,
    box-shadow 140ms ease;
}

.notifications-dropdown__trigger:hover,
.notifications-dropdown__trigger[aria-expanded='true'] {
  background: color-mix(in srgb, var(--color-surface-muted) 84%, transparent);
  color: var(--color-text);
}

.notifications-dropdown__trigger svg {
  width: 1.1rem;
  height: 1.1rem;
}

.notifications-dropdown__badge {
  position: absolute;
  top: 0.24rem;
  right: 0.22rem;
  display: inline-grid;
  min-width: 1rem;
  height: 1rem;
  place-items: center;
  border: 2px solid var(--color-surface);
  border-radius: 999px;
  background: var(--color-danger);
  color: white;
  font-size: 0.62rem;
  font-weight: 900;
  line-height: 1;
}

.notifications-dropdown__panel {
  position: absolute;
  z-index: 50;
  top: calc(100% + var(--space-3));
  right: 0;
  display: grid;
  width: min(23rem, calc(100vw - 2rem));
  overflow: hidden;
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: var(--radius-lg);
  background:
    linear-gradient(135deg, rgb(255 255 255 / 82%), rgb(255 255 255 / 42%)),
    color-mix(in srgb, var(--color-surface) 88%, transparent);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 72%) inset,
    0 22px 56px rgb(15 23 42 / 18%);
  backdrop-filter: blur(22px) saturate(145%);
}

[dir='rtl'] .notifications-dropdown__panel {
  right: auto;
  left: 0;
}

.notifications-dropdown__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-4);
  padding: var(--space-4);
  border-bottom: 1px solid color-mix(in srgb, var(--color-border) 70%, transparent);
}

.notifications-dropdown__header div {
  display: grid;
  gap: 0.15rem;
}

.notifications-dropdown__header strong {
  color: var(--color-text);
  font-size: 0.95rem;
}

.notifications-dropdown__header small {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

.notifications-dropdown__header a {
  color: var(--color-primary);
  font-size: 0.78rem;
  font-weight: 900;
}

.notifications-dropdown__list {
  display: grid;
  max-height: min(27rem, calc(100vh - 8rem));
  gap: var(--space-2);
  overflow-y: auto;
  padding: var(--space-3);
}

.notifications-dropdown__loader,
.notifications-dropdown__sentinel,
.notifications-dropdown__empty {
  display: grid;
  min-height: 2.5rem;
  place-items: center;
  margin: 0;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 800;
}

:root.dark .notifications-dropdown__panel {
  background:
    linear-gradient(135deg, rgb(17 24 39 / 84%), rgb(17 24 39 / 44%)),
    color-mix(in srgb, var(--color-surface) 82%, transparent);
}
</style>
