<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseAvatar from '@shared/components/ui/BaseAvatar.vue'
import BaseBadge from '@shared/components/ui/BaseBadge.vue'
import BaseButton from '@shared/components/ui/BaseButton.vue'
import BaseTable from '@shared/components/ui/BaseTable.vue'
import { useUsers } from '@modules/users/composables/useUsers'
import type { TableColumn } from '@shared/types/table'

const { users, isLoading, fetchUsers } = useUsers()
const { locale, t } = useI18n()

const columns = computed<TableColumn[]>(() => [
  { key: 'name', label: t('users.columns.user'), sortable: true },
  { key: 'role', label: t('users.columns.role'), sortable: true },
  { key: 'status', label: t('users.columns.status'), sortable: true },
  { key: 'lastSeenAt', label: t('users.columns.lastSeen'), sortable: true },
])

const filters = computed(() => [
  {
    key: 'status',
    label: t('users.columns.status'),
    type: 'select' as const,
    options: [
      { label: t('users.statuses.Active'), value: 'Active' },
      { label: t('users.statuses.Invited'), value: 'Invited' },
      { label: t('users.statuses.Suspended'), value: 'Suspended' },
    ],
  },
  {
    key: 'role',
    label: t('users.columns.role'),
    type: 'select' as const,
    options: [
      { label: t('users.roles.Admin'), value: 'Admin' },
      { label: t('users.roles.Manager'), value: 'Manager' },
      { label: t('users.roles.Analyst'), value: 'Analyst' },
    ],
  },
])

function statusVariant(status: unknown): 'success' | 'warning' | 'danger' | 'info' {
  if (status === 'Active') return 'success'
  if (status === 'Invited') return 'warning'
  if (status === 'Suspended') return 'danger'
  return 'info'
}

function translateStatus(status: unknown): string {
  return typeof status === 'string' ? t(`users.statuses.${status}`) : ''
}

function translateRole(role: unknown): string {
  return typeof role === 'string' ? t(`users.roles.${role}`) : ''
}

onMounted(fetchUsers)
</script>

<template>
  <section class="page-stack">
    <header class="page-heading">
      <div>
        <p class="eyebrow">{{ t('users.eyebrow') }}</p>
        <h1>{{ t('users.title') }}</h1>
        <p>{{ t('users.subtitle') }}</p>
      </div>
      <BaseButton>{{ t('users.addUser') }}</BaseButton>
    </header>

    <BaseTable
      :rows="users"
      :columns="columns"
      :loading="isLoading"
      :search-placeholder="t('users.search')"
      :filters="filters"
    >
      <template #cell-name="{ row }">
        <span class="user-cell">
          <BaseAvatar :name="String(row.name)" />
          <span>
            <strong>{{ row.name }}</strong>
            <small>{{ row.email }}</small>
          </span>
        </span>
      </template>

      <template #cell-role="{ value }">
        {{ translateRole(value) }}
      </template>

      <template #cell-status="{ value }">
        <BaseBadge :variant="statusVariant(value)">{{ translateStatus(value) }}</BaseBadge>
      </template>

      <template #cell-lastSeenAt="{ value }">
        {{ new Date(String(value)).toLocaleDateString(locale) }}
      </template>
    </BaseTable>
  </section>
</template>

<style scoped>
.user-cell {
  display: inline-flex;
  align-items: center;
  gap: var(--space-3);
}

.user-cell small {
  display: block;
  color: var(--color-text-muted);
}
</style>
