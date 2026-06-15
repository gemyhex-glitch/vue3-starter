<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { LanguageIcon, MoonIcon, SunIcon } from '@heroicons/vue/24/outline'
import BaseButton from '@shared/components/ui/BaseButton.vue'
import { useLocale } from '@shared/composables/useLocale'
import { useThemeStore } from '@stores/theme.store'
import type { AvailableLocale } from '@app/plugins/i18n'

const themeStore = useThemeStore()
const { availableLocales, currentLocale, switchLocale } = useLocale()
const { t } = useI18n()

const nextLocale = computed<AvailableLocale>(() => {
  const locales = availableLocales.value
  const currentIndex = locales.indexOf(currentLocale.value)

  return locales[(currentIndex + 1) % locales.length] ?? currentLocale.value
})

async function switchToNextLocale(): Promise<void> {
  await switchLocale(nextLocale.value)
}
</script>

<template>
  <main class="auth-layout">
    <div class="auth-layout__actions" :aria-label="t('layout.authPreferences')">
      <BaseButton
        variant="ghost"
        size="sm"
        icon-only
        :aria-label="themeStore.mode === 'dark' ? t('layout.useLightMode') : t('layout.useDarkMode')"
        @click="themeStore.toggleTheme()"
      >
        <SunIcon v-if="themeStore.mode === 'dark'" aria-hidden="true" />
        <MoonIcon v-else aria-hidden="true" />
      </BaseButton>

      <BaseButton
        variant="ghost"
        size="sm"
        icon-only
        :aria-label="t('layout.switchLanguage', { locale: t(`locale.${nextLocale}`) })"
        @click="switchToNextLocale"
      >
        <LanguageIcon aria-hidden="true" />
      </BaseButton>
    </div>

    <section class="auth-layout__content" :aria-label="t('layout.authentication')">
      <slot />
    </section>
  </main>
</template>
