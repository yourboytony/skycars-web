<template>
  <div class="app">
    <!-- Navigation Header -->
    <nav class="nav" :class="{ 'nav-scrolled': hasScrolled }">
      <div class="nav-content">
        <router-link to="/" class="logo">
          AviationTracker
        </router-link>
        
        <div class="nav-links">
          <router-link to="/radar">VATSIM Radar</router-link>
          <router-link to="/planning">Flight Planning</router-link>
          <router-link to="/weather">Weather</router-link>
          <router-link to="/forum">Forum</router-link>
          <router-link to="/about">About</router-link>
        </div>

        <div class="nav-auth">
          <template v-if="!isLoggedIn">
            <button @click="openModal('login')" class="btn btn-secondary">Login</button>
            <button @click="openModal('signup')" class="btn btn-primary">Sign Up</button>
          </template>
          <div v-else class="user-menu" @click="toggleUserMenu">
            <img :src="userAvatar" alt="User" class="avatar">
            <div class="dropdown-menu" v-if="showUserMenu">
              <router-link to="/profile">Profile</router-link>
              <router-link to="/settings">Settings</router-link>
              <button @click="logout">Logout</button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>AviationTracker</h3>
          <p>Your complete aviation tracking and planning solution.</p>
        </div>
        
        <div class="footer-section">
          <h4>Quick Links</h4>
          <router-link to="/radar">VATSIM Radar</router-link>
          <router-link to="/planning">Flight Planning</router-link>
          <router-link to="/weather">Weather</router-link>
        </div>

        <div class="footer-section">
          <h4>Legal</h4>
          <router-link to="/terms">Terms of Service</router-link>
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/contact">Contact Us</router-link>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} AviationTracker. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      hasScrolled: false,
      isLoggedIn: false,
      showUserMenu: false,
      userAvatar: '/default-avatar.png',
      currentYear: new Date().getFullYear()
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll)
  },
  unmounted() {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    handleScroll() {
      this.hasScrolled = window.scrollY > 50
    },
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
    },
    openModal(type) {
      // Implement modal logic
    },
    logout() {
      // Implement logout logic
    }
  }
}
</script>

<style>
:root {
  --primary-color: #2563eb;
  --secondary-color: #1e40af;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --nav-height: 70px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  color: var(--text-color);
  line-height: 1.5;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* Navigation Styles */
.nav {
  position: fixed;
  top: 0;
  width: 100%;
  height: var(--nav-height);
  background: transparent;
  transition: all 0.3s ease;
  z-index: 1000;
}

.nav-scrolled {
  background: var(--background-color);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
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
  transition: color 0.2s ease;
}

.nav-links a:hover {
  color: var(--primary-color);
}

/* Button Styles */
.btn {
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-secondary {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--text-color);
}

/* Main Content */
main {
  margin-top: var(--nav-height);
  flex: 1;
}

/* Footer Styles */
.footer {
  background: #f8fafc;
  padding: 4rem 2rem 2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.footer-section a {
  color: var(--text-color);
  text-decoration: none;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: var(--primary-color);
}

.footer-bottom {
  max-width: 1200px;
  margin: 2rem auto 0;
  padding-top: 2rem;
  border-top: 1px solid #e5e7eb;
  text-align: center;
  color: #6b7280;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .nav-links {
    display: none;
  }
  
  .nav-content {
    padding: 0 1rem;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
  }
}

/* User Menu Styles */
.user-menu {
  position: relative;
  cursor: pointer;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 0.5rem;
  min-width: 150px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.dropdown-menu a,
.dropdown-menu button {
  padding: 0.5rem;
  text-decoration: none;
  color: var(--text-color);
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.dropdown-menu a:hover,
.dropdown-menu button:hover {
  background-color: #f3f4f6;
}
</style> 