import type { App } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import { configure } from 'vee-validate'
import { router } from '@app/router'
import { i18n } from '@app/plugins/i18n'
import { attachApiInterceptors } from '@shared/api/interceptors'
import { useLocaleStore } from '@stores/locale.store'
import { useThemeStore } from '@stores/theme.store'

export async function installAppProviders(app: App): Promise<void> {
  const pinia = createPinia()

  app.use(pinia)
  app.use(router)
  app.use(i18n)
  app.use(PrimeVue, {
    ripple: true,
    theme: {
      preset: Aura,
      options: {
        darkModeSelector: '.dark',
      },
    },
  })

  configure({
    validateOnBlur: false,
    validateOnChange: false,
    validateOnInput: false,
    validateOnModelUpdate: false,
  })

  attachApiInterceptors()

  useThemeStore().initialize()
  await useLocaleStore().initialize()
}
