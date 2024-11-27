<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled, 'mobile-open': isMobileMenuOpen }">
    <div class="nav-container glass">
      <div class="nav-brand">
        <router-link to="/" class="logo">
          <i class="fas fa-plane-departure"></i>
          <span>SKYCARS</span>
        </router-link>
      </div>

      <button class="mobile-toggle" @click="toggleMobileMenu">
        <div class="hamburger" :class="{ 'active': isMobileMenuOpen }">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      <div class="nav-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="nav-links">
          <router-link to="/radar" class="nav-link">
            <i class="fas fa-radar"></i>
            <span>Radar</span>
          </router-link>
          <router-link to="/planning" class="nav-link">
            <i class="fas fa-map-marked-alt"></i>
            <span>Planning</span>
          </router-link>
          <router-link to="/weather" class="nav-link">
            <i class="fas fa-cloud-sun"></i>
            <span>Weather</span>
          </router-link>
          <router-link to="/forum" class="nav-link">
            <i class="fas fa-comments"></i>
            <span>Forum</span>
          </router-link>
          <router-link to="/about" class="nav-link">
            <i class="fas fa-info-circle"></i>
            <span>About</span>
          </router-link>
        </div>

        <div class="nav-auth">
          <button @click="$emit('showLogin')" class="btn-login">
            <i class="fas fa-sign-in-alt"></i>
            <span>Login</span>
          </button>
          <button @click="$emit('showRegister')" class="btn-register">
            <i class="fas fa-user-plus"></i>
            <span>Register</span>
          </button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  document.body.style.overflow = isMobileMenuOpen.value ? 'hidden' : ''
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: var(--background-primary);
  border-bottom: 1px solid var(--border-color);
  padding: 0.5rem 2rem;
  height: 70px;
  display: flex;
  align-items: center;
}

.nav-container {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  display: flex;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--primary-color);
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-links {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  color: var(--text-color);
  font-weight: 500;
  transition: all 0.3s ease;
  border-radius: 0.5rem;
}

.nav-link:hover {
  color: var(--primary-color);
  background: var(--background-hover);
}

.nav-auth {
  display: flex;
  gap: 1rem;
}

.btn-login,
.btn-register {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-login {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.btn-register {
  background: var(--primary-color);
  border: none;
  color: white;
}

.mobile-toggle {
  display: none;
}

@media (max-width: 1024px) {
  .mobile-toggle {
    display: block;
    background: none;
    border: none;
    padding: 0.5rem;
  }

  .nav-menu {
    position: fixed;
    top: 70px; /* Navbar height */
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-primary);
    flex-direction: column;
    padding: 2rem;
    transform: translateX(100%);
    transition: transform 0.3s ease;
  }

  .nav-menu.active {
    transform: translateX(0);
  }

  .nav-links {
    flex-direction: column;
    align-items: center;
    width: 100%;
  }

  .nav-link {
    width: 100%;
    justify-content: center;
  }

  .nav-auth {
    flex-direction: column;
    width: 100%;
  }

  .btn-login,
  .btn-register {
    width: 100%;
    justify-content: center;
  }
}
</style> 