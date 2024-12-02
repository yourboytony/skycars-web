<template>
  <aside class="sidebar" :class="{ 'sidebar-collapsed': isCollapsed }">
    <div class="sidebar-header">
      <img src="@/assets/logo.svg" alt="Logo" class="logo" />
      <button @click="toggleSidebar" class="collapse-btn">
        <i class="fas fa-chevron-left"></i>
      </button>
    </div>

    <nav class="sidebar-nav">
      <router-link 
        v-for="item in navItems" 
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: currentRoute.path.includes(item.path) }"
      >
        <i :class="item.icon"></i>
        <span v-if="!isCollapsed">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <div class="user-info" v-if="!isCollapsed">
        <img :src="userAvatar" alt="User" class="user-avatar" />
        <div class="user-details">
          <span class="user-name">{{ userName }}</span>
          <span class="user-role">{{ userRole }}</span>
        </div>
      </div>
      <button @click="logout" class="logout-btn">
        <i class="fas fa-sign-out-alt"></i>
        <span v-if="!isCollapsed">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const isCollapsed = ref(false)
const currentRoute = computed(() => route)

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: 'fas fa-home' },
  { path: '/flights', label: 'Flight Planning', icon: 'fas fa-plane' },
  { path: '/weather', label: 'Weather', icon: 'fas fa-cloud' },
  { path: '/analytics', label: 'Analytics', icon: 'fas fa-chart-line' },
  { path: '/profile', label: 'Profile', icon: 'fas fa-user' },
  { path: '/settings', label: 'Settings', icon: 'fas fa-cog' }
]

const userName = computed(() => authStore.user?.name || 'User')
const userRole = computed(() => authStore.user?.role || 'Pilot')
const userAvatar = computed(() => authStore.user?.avatar || '/default-avatar.png')

function toggleSidebar() {
  isCollapsed.value = !isCollapsed.value
}

async function logout() {
  await authStore.logout()
  router.push('/login')
}
</script>

<style lang="scss" scoped>
.sidebar {
  width: 280px;
  background: var(--bg-primary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width var(--transition-normal);
  
  &.sidebar-collapsed {
    width: 80px;
    
    .nav-item span,
    .user-details {
      display: none;
    }
  }
}

.sidebar-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--border-color);
}

.logo {
  height: 2rem;
}

.collapse-btn {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
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

.sidebar-nav {
  flex: 1;
  padding: 1rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
    color: var(--primary);
  }
  
  &.active {
    background: var(--primary);
    color: white;
  }
  
  i {
    width: 1.5rem;
    text-align: center;
  }
}

.sidebar-footer {
  padding: 1rem;
  border-top: 1px solid var(--border-color);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.user-avatar {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  
  .user-name {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .user-role {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.logout-btn {
  width: 100%;
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: var(--bg-secondary);
  border: none;
  border-radius: var(--radius-md);
  color: var(--error);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--error);
    color: white;
  }
}
</style> 