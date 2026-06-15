<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BaseCard from '@shared/components/ui/BaseCard.vue'
import BaseSelect from '@shared/components/form/BaseSelect.vue'
import { useLocale } from '@shared/composables/useLocale'
import { useThemeStore, type ThemeMode } from '@stores/theme.store'
import type { AvailableLocale } from '@app/plugins/i18n'

const themeStore = useThemeStore()
const { t } = useI18n()
const { currentLocale, locales, switchLocale } = useLocale()

const themeModes = computed<{ label: string; value: ThemeMode }[]>(() => [
  { label: t('settings.theme.light'), value: 'light' },
  { label: t('settings.theme.dark'), value: 'dark' },
])

async function updateLocale(value: string | number): Promise<void> {
  await switchLocale(String(value) as AvailableLocale)
}
</script>

<template>
  <section class="page-stack settings-page">
    <header class="page-heading">
      <div>
        <p class="eyebrow">{{ t('settings.eyebrow') }}</p>
        <h1>{{ t('settings.title') }}</h1>
        <p>{{ t('settings.subtitle') }}</p>
      </div>
    </header>

    <div class="settings-layout">
      <BaseCard
        :title="t('settings.localization.title')"
        :description="t('settings.localization.description')"
        class="settings-card"
      >
        <BaseSelect
          :model-value="currentLocale"
          :label="t('settings.localization.language')"
          :options="locales"
          @update:model-value="updateLocale"
        />
      </BaseCard>

      <BaseCard
        :title="t('settings.theme.title')"
        :description="t('settings.theme.description')"
        class="settings-card"
      >
        <div class="option-grid">
          <button
            v-for="mode in themeModes"
            :key="mode.value"
            type="button"
            class="setting-option"
            :class="{ 'setting-option--active': themeStore.mode === mode.value }"
            @click="themeStore.setTheme(mode.value)"
          >
            <span>{{ mode.label }}</span>
            <small>
              {{
                mode.value === 'light'
                  ? t('settings.theme.lightDescription')
                  : t('settings.theme.darkDescription')
              }}
            </small>
          </button>
        </div>
      </BaseCard>
    </div>
  </section>
</template>

<style scoped>
.settings-layout {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: var(--space-4);
}

.settings-card {
  min-width: 0;
}

.option-grid {
  display: grid;
  gap: var(--space-3);
}

.setting-option span {
  color: var(--color-text);
  font-weight: 900;
}

.setting-option small {
  color: var(--color-text-muted);
  font-size: 0.8rem;
}

.setting-option {
  display: grid;
  gap: 0.25rem;
  padding: var(--space-4);
  border: 1px solid color-mix(in srgb, var(--color-border) 72%, transparent);
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-surface-muted) 62%, transparent);
  color: inherit;
  cursor: pointer;
  text-align: start;
}

.setting-option--active {
  border-color: color-mix(in srgb, var(--color-primary) 42%, var(--color-border));
  background: color-mix(in srgb, var(--color-primary) 8%, var(--color-surface));
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 10%, transparent);
}

@media (max-width: 980px) {
  .settings-layout {
    grid-template-columns: 1fr;
  }
}
</style>
