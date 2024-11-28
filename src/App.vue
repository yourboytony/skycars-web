<template>
  <div class="app">
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import Navbar from './components/Navbar.vue'
import { useAuthStore } from './stores/auth'
import { useMarketplaceStore } from './stores/marketplace'

const auth = useAuthStore()
const marketplace = useMarketplaceStore()

onMounted(async () => {
  // Check for stored token and validate it
  if (auth.token) {
    try {
      await auth.validateToken()
      if (auth.isAuthenticated()) {
        await marketplace.fetchCredits()
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      auth.logout()
    }
  }
})
</script>

<style>
.app {
  min-height: 100vh;
  background: var(--background-primary);
}

/* Transition Animations */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 