import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import axiosPlugin from './plugins/axios'
import '@mdi/font/css/materialdesignicons.css';

import App from './App.vue'
import router from './router'

const app = createApp(App)

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi: mdi,
    }
  },
})

app.use(createPinia())
app.use(router)
app.use(vuetify)
app.use(axiosPlugin)

app.mount('#app')
