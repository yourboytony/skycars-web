<template>
  <nav class="navbar glass">
    <div class="nav-container">
      <!-- Logo -->
      <router-link to="/" class="nav-logo">
        <i class="fas fa-plane"></i>
        FlightSim Market
      </router-link>

      <!-- Navigation Links -->
      <div class="nav-links">
        <router-link to="/listings" class="nav-link">
          <i class="fas fa-search"></i>
          Browse
        </router-link>
        
        <!-- Theme Toggle -->
        <button 
          class="theme-toggle"
          @click="toggleTheme"
          :title="isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'"
        >
          <i :class="isDark ? 'fas fa-sun' : 'fas fa-moon'"></i>
        </button>
        
        <!-- Auth Menu -->
        <template v-if="auth.isAuthenticated()">
          <!-- Credits Display -->
          <div class="credits-display">
            <i class="fas fa-coins"></i>
            {{ marketplace.credits }}
          </div>

          <!-- Messages with Badge -->
          <router-link to="/messages" class="nav-link messages-link">
            <i class="fas fa-envelope"></i>
            <span 
              v-if="marketplace.unreadCount" 
              class="message-badge"
            >
              {{ marketplace.unreadCount }}
            </span>
          </router-link>

          <!-- User Dropdown -->
          <div class="dropdown" ref="dropdown">
            <button 
              class="dropdown-trigger"
              @click="isDropdownOpen = !isDropdownOpen"
            >
              <div class="user-avatar">
                {{ getInitials(auth.user.name) }}
              </div>
              <i 
                class="fas fa-chevron-down"
                :class="{ 'rotated': isDropdownOpen }"
              ></i>
            </button>

            <div 
              v-show="isDropdownOpen"
              class="dropdown-menu glass"
            >
              <div class="dropdown-header">
                <div class="user-info">
                  <span class="user-name">{{ auth.user.name }}</span>
                  <span class="user-email">{{ auth.user.email }}</span>
                </div>
              </div>

              <div class="dropdown-content">
                <router-link to="/profile" class="dropdown-item">
                  <i class="fas fa-user"></i>
                  Profile
                </router-link>
                
                <router-link to="/listings/new" class="dropdown-item">
                  <i class="fas fa-plus"></i>
                  Create Listing
                </router-link>

                <router-link to="/profile/favorites" class="dropdown-item">
                  <i class="fas fa-heart"></i>
                  Favorites
                </router-link>

                <router-link to="/profile/transactions" class="dropdown-item">
                  <i class="fas fa-history"></i>
                  Transaction History
                </router-link>
              </div>

              <div class="dropdown-footer">
                <button class="logout-btn" @click="logout">
                  <i class="fas fa-sign-out-alt"></i>
                  Logout
                </button>
              </div>
            </div>
          </div>
        </template>

        <!-- Auth Buttons -->
        <template v-else>
          <router-link to="/login" class="nav-link login-btn">
            Login
          </router-link>
          <router-link to="/register" class="nav-link register-btn">
            Register
          </router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMarketplaceStore } from '../stores/marketplace'
import { useThemeStore } from '../stores/theme'

const router = useRouter()
const auth = useAuthStore()
const marketplace = useMarketplaceStore()
const theme = useThemeStore()

const isDropdownOpen = ref(false)
const dropdown = ref(null)

const isDark = computed(() => theme.isDark)

function toggleTheme() {
  theme.toggle()
}

// Close dropdown when clicking outside
function handleClickOutside(event) {
  if (dropdown.value && !dropdown.value.contains(event.target)) {
    isDropdownOpen.value = false
  }
}

// Helper function to get user initials
function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

async function logout() {
  await auth.logout()
  router.push('/login')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  if (auth.isAuthenticated()) {
    marketplace.fetchCredits()
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
}

.nav-logo:hover {
  color: var(--primary-color);
}

.nav-logo i {
  color: var(--primary-color);
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s;
  font-weight: 500;
}

.nav-link:hover {
  color: var(--primary-color);
}

.nav-link i {
  font-size: 1.1rem;
}

.theme-toggle {
  padding: 0.5rem;
  background: none;
  border: none;
  color: var(--text-color);
  cursor: pointer;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.theme-toggle:hover {
  color: var(--primary-color);
}

.theme-toggle i {
  font-size: 1.25rem;
}

.credits-display {
  padding: 0.5rem 1rem;
  background: rgba(var(--primary-rgb), 0.1);
  color: var(--primary-color);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.messages-link {
  position: relative;
}

.message-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--error-color);
  color: white;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  min-width: 1.5rem;
  text-align: center;
}

.login-btn,
.register-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.login-btn {
  background: rgba(var(--primary-rgb), 0.1);
}

.register-btn {
  background: var(--primary-color);
  color: white;
}

.register-btn:hover {
  color: white;
  opacity: 0.9;
}

/* Dropdown Styles */
.dropdown {
  position: relative;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--text-color);
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.fa-chevron-down {
  transition: transform 0.2s;
}

.fa-chevron-down.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  width: 250px;
  margin-top: 0.5rem;
  border-radius: 0.5rem;
  overflow: hidden;
  z-index: 1000;
}

.dropdown-header {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: var(--text-color);
  font-weight: 500;
}

.user-email {
  color: var(--text-light);
  font-size: 0.875rem;
}

.dropdown-content {
  padding: 0.5rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background-color 0.2s;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-footer {
  padding: 0.5rem;
  border-top: 1px solid var(--border-color);
}

.logout-btn {
  width: 100%;
  padding: 0.75rem;
  background: var(--error-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 1rem;
  transition: opacity 0.2s;
}

.logout-btn:hover {
  opacity: 0.9;
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
  }

  .nav-logo span {
    display: none;
  }

  .credits-display {
    display: none;
  }

  .nav-links {
    gap: 1rem;
  }

  .dropdown-menu {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
    width: auto;
    margin: 0;
    border-radius: 0;
  }
}
</style> 