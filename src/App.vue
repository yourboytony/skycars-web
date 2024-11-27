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
}

.app {
  min-height: 100vh;
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.app.loaded {
  opacity: 1;
}

main {
  padding-top: 80px; /* Adjust based on navbar height */
}

/* Glass effect */
.glass {
  background: rgba(var(--background-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
  box-shadow: 0 8px 32px var(--shadow-color);
}

.dark .glass {
  background: rgba(var(--background-primary-rgb), 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* Smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Modern scrollbar */
::-webkit-scrollbar {
  width: 10px;
}

::-webkit-scrollbar-track {
  background: var(--background-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 5px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--primary-dark);
}

/* Button reset */
button {
  font-family: inherit;
  cursor: pointer;
}

/* Link reset */
a {
  text-decoration: none;
  color: inherit;
}
</style> 