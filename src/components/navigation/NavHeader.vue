<template>
  <header class="nav-header">
    <div class="header-left">
      <button class="menu-btn" @click="$emit('toggle-sidebar')">
        <i class="fas fa-bars"></i>
      </button>
      <div class="breadcrumb">
        <span v-for="(crumb, index) in breadcrumbs" :key="index">
          <router-link 
            v-if="crumb.path" 
            :to="crumb.path"
            class="breadcrumb-link"
          >
            {{ crumb.name }}
          </router-link>
          <span v-else>{{ crumb.name }}</span>
          <i v-if="index < breadcrumbs.length - 1" class="fas fa-chevron-right"></i>
        </span>
      </div>
    </div>

    <div class="header-right">
      <div class="search-bar">
        <i class="fas fa-search"></i>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="Search..."
          @focus="showSearch = true"
          @blur="handleSearchBlur"
        />
        <div v-if="showSearch && searchResults.length" class="search-results">
          <div 
            v-for="result in searchResults" 
            :key="result.id"
            class="search-item"
            @mousedown="handleSearchSelect(result)"
          >
            <i :class="result.icon"></i>
            <div class="search-item-content">
              <span class="search-item-title">{{ result.title }}</span>
              <span class="search-item-subtitle">{{ result.subtitle }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="header-actions">
        <button class="action-btn" @click="toggleNotifications">
          <i class="fas fa-bell"></i>
          <span v-if="unreadNotifications" class="notification-badge">
            {{ unreadNotifications }}
          </span>
        </button>

        <div class="user-menu" v-click-outside="closeUserMenu">
          <button class="user-btn" @click="toggleUserMenu">
            <img :src="userAvatar" alt="User" />
            <span>{{ userName }}</span>
            <i class="fas fa-chevron-down"></i>
          </button>

          <div v-if="showUserMenu" class="user-dropdown">
            <router-link to="/profile" class="dropdown-item">
              <i class="fas fa-user"></i>
              Profile
            </router-link>
            <router-link to="/settings" class="dropdown-item">
              <i class="fas fa-cog"></i>
              Settings
            </router-link>
            <div class="dropdown-divider"></div>
            <button @click="handleLogout" class="dropdown-item text-error">
              <i class="fas fa-sign-out-alt"></i>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Search functionality
const searchQuery = ref('')
const showSearch = ref(false)
const searchResults = computed(() => {
  if (!searchQuery.value) return []
  // Implement your search logic here
  return []
})

// User menu
const showUserMenu = ref(false)
const userName = computed(() => authStore.user?.name || 'User')
const userAvatar = computed(() => authStore.user?.avatar || '/default-avatar.png')
const unreadNotifications = ref(3) // Replace with actual notifications count

// Breadcrumbs
const breadcrumbs = computed(() => {
  const paths = route.path.split('/').filter(Boolean)
  return paths.map((path, index) => ({
    name: path.charAt(0).toUpperCase() + path.slice(1),
    path: index < paths.length - 1 ? `/${paths.slice(0, index + 1).join('/')}` : null
  }))
})

function handleSearchBlur() {
  setTimeout(() => {
    showSearch.value = false
  }, 200)
}

function handleSearchSelect(result) {
  // Implement search result selection
  router.push(result.path)
  searchQuery.value = ''
  showSearch.value = false
}

function toggleNotifications() {
  // Implement notifications panel
  toast.info('Notifications coming soon')
}

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value
}

function closeUserMenu() {
  showUserMenu.value = false
}

async function handleLogout() {
  try {
    await authStore.logout()
    router.push('/login')
    toast.success('Logged out successfully')
  } catch (error) {
    toast.error('Logout failed')
  }
}
</script>

<style lang="scss" scoped>
.nav-header {
  height: 64px;
  padding: 0 1.5rem;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.menu-btn {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-light);
    color: white;
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  
  i {
    font-size: 0.75rem;
  }
  
  .breadcrumb-link {
    color: var(--primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.search-bar {
  position: relative;
  
  input {
    width: 300px;
    padding: 0.5rem 1rem 0.5rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    transition: all var(--transition-fast);
    
    &:focus {
      width: 400px;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-light);
    }
  }
  
  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  max-height: 400px;
  overflow-y: auto;
}

.search-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  i {
    position: static;
    transform: none;
    width: 1.5rem;
    text-align: center;
  }
}

.search-item-content {
  display: flex;
  flex-direction: column;
  
  .search-item-title {
    font-weight: 500;
  }
  
  .search-item-subtitle {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.action-btn {
  position: relative;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-light);
    color: white;
  }
}

.notification-badge {
  position: absolute;
  top: -0.25rem;
  right: -0.25rem;
  min-width: 1.25rem;
  height: 1.25rem;
  padding: 0 0.25rem;
  background: var(--error);
  color: white;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
}

.user-menu {
  position: relative;
}

.user-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: none;
  cursor: pointer;
  
  img {
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    object-fit: cover;
  }
  
  span {
    font-weight: 500;
  }
  
  i {
    color: var(--text-secondary);
    transition: transform var(--transition-fast);
  }
  
  &:hover i {
    transform: translateY(2px);
  }
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  width: 200px;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  animation: slideIn var(--transition-fast);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--text-primary);
  text-decoration: none;
  transition: all var(--transition-fast);
  
  i {
    width: 1.25rem;
    text-align: center;
  }
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  &.text-error {
    color: var(--error);
  }
}

.dropdown-divider {
  height: 1px;
  background: var(--border-color);
  margin: 0.5rem 0;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .search-bar input {
    width: 200px;
    
    &:focus {
      width: 250px;
    }
  }
  
  .user-btn span {
    display: none;
  }
}
</style> 