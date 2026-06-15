import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import type { AvailableLocale } from '@app/plugins/i18n'
import { useLocaleStore } from '@stores/locale.store'

export function useLocale() {
  const localeStore = useLocaleStore()
  const { currentLocale, availableLocales } = storeToRefs(localeStore)
  const { t } = useI18n()

  const locales = computed(() =>
    availableLocales.value.map((locale) => ({
      value: locale,
      label: t(`locale.${locale}`),
    })),
  )

  async function switchLocale(locale: AvailableLocale): Promise<void> {
    await localeStore.switchLocale(locale)
  }

  return {
    currentLocale,
    availableLocales,
    locales,
    switchLocale,
  }
}
