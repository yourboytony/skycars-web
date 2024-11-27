import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Test API connection
fetch(`${import.meta.env.VITE_API_URL}/api/test`)
  .then(response => response.json())
  .then(data => console.log('API Test:', data))
  .catch(error => console.error('API Error:', error))

app.mount('#app') 