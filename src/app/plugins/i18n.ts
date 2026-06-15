import { createI18n } from 'vue-i18n'
import { env } from '@shared/config/env'
import { storage } from '@shared/utils/storage'

export const availableLocales = ['en', 'ar'] as const
export type AvailableLocale = (typeof availableLocales)[number]

export function isAvailableLocale(locale: string): locale is AvailableLocale {
  return availableLocales.includes(locale as AvailableLocale)
}

const savedLocale = storage.get('locale')
const initialLocale: AvailableLocale = isAvailableLocale(savedLocale ?? '')
  ? (savedLocale as AvailableLocale)
  : isAvailableLocale(env.defaultLocale)
    ? env.defaultLocale
    : 'en'

export const i18n = createI18n({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: 'en',
  messages: {},
  globalInjection: true,
})

const loadedLocales = new Set<AvailableLocale>()

export async function loadLocaleMessages(locale: AvailableLocale): Promise<void> {
  if (loadedLocales.has(locale)) {
    return
  }

  const messages = await import(`../../locales/${locale}/index.ts`)
  i18n.global.setLocaleMessage(locale, messages.default)
  loadedLocales.add(locale)
}
