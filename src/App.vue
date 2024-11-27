<template>
  <LoadingScreen v-if="isLoading" />
  <div class="app" :class="{ 'loaded': !isLoading }">
    <Navbar 
      @showLogin="showLoginModal = true"
      @showRegister="showRegisterModal = true"
    />
    
    <main>
      <router-view></router-view>
    </main>

    <ThemeToggle />

    <!-- Modals -->
    <LoginModal 
      v-if="showLoginModal" 
      @close="showLoginModal = false"
      @switch="switchToRegister"
    />
    <RegisterModal 
      v-if="showRegisterModal" 
      @close="showRegisterModal = false"
      @switch="switchToLogin"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useThemeStore } from './stores/theme'
import Navbar from './components/Navbar.vue'
import LoadingScreen from './components/LoadingScreen.vue'
import ThemeToggle from './components/ThemeToggle.vue'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'

const isLoading = ref(true)
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const themeStore = useThemeStore()

// Initialize theme before mounting
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
const savedTheme = localStorage.getItem('theme')
const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light')
document.documentElement.classList.toggle('dark', initialTheme === 'dark')

const switchToLogin = () => {
  showRegisterModal.value = false
  showLoginModal.value = true
}

const switchToRegister = () => {
  showLoginModal.value = false
  showRegisterModal.value = true
}

onMounted(() => {
  themeStore.initTheme()
  setTimeout(() => {
    isLoading.value = false
  }, 2500)
})
</script>

<style>
:root {
  /* Light theme */
  --primary-color: #3b82f6;
  --primary-rgb: 59, 130, 246;
  --primary-dark: #1e3a8a;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --text-light: #6b7280;
  --background-primary: #ffffff;
  --background-primary-rgb: 255, 255, 255;
  --background-secondary: #f8fafc;
  --background-hover: rgba(0, 0, 0, 0.05);
  --border-color: #e5e7eb;
  --shadow-color: rgba(0, 0, 0, 0.1);
}

:root.dark {
  /* Dark theme */
  --primary-color: #60a5fa;
  --primary-rgb: 96, 165, 250;
  --primary-dark: #3b82f6;
  --secondary-color: #34d399;
  --accent-color: #fbbf24;
  --text-color: #f3f4f6;
  --text-light: #9ca3af;
  --background-primary: #111827;
  --background-primary-rgb: 17, 24, 39;
  --background-secondary: #1f2937;
  --background-hover: rgba(255, 255, 255, 0.05);
  --border-color: #374151;
  --shadow-color: rgba(0, 0, 0, 0.3);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background-color: var(--background-primary);
  color: var(--text-color);
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  line-height: 1.5;
  transition: background-color 0.3s ease, color 0.3s ease;
  margin: 0;
  padding: 0;
  min-height: 100vh;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  padding-top: 70px; /* Match navbar height */
  width: 100%;
}

/* Update container widths */
.container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

/* Update section padding */
section {
  padding: 4rem 2rem;
}

/* Glass effect update */
.glass {
  background: rgba(var(--background-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  box-shadow: 0 8px 32px var(--shadow-color);
}

/* Add responsive container classes */
.container-sm { max-width: 640px; }
.container-md { max-width: 768px; }
.container-lg { max-width: 1024px; }
.container-xl { max-width: 1280px; }
.container-2xl { max-width: 1400px; }

/* Add spacing utilities */
.py-4 { padding-top: 1rem; padding-bottom: 1rem; }
.py-8 { padding-top: 2rem; padding-bottom: 2rem; }
.py-16 { padding-top: 4rem; padding-bottom: 4rem; }
.px-4 { padding-left: 1rem; padding-right: 1rem; }
.px-8 { padding-left: 2rem; padding-right: 2rem; }
.m-auto { margin: 0 auto; }

/* Add flex utilities */
.flex { display: flex; }
.flex-col { flex-direction: column; }
.items-center { align-items: center; }
.justify-center { justify-content: center; }
.justify-between { justify-content: space-between; }
.gap-4 { gap: 1rem; }
.gap-8 { gap: 2rem; }

/* Add grid utilities */
.grid { display: grid; }
.grid-cols-1 { grid-template-columns: repeat(1, 1fr); }
.grid-cols-2 { grid-template-columns: repeat(2, 1fr); }
.grid-cols-3 { grid-template-columns: repeat(3, 1fr); }
.grid-cols-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 1024px) {
  .container {
    padding: 0 1rem;
  }
  
  section {
    padding: 3rem 1rem;
  }
}

@media (max-width: 768px) {
  section {
    padding: 2rem 1rem;
  }
  
  .grid-cols-2,
  .grid-cols-3,
  .grid-cols-4 {
    grid-template-columns: 1fr;
  }
}
</style> 