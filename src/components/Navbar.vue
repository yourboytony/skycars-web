<template>
  <nav class="navbar glass">
    <router-link to="/" class="logo">
      <img src="@/assets/logo.png" alt="Skycars" />
    </router-link>

    <div class="nav-links" :class="{ 'active': isMenuOpen }">
      <router-link to="/features">Features</router-link>
      <router-link to="/pricing">Pricing</router-link>
      <router-link to="/support">Support</router-link>
      <router-link to="/contact">Contact</router-link>
    </div>

    <div class="auth-buttons" :class="{ 'active': isMenuOpen }">
      <router-link 
        v-if="!auth.isAuthenticated()" 
        to="/login" 
        class="login-btn"
      >
        Log In
      </router-link>
      <router-link 
        v-if="!auth.isAuthenticated()" 
        to="/register" 
        class="register-btn"
      >
        Get Started
      </router-link>
      <router-link 
        v-if="auth.isAuthenticated()" 
        to="/dashboard" 
        class="dashboard-btn"
      >
        Dashboard
      </router-link>
      <button 
        v-if="auth.isAuthenticated()" 
        @click="handleLogout" 
        class="logout-btn"
      >
        Log Out
      </button>
    </div>

    <button class="menu-btn" @click="toggleMenu">
      <i class="fas fa-bars"></i>
    </button>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  auth.logout()
  router.push('/')
}
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo img {
  height: 40px;
  width: auto;
}

.nav-links {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  color: var(--text-color);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-links a:hover {
  color: var(--primary-color);
}

.auth-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.login-btn,
.logout-btn {
  color: var(--text-color);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.register-btn,
.dashboard-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
  font-weight: 500;
}

.login-btn:hover,
.logout-btn:hover {
  background: var(--background-secondary);
}

.register-btn:hover,
.dashboard-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.menu-btn {
  display: none;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1.5rem;
  cursor: pointer;
}

@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .logo img {
    height: 32px;
  }

  .menu-btn {
    display: block;
  }

  .nav-links,
  .auth-buttons {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--background-secondary);
    padding: 1rem;
    flex-direction: column;
    align-items: stretch;
  }

  .nav-links.active,
  .auth-buttons.active {
    display: flex;
  }

  .nav-links a,
  .auth-buttons a,
  .auth-buttons button {
    padding: 0.75rem;
    text-align: center;
    width: 100%;
  }

  .login-btn,
  .register-btn,
  .dashboard-btn,
  .logout-btn {
    width: 100%;
    text-align: center;
    margin: 0.25rem 0;
  }
}
</style> 