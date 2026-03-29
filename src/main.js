import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import App from './App.vue'
import router from './router'
import en from './i18n/en.js'
import zh from './i18n/zh.js'
import './assets/main.css'

const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('lang') || 'en',
  messages: { en, zh }
})

const app = createApp(App)
app.use(createPinia())
app.use(router)
app.use(i18n)
app.mount('#app')