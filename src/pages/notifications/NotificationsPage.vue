<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import { useI18n } from 'vue-i18n'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import BaseEmptyState from '@shared/components/feedback/BaseEmptyState.vue'
import BaseInput from '@shared/components/form/BaseInput.vue'
import BaseLoader from '@shared/components/feedback/BaseLoader.vue'
import NotificationListItem from '@modules/notifications/components/NotificationListItem.vue'
import { useNotifications } from '@modules/notifications/composables/useNotifications'

const searchQuery = ref('')
const { t } = useI18n()
const {
  notifications,
  total,
  isLoading,
  isLoadingMore,
  hasMore,
  error,
  sentinelRef,
  loadInitial,
} = useNotifications({ perPage: 8 })
let searchTimer: ReturnType<typeof globalThis.setTimeout> | undefined

function setSentinel(element: Element | ComponentPublicInstance | null): void {
  sentinelRef.value = element instanceof HTMLElement ? element : null
}

watch(searchQuery, (value) => {
  if (searchTimer) {
    globalThis.clearTimeout(searchTimer)
  }

  searchTimer = globalThis.setTimeout(() => {
    void loadInitial(value)
  }, 250)
})

onMounted(() => {
  void loadInitial()
})
</script>

<template>
  <section class="page-stack notifications-page">
    <header class="page-heading">
      <div>
        <p class="eyebrow">{{ t('notifications.eyebrow') }}</p>
        <h1>{{ t('notifications.title') }}</h1>
        <p>{{ t('notifications.subtitle') }}</p>
      </div>
    </header>

    <div class="notifications-page__toolbar">
      <BaseInput
        v-model="searchQuery"
        type="search"
        :aria-label="t('notifications.search')"
        :placeholder="t('notifications.search')"
      >
        <template #icon>
          <MagnifyingGlassIcon aria-hidden="true" />
        </template>
      </BaseInput>

      <span class="notifications-page__count">{{ t('common.total', { count: total }) }}</span>
    </div>

    <div v-if="isLoading" class="notifications-page__loader">
      <BaseLoader variant="panel" :label="t('notifications.loading')" />
    </div>

    <BaseEmptyState
      v-else-if="notifications.length === 0"
      :title="t('notifications.emptyTitle')"
      :description="t('notifications.emptyDescription')"
    />

    <div v-else class="notifications-page__list">
      <NotificationListItem
        v-for="notification in notifications"
        :key="notification.id"
        :notification="notification"
      />

      <p v-if="error" class="notifications-page__error">{{ error }}</p>

      <div :ref="setSentinel" class="notifications-page__sentinel">
        <BaseLoader v-if="isLoadingMore" size="sm" :label="t('notifications.loadingMore')" />
        <span v-else-if="!hasMore">{{ t('notifications.end') }}</span>
      </div>
    </div>
  </section>
</template>

<style scoped>
.notifications-page__toolbar {
  display: grid;
  grid-template-columns: minmax(0, 28rem) auto;
  align-items: end;
  justify-content: space-between;
  gap: var(--space-4);
}

.notifications-page__count {
  display: inline-flex;
  min-height: var(--control-height);
  align-items: center;
  padding: 0 var(--space-3);
  border: 1px solid color-mix(in srgb, var(--color-border) 74%, transparent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-surface) 84%, transparent);
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 900;
}

.notifications-page__list {
  display: grid;
  gap: var(--space-3);
}

.notifications-page__loader,
.notifications-page__sentinel {
  display: grid;
  min-height: 4rem;
  place-items: center;
  color: var(--color-text-muted);
  font-size: 0.82rem;
  font-weight: 850;
}

.notifications-page__error {
  margin: 0;
  color: var(--color-danger);
  font-size: 0.85rem;
  font-weight: 800;
  text-align: center;
}

@media (max-width: 680px) {
  .notifications-page__toolbar {
    grid-template-columns: 1fr;
  }

  .notifications-page__count {
    width: max-content;
  }
}
</style>
