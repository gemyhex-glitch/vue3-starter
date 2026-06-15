<script setup lang="ts">
import { computed, ref, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import { MagnifyingGlassIcon } from '@heroicons/vue/24/outline'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import PrimeButton from 'primevue/button'
import BaseInput from '@shared/components/form/BaseInput.vue'
import BaseSelect from '@shared/components/form/BaseSelect.vue'
import BaseEmptyState from '@shared/components/feedback/BaseEmptyState.vue'
import BaseLoader from '@shared/components/feedback/BaseLoader.vue'
import type { TableColumn, TableFilter, TableRow } from '@shared/types/table'

interface SortState {
  key: string
  direction: 'asc' | 'desc'
}

const props = withDefaults(
  defineProps<{
    rows: TableRow[]
    columns: TableColumn[]
    filters?: TableFilter[]
    loading?: boolean
    searchable?: boolean
    searchPlaceholder?: string
    emptyTitle?: string
    emptyDescription?: string
  }>(),
  {
    filters: () => [],
    loading: false,
    searchable: true,
    searchPlaceholder: '',
    emptyTitle: '',
    emptyDescription: '',
  },
)

const slots = useSlots()
const { t } = useI18n()
const sort = ref<SortState | null>(null)
const searchValue = ref('')
const filterValues = ref<Record<string, string | number>>({})

const hasToolbar = computed(
  () => props.searchable || props.filters.length > 0 || Boolean(slots.toolbar),
)
const resolvedSearchPlaceholder = computed(
  () => props.searchPlaceholder || t('table.searchPlaceholder'),
)
const resolvedEmptyTitle = computed(() => props.emptyTitle || t('table.emptyTitle'))
const resolvedEmptyDescription = computed(
  () => props.emptyDescription || t('table.emptyDescription'),
)

const displayedRows = computed(() => {
  let rows = [...props.rows]
  const search = searchValue.value.trim().toLowerCase()

  if (search) {
    rows = rows.filter((row) =>
      props.columns.some((column) =>
        formatCellValue(row[column.key]).toLowerCase().includes(search),
      ),
    )
  }

  props.filters.forEach((filter) => {
    const value = filterValues.value[filter.key]

    if (value === undefined || value === '') return

    rows = rows.filter((row) => {
      const rowValue = formatCellValue(row[filter.key])

      if (filter.type === 'select') {
        return rowValue === String(value)
      }

      return rowValue.toLowerCase().includes(String(value).toLowerCase())
    })
  })

  if (sort.value) {
    const { key, direction } = sort.value

    rows.sort((leftRow, rightRow) => {
      const leftValue = formatCellValue(leftRow[key])
      const rightValue = formatCellValue(rightRow[key])
      const order = leftValue.localeCompare(rightValue)

      return direction === 'asc' ? order : -order
    })
  }

  return rows
})

function toggleSort(column: TableColumn): void {
  if (!column.sortable) return

  const direction =
    sort.value?.key === column.key && sort.value.direction === 'asc' ? 'desc' : 'asc'

  sort.value = { key: column.key, direction }
}

function formatCellValue(value: unknown): string {
  if (value === null || value === undefined) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (value instanceof Date) return value.toISOString()

  return ''
}

function updateFilter(key: string, value: string | number): void {
  filterValues.value = {
    ...filterValues.value,
    [key]: value,
  }
}
</script>

<template>
  <section class="base-table">
    <header v-if="hasToolbar" class="table-toolbar">
      <div class="table-toolbar__controls">
        <BaseInput
          v-if="searchable"
          v-model="searchValue"
          class="table-search"
          type="search"
          :placeholder="resolvedSearchPlaceholder"
          :aria-label="t('table.search')"
        >
          <template #icon>
            <MagnifyingGlassIcon aria-hidden="true" />
          </template>
        </BaseInput>

        <template v-for="filter in filters" :key="filter.key">
          <BaseInput
            v-if="filter.type === 'text'"
            class="table-filter-field"
            type="search"
            :model-value="filterValues[filter.key] ?? ''"
            :placeholder="filter.label"
            :aria-label="filter.label"
            @update:model-value="updateFilter(filter.key, $event)"
          />
          <BaseSelect
            v-else
            class="table-filter-field table-filter-field--select"
            :model-value="filterValues[filter.key] ?? ''"
            :options="filter.options ?? []"
            :placeholder="t('table.filterAll', { label: filter.label })"
            :placeholder-disabled="false"
            :aria-label="filter.label"
            @update:model-value="updateFilter(filter.key, $event)"
          />
        </template>
      </div>

      <div v-if="$slots.toolbar" class="table-toolbar__actions">
        <slot name="toolbar" />
      </div>
    </header>

    <section class="table-shell">
      <BaseLoader
        v-if="loading"
        size="lg"
        variant="panel"
        :label="t('table.loading')"
        :description="t('table.loadingDescription')"
      />

      <BaseEmptyState
        v-else-if="displayedRows.length === 0"
        :title="resolvedEmptyTitle"
        :description="resolvedEmptyDescription"
      />

      <DataTable
        v-else
        :value="displayedRows"
        class="prime-data-table"
        table-class="data-table"
        data-key="id"
      >
        <Column v-for="column in columns" :key="column.key" :field="column.key">
          <template #header>
            <PrimeButton
              v-if="column.sortable"
              type="button"
              unstyled
              class="table-sort"
              @click="toggleSort(column)"
            >
              {{ column.label }}
              <span v-if="sort?.key === column.key" class="table-sort__direction">
                {{ sort.direction === 'asc' ? t('table.sortUp') : t('table.sortDown') }}
              </span>
            </PrimeButton>
            <span v-else>{{ column.label }}</span>
          </template>

          <template #body="{ data }">
            <slot
              v-if="$slots[`cell-${column.key}`]"
              :name="`cell-${column.key}`"
              :row="data"
              :value="data[column.key]"
            />
            <span v-else>{{ data[column.key] }}</span>
          </template>
        </Column>
      </DataTable>
    </section>
  </section>
</template>

<style scoped>
.base-table {
  display: grid;
  gap: var(--space-4);
}

.table-toolbar__controls,
.table-toolbar__actions {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.table-toolbar__controls {
  flex: 1 1 auto;
  min-width: 0;
}

.table-toolbar__actions {
  flex: 0 0 auto;
}

.table-search {
  flex: 1 1 70%;
  min-width: min(22rem, 100%);
}

.table-filter-field {
  flex: 0 1 13rem;
  min-width: 10rem;
}

.table-filter-field--select {
  flex-basis: 11rem;
}

.table-toolbar__controls :deep(.control),
.table-toolbar__controls :deep(.base-button),
.table-toolbar__actions :deep(.base-button) {
  min-height: var(--control-height);
}

.table-toolbar__controls :deep(.base-button--icon-only),
.table-toolbar__actions :deep(.base-button--icon-only) {
  width: var(--control-height);
}

.table-sort {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font: inherit;
  text-transform: inherit;
}

.table-sort__direction {
  color: var(--color-text-muted);
  font-size: 0.75rem;
  font-weight: 800;
}

.prime-data-table :deep(.p-datatable-table-container) {
  overflow-x: auto;
}

@media (max-width: 980px) {
  .table-toolbar__controls,
  .table-toolbar__actions {
    flex-wrap: wrap;
    width: 100%;
  }

  .table-search,
  .table-filter-field {
    width: 100%;
    min-width: 100%;
  }
}
</style>
