import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import store from './store';
import { createPinia } from 'pinia'

const pinia = createPinia()

loadFonts()

createApp(App)
  .use(store)
  .use(vuetify)
  .use(router)
  .use(pinia)
  .mount('#app')
