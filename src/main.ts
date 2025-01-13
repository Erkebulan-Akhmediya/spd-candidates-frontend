import { createApp } from 'vue'
import { createPinia } from 'pinia'
import 'vuetify/styles'
import axiosPlugin from './plugins/axios'
import '@mdi/font/css/materialdesignicons.css'
import i18n from '@/plugins/locale'
import vuetify from '@/plugins/vuetify'
import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)
app.use(axiosPlugin)

app.mount('#app')
