import { createApp } from 'vue'
import App from '@app/App.vue'
import { installAppProviders } from '@app/providers'
import { router } from '@app/router'
import '@/assets/styles/main.css'

const app = createApp(App)

void installAppProviders(app).then(async () => {
  await router.isReady()
  app.mount('#app')
})
