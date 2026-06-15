<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { useI18n } from 'vue-i18n'
import type { TabItem } from '@shared/types/navigation'

const model = defineModel<string>({ required: true })

const props = defineProps<{
  tabs: TabItem[]
  ariaLabel?: string
}>()

const slots = useSlots()
const { t } = useI18n()

const activeIndex = computed(() => {
  const index = props.tabs.findIndex((tab) => tab.value === model.value)
  return Math.max(0, index)
})
const tabCount = computed(() => Math.max(1, props.tabs.length))
const tabsStyle = computed(() => ({
  '--tabs-count': tabCount.value,
  '--tabs-index': activeIndex.value,
}))
const hasNamedPanels = computed(() =>
  props.tabs.some((tab) => Boolean(slots[`panel-${tab.value}`])),
)
const hasPanel = computed(() => hasNamedPanels.value || Boolean(slots.default))
const activeTabId = computed(() => `tab-${model.value}`)
const activePanelId = computed(() => `tabpanel-${model.value}`)

function selectTab(value: string): void {
  model.value = value
}
</script>

<template>
  <div class="tabs-shell">
    <div
      class="tabs"
      :style="tabsStyle"
      role="tablist"
      :aria-label="ariaLabel ?? t('navigation.tabs')"
    >
      <span class="tabs__thumb" aria-hidden="true" />
      <button
        v-for="tab in tabs"
        :id="`tab-${tab.value}`"
        :key="tab.value"
        type="button"
        class="tabs__button"
        :class="{ 'tabs__button--active': model === tab.value }"
        role="tab"
        :aria-selected="model === tab.value"
        :aria-controls="hasPanel ? `tabpanel-${tab.value}` : undefined"
        @click="selectTab(tab.value)"
      >
        <slot name="tab" :tab="tab" :active="model === tab.value">
          {{ tab.label }}
        </slot>
      </button>
    </div>

    <div v-if="hasNamedPanels" class="tabs__panels">
      <section
        v-for="(tab, index) in tabs"
        v-show="model === tab.value"
        :id="`tabpanel-${tab.value}`"
        :key="tab.value"
        class="tabs__panel"
        role="tabpanel"
        :aria-labelledby="`tab-${tab.value}`"
      >
        <slot
          :name="`panel-${tab.value}`"
          :tab="tab"
          :active="model === tab.value"
          :active-tab="model"
          :active-index="activeIndex"
          :index="index"
        />
      </section>
    </div>

    <section
      v-else-if="hasPanel"
      :id="activePanelId"
      class="tabs__panel"
      role="tabpanel"
      :aria-labelledby="activeTabId"
    >
      <slot :active-tab="model" :active-index="activeIndex" />
    </section>
  </div>
</template>

<style scoped>
.tabs-shell {
  display: grid;
  gap: var(--space-4);
}

.tabs {
  --tabs-count: 1;
  --tabs-index: 0;

  position: relative;
  display: grid;
  grid-template-columns: repeat(var(--tabs-count), minmax(0, 1fr));
  gap: var(--space-1);
  width: max-content;
  max-width: 100%;
  padding: var(--space-1);
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 46%), transparent),
    color-mix(in srgb, var(--color-surface-muted) 64%, transparent);
  box-shadow:
    0 1px 0 rgb(255 255 255 / 70%) inset,
    0 12px 28px rgb(15 23 42 / 7%);
  overflow: hidden;
}

.tabs__thumb {
  position: absolute;
  z-index: 0;
  inset-block: var(--space-1);
  inset-inline-start: var(--space-1);
  width: calc((100% - (var(--space-1) * 2)) / var(--tabs-count));
  border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--color-border));
  border-radius: 999px;
  background:
    linear-gradient(180deg, rgb(255 255 255 / 86%), rgb(255 255 255 / 42%)),
    color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
  box-shadow:
    0 1px 0 rgb(255 255 255 / 86%) inset,
    0 12px 24px color-mix(in srgb, var(--color-primary) 12%, rgb(15 23 42 / 8%));
  transform: translateX(calc(var(--tabs-index) * 100%));
  transition: transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1);
}

[dir='rtl'] .tabs__thumb {
  transform: translateX(calc(var(--tabs-index) * -100%));
}

.tabs__button {
  position: relative;
  z-index: 1;
  display: inline-flex;
  min-width: 0;
  min-height: 2.45rem;
  align-items: center;
  justify-content: center;
  padding: 0 var(--space-4);
  border: 0;
  border-radius: 999px;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
  font-weight: 900;
  white-space: nowrap;
  transition:
    color 160ms ease,
    transform 160ms ease;
}

.tabs__button:hover {
  transform: translateY(-1px);
}

.tabs__button--active {
  color: var(--color-text);
}

.tabs__panels,
.tabs__panel {
  min-width: 0;
}

@media (max-width: 560px) {
  .tabs {
    width: 100%;
  }

  .tabs__button {
    padding: 0 var(--space-2);
  }
}

@media (prefers-reduced-motion: reduce) {
  .tabs__thumb,
  .tabs__button {
    transition: none;
  }
}
</style>
