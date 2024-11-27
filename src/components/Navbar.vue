<template>
  <nav class="navbar" :class="{ 'scrolled': isScrolled }">
    <div class="nav-container">
      <div class="nav-brand">
        <router-link to="/" class="logo">
          <div class="logo-icon">
            <i class="fas fa-plane-departure"></i>
            <div class="logo-glow"></div>
          </div>
          <span class="logo-text">SKYCARS</span>
        </router-link>
      </div>

      <div class="nav-menu" :class="{ 'active': isMenuOpen }">
        <div class="nav-links">
          <router-link v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path" 
            class="nav-link hover-effect"
            @click="isMenuOpen = false"
          >
            <i :class="link.icon"></i>
            <span>{{ link.name }}</span>
            <div class="link-highlight"></div>
          </router-link>
        </div>

        <div class="nav-auth">
          <button @click="$emit('showLogin')" class="btn-login glow-effect">
            <span>Login</span>
            <div class="glow"></div>
          </button>
          <button @click="$emit('showRegister')" class="btn-register pulse-effect">
            <span>Get Started</span>
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <button class="mobile-toggle" @click="toggleMenu">
        <i :class="isMenuOpen ? 'fas fa-times' : 'fas fa-bars'"></i>
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMenuOpen = ref(false)

const navLinks = [
  { name: 'Home', path: '/', icon: 'fas fa-home' },
  { name: 'Features', path: '/features', icon: 'fas fa-star' },
  { name: 'Pricing', path: '/pricing', icon: 'fas fa-tag' },
  { name: 'Support', path: '/support', icon: 'fas fa-headset' }
]

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
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
  background: rgba(var(--background-primary-rgb), 0.8);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(var(--primary-rgb), 0.1);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.navbar.scrolled {
  background: rgba(var(--background-primary-rgb), 0.95);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
}

.logo {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  overflow: hidden;
}

.logo-icon i {
  color: white;
  font-size: 1.5rem;
  z-index: 1;
}

.logo-glow {
  position: absolute;
  width: 100%;
  height: 100%;
  background: var(--primary-color);
  filter: blur(20px);
  opacity: 0.5;
  animation: pulse 2s ease-in-out infinite;
}

.logo-text {
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  letter-spacing: 1px;
}

.nav-link {
  position: relative;
  overflow: hidden;
}

.link-highlight {
  position: absolute;
  bottom: 0;
  left: 50%;
  width: 0;
  height: 2px;
  background: linear-gradient(to right, var(--primary-color), var(--accent-color));
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover .link-highlight {
  width: 100%;
}

.btn-login {
  position: relative;
  overflow: hidden;
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.glow {
  position: absolute;
  width: 200%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(var(--primary-rgb), 0.2),
    transparent
  );
  transform: translateX(-100%);
}

.btn-login:hover .glow {
  animation: glow-effect 1.5s infinite;
}

.btn-register {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border: none;
  color: white;
  transform-origin: center;
}

.btn-register:hover {
  animation: pulse 1.5s infinite;
}

@keyframes glow-effect {
  100% {
    transform: translateX(100%);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0.4);
  }
  70% {
    transform: scale(1.05);
    box-shadow: 0 0 0 10px rgba(var(--primary-rgb), 0);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 rgba(var(--primary-rgb), 0);
  }
}

/* Add responsive styles here */
</style> 