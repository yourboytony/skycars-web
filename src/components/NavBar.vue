<template>
  <nav class="navbar">
    <div class="nav-left">
      <router-link to="/" class="nav-brand">
        <img src="@/assets/logo.svg" alt="SkyCars" class="nav-logo" />
        SkyCars
      </router-link>
    </div>

    <div class="nav-right">
      <!-- Authenticated User Menu -->
      <template v-if="auth.isAuthenticated">
        <div class="nav-links">
          <router-link to="/dashboard" class="nav-link">
            <i class="fas fa-tachometer-alt"></i>
            Dashboard
          </router-link>
          
          <div class="user-menu" @click="toggleUserMenu" ref="userMenuRef">
            <img 
              :src="auth.user?.avatar || '/default-avatar.png'" 
              alt="Profile" 
              class="user-avatar"
            />
            <span class="user-name">{{ auth.user?.name }}</span>
            
            <!-- Dropdown Menu -->
            <div v-if="showUserMenu" class="dropdown-menu">
              <router-link to="/profile" class="dropdown-item">
                <i class="fas fa-user"></i>
                Profile
              </router-link>
              
              <router-link to="/settings" class="dropdown-item">
                <i class="fas fa-cog"></i>
                Settings
              </router-link>
              
              <div class="dropdown-divider"></div>
              
              <button @click="handleLogout" class="dropdown-item logout-btn">
                <i class="fas fa-sign-out-alt"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </template>

      <!-- Guest Menu -->
      <template v-else>
        <div class="auth-buttons">
          <router-link to="/login" class="btn btn-login">
            Login
          </router-link>
          <router-link to="/register" class="btn btn-register">
            Register
          </router-link>
        </div>
      </template>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const auth = useAuthStore()
const showUserMenu = ref(false)
const userMenuRef = ref(null)

// Handle click outside
const handleClickOutside = (event) => {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
}

const handleLogout = async () => {
  try {
    await auth.logout()
    showUserMenu.value = false
    router.push('/login')
  } catch (error) {
    console.error('Logout failed:', error)
  }
}

// Add and remove click outside listener
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  router.afterEach(() => {
    showUserMenu.value = false
  })
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
  z-index: 1000;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  color: #FF2E63;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.nav-brand:hover {
  opacity: 0.8;
}

.nav-logo {
  height: 2rem;
  width: auto;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #FF2E63;
}

.nav-link i {
  font-size: 1.1rem;
}

.user-menu {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background-color 0.3s ease;
}

.user-menu:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  color: rgba(255, 255, 255, 0.9);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.5rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  min-width: 200px;
  padding: 0.5rem;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  border-radius: 6px;
}

.dropdown-item:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #FF2E63;
}

.dropdown-divider {
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.logout-btn {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  color: #ff4444;
}

.auth-buttons {
  display: flex;
  gap: 1rem;
}

.btn {
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-login {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.1);
}

.btn-login:hover {
  background: rgba(255, 255, 255, 0.2);
}

.btn-register {
  color: #fff;
  background: #FF2E63;
}

.btn-register:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(255, 46, 99, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .navbar {
    padding: 1rem;
  }

  .nav-links {
    gap: 1rem;
  }

  .user-name {
    display: none;
  }
}

@media (max-width: 480px) {
  .nav-link span {
    display: none;
  }
  
  .nav-links {
    gap: 0.5rem;
  }
}
</style>