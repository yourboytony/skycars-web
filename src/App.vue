<template>
  <LoadingScreen v-if="isLoading" />
  <div class="app" :class="{ 'loaded': !isLoading }">
    <nav class="navbar">
      <div class="nav-content">
        <router-link to="/" class="logo">Skycars</router-link>
        
        <div class="nav-links">
          <router-link to="/radar">Radar</router-link>
          <router-link to="/planning">Planning</router-link>
          <router-link to="/weather">Weather</router-link>
          <router-link to="/forum">Forum</router-link>
          <router-link to="/about">About</router-link>
        </div>

        <div class="auth-buttons" v-if="!authStore.isAuthenticated">
          <button @click="showLoginModal = true" class="btn-login">Login</button>
          <button @click="showRegisterModal = true" class="btn-register">Register</button>
        </div>
        <div class="user-menu" v-else>
          <span class="username">{{ authStore.currentUser?.username }}</span>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </div>
      </div>
    </nav>

    <router-view></router-view>

    <!-- Auth Modals -->
    <LoginModal 
      v-if="showLoginModal" 
      @close="showLoginModal = false"
      @switch="switchModal('register')"
    />
    
    <RegisterModal
      v-if="showRegisterModal"
      @close="showRegisterModal = false"
      @switch="switchModal('login')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import LoginModal from './components/LoginModal.vue'
import RegisterModal from './components/RegisterModal.vue'
import LoadingScreen from './components/LoadingScreen.vue'

const authStore = useAuthStore()
const showLoginModal = ref(false)
const showRegisterModal = ref(false)
const isLoading = ref(true)

onMounted(() => {
  // Simulate initial loading
  setTimeout(() => {
    isLoading.value = false
  }, 2500)
})

const switchModal = (type) => {
  showLoginModal.value = type === 'login'
  showRegisterModal.value = type === 'register'
}

const handleLogout = () => {
  authStore.logout()
}
</script>

<style>
:root {
  --primary-color: #3b82f6;
  --primary-dark: #1e3a8a;
  --secondary-color: #10b981;
  --accent-color: #f59e0b;
  --text-color: #1f2937;
  --background-light: #f8fafc;
  --background-dark: #1f2937;
}

.app {
  opacity: 0;
  transition: opacity 0.5s ease-out;
}

.app.loaded {
  opacity: 1;
}

/* Add glass morphism effects */
.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

/* Add smooth scrolling */
html {
  scroll-behavior: smooth;
}

/* Add modern scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--background-light);
}

::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 4px;
}

/* Add text selection color */
::selection {
  background: var(--primary-color);
  color: white;
}

.navbar {
  background: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  text-decoration: none;
  color: var(--text-color);
  font-weight: 500;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  color: var(--primary-color);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.btn-login,
.btn-register,
.btn-logout {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
}

.btn-login {
  background: none;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-register {
  background: var(--primary-color);
  border: none;
  color: white;
}

.btn-logout {
  background: #ef4444;
  border: none;
  color: white;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.username {
  font-weight: 500;
}
</style> 