<template>
  <nav class="navbar glass">
    <router-link to="/" class="logo">
      <img src="../assets/logo.png" alt="Skycars Logo" />
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
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 0;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(var(--background-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
}

.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Brand/Logo */
.nav-brand {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-decoration: none;
  color: var(--text-color);
}

.logo-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  position: relative;
}

.logo-icon i {
  font-size: 1.25rem;
  color: white;
}

.icon-glow {
  position: absolute;
  inset: -5px;
  border-radius: inherit;
  background: inherit;
  filter: blur(15px);
  opacity: 0.5;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Navigation Menu */
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
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
}

.nav-link i {
  font-size: 1rem;
  opacity: 0.7;
}

.nav-link:hover,
.nav-link.active {
  color: var(--primary-color);
}

.link-highlight {
  position: absolute;
  bottom: -2px;
  left: 50%;
  width: 0;
  height: 2px;
  background: var(--primary-color);
  transition: all 0.3s ease;
  transform: translateX(-50%);
}

.nav-link:hover .link-highlight,
.nav-link.active .link-highlight {
  width: 100%;
}

/* Auth Buttons */
.nav-auth {
  display: flex;
  gap: 1rem;
}

.btn-login {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--text-color);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-login:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

.btn-register {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-register:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.2);
}

/* Mobile Menu */
.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
}

.menu-icon {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-icon span {
  display: block;
  width: 100%;
  height: 2px;
  background: var(--text-color);
  transition: all 0.3s ease;
}

.menu-icon.active span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.menu-icon.active span:nth-child(2) {
  opacity: 0;
}

.menu-icon.active span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .nav-links {
    gap: 1rem;
  }

  .nav-link {
    padding: 0.5rem;
  }

  .nav-link span {
    display: none;
  }
}

@media (max-width: 768px) {
  .menu-toggle {
    display: block;
  }

  .nav-menu {
    position: fixed;
    top: 80px;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--background-primary);
    flex-direction: column;
    padding: 2rem;
    gap: 2rem;
    transform: translateX(100%);
    transition: all 0.3s ease;
    overflow-y: auto;
  }

  .nav-menu.active {
    transform: translateX(0);
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
  }

  .nav-link {
    padding: 1rem;
    width: 100%;
    justify-content: center;
  }

  .nav-link span {
    display: inline;
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
}

.register-btn,
.dashboard-btn {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
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

@media (max-width: 768px) {
  .auth-buttons {
    flex-direction: column;
    width: 100%;
    gap: 0.5rem;
    padding: 1rem;
  }

  .login-btn,
  .register-btn,
  .dashboard-btn,
  .logout-btn {
    width: 100%;
    text-align: center;
  }
}
</style> 