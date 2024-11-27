<template>
  <nav class="navbar glass">
    <router-link to="/" class="logo">
      <img src="../assets/logo.png" alt="Skycars" />
    </router-link>

    <div class="nav-links" :class="{ 'active': isMenuOpen }">
      <template v-if="!auth.isAuthenticated()">
        <router-link to="/features">Features</router-link>
        <router-link to="/pricing">Pricing</router-link>
        <router-link to="/support">Support</router-link>
        <router-link to="/contact">Contact</router-link>
      </template>
      <template v-else>
        <router-link to="/dashboard">Dashboard</router-link>
        <router-link to="/listings">My Listings</router-link>
        <router-link to="/messages">Messages</router-link>
      </template>
    </div>

    <div class="auth-buttons" :class="{ 'active': isMenuOpen }">
      <template v-if="!auth.isAuthenticated()">
        <router-link to="/login" class="login-btn">Log In</router-link>
        <router-link to="/register" class="register-btn">Get Started</router-link>
      </template>
      <template v-else>
        <div class="user-menu" ref="userMenuRef">
          <button class="user-btn" @click="toggleUserMenu">
            <span>{{ auth.user?.name }}</span>
            <i class="fas fa-chevron-down"></i>
          </button>
          <div class="user-dropdown" v-if="isUserMenuOpen">
            <router-link to="/profile" class="dropdown-item">
              <i class="fas fa-user"></i> Profile
            </router-link>
            <router-link to="/settings" class="dropdown-item">
              <i class="fas fa-cog"></i> Settings
            </router-link>
            <div class="dropdown-divider"></div>
            <button @click="handleLogout" class="dropdown-item logout">
              <i class="fas fa-sign-out-alt"></i> Log Out
            </button>
          </div>
        </div>
      </template>
    </div>

    <button class="menu-btn" @click="toggleMenu">
      <i class="fas fa-bars"></i>
    </button>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const isMenuOpen = ref(false)
const isUserMenuOpen = ref(false)
const userMenuRef = ref(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

const handleLogout = async () => {
  await auth.logout()
  isUserMenuOpen.value = false
  router.push('/')
}

// Close user menu when clicking outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    isUserMenuOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
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

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  color: var(--text-color);
  cursor: pointer;
  font-size: 1rem;
}

.user-btn i {
  font-size: 0.875rem;
  transition: transform 0.2s;
}

.user-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  margin-top: 0.5rem;
  background: var(--background-secondary);
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  text-decoration: none;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: var(--background-hover);
}

.dropdown-item i {
  width: 1rem;
  text-align: center;
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0;
}

.logout {
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 1rem;
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

  .user-dropdown {
    position: static;
    width: 100%;
    margin-top: 0;
    box-shadow: none;
  }
}
</style> 