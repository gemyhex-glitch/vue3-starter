import { createApp } from 'vue'
import App from '@app/App.vue'
import { installAppProviders } from '@app/providers'
import { router } from '@app/router'
import '@/assets/styles/main.css'

const app = createApp(App)

installAppProviders(app)

void router.isReady().then(() => {
  app.mount('#app')
})
