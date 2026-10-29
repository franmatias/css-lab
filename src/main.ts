import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import { i18n } from './app/i18n'
import { router } from './app/router'
import './style.css'

createApp(App).use(createPinia()).use(i18n).use(router).mount('#app')
