import { defineStore } from 'pinia'
import {
  availableLocales,
  i18n,
  isAvailableLocale,
  loadLocaleMessages,
  type AvailableLocale,
} from '@app/plugins/i18n'
import { router } from '@app/router'
import { updateDocumentTitle } from '@app/router/page-title'
import { storage } from '@shared/utils/storage'

const i18nLocale = i18n.global.locale as unknown as { value: AvailableLocale }

export const useLocaleStore = defineStore('locale', {
  state: () => ({
    currentLocale: i18nLocale.value,
    availableLocales,
  }),
  actions: {
    async switchLocale(locale: AvailableLocale): Promise<void> {
      if (!isAvailableLocale(locale)) {
        return
      }

      await loadLocaleMessages(locale)
      i18nLocale.value = locale
      this.currentLocale = locale
      storage.set('locale', locale)
      document.documentElement.lang = locale
      document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr'
      void updateDocumentTitle(router.currentRoute.value)
    },
    async initialize(): Promise<void> {
      await this.switchLocale(this.currentLocale)
    },
  },
})
