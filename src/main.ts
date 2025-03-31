import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import i18n from '@/plugins/locale'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import router from './router'
import filePlugin from '@/plugins/file.ts'
import httpPlugin from '@/plugins/http.ts'
import { useIrohaStore } from '@/stores/iroha.ts'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(httpPlugin)
app.use(filePlugin)

app.mount('#app')

let keySequence: string[] = [];
let timeout: NodeJS.Timeout = setTimeout((): void => {})

document.getElementById('app')?.addEventListener('keydown', (event: KeyboardEvent): void => {
  clearTimeout(timeout)

  keySequence.push(event.key)

  const recentKeys = keySequence.slice(-5);
  if (recentKeys.join('') === 'iroha') {
    const essayStore = useIrohaStore()
    essayStore.irohasMode = true
  }

  timeout = setTimeout(() => {
    keySequence = []
  }, 1000)
})
