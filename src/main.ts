import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import axiosPlugin from './plugins/axios'
import '@mdi/font/css/materialdesignicons.css'
import ru from '@/locales/ru.ts'
import kz from '@/locales/kz'

import App from './App.vue'
import router from './router'
import { createI18n } from 'vue-i18n'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: { mdi },
  },
})

const i18n = createI18n({
  locale: 'ru',
  messages: { ru, kz },
})

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(axiosPlugin)
app.use(i18n)

app.mount('#app')
