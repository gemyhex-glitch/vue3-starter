import type { RouteLocationNormalized } from 'vue-router'
import { i18n, loadLocaleMessages, type AvailableLocale } from '@app/plugins/i18n'

const i18nLocale = i18n.global.locale as unknown as { value: AvailableLocale }
const appTitle = 'Starter Dashboard'

export async function updateDocumentTitle(route: RouteLocationNormalized): Promise<void> {
  const locale = i18nLocale.value
  await loadLocaleMessages(locale)

  const titleKey = route.meta.titleKey
  const pageTitle =
    typeof titleKey === 'string' ? i18n.global.t(titleKey) : (route.meta.title ?? appTitle)

  document.title = pageTitle === appTitle ? appTitle : `${pageTitle} | ${appTitle}`
}
