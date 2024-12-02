<template>
  <div class="layout">
    <nav-sidebar />
    <div class="main-content">
      <nav-header />
      <main>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import NavSidebar from '@/components/navigation/NavSidebar.vue'
import NavHeader from '@/components/navigation/NavHeader.vue'
</script>

<style lang="scss" scoped>
.layout {
  display: flex;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
}

main {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

// Transitions
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--transition-normal);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 