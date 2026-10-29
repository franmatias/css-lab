import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './app/App.vue'
import { i18n } from './app/i18n'
import { router } from './app/router'
import './style.css'
import './learning.css'
import '@fontsource-variable/inter/wght.css'
import '@fontsource-variable/space-grotesk/wght.css'
import '@fontsource-variable/jetbrains-mono/wght.css'
import '@fontsource/atkinson-hyperlegible/latin-400.css'

createApp(App).use(createPinia()).use(i18n).use(router).mount('#app')
