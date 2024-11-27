<template>
  <div class="app">
    <Navbar />
    <router-view v-slot="{ Component }">
      <transition name="page" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Navbar from './components/Navbar.vue'
</script>

<style>
/* Base Variables */
:root {
  --background-primary: #0a0a0a;
  --background-primary-rgb: 10, 10, 10;
  --background-secondary: #111111;
  --text-color: #ffffff;
  --text-light: #a0a0a0;
  --border-color: #2a2a2a;
  --primary-color: #3b82f6;
  --primary-rgb: 59, 130, 246;
  --accent-color: #8b5cf6;
  --accent-rgb: 139, 92, 246;
}

/* Reset & Base Styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
  background: var(--background-primary);
  color: var(--text-color);
  line-height: 1.6;
}

/* Page Transition */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.3s ease;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}

/* Global Styles */
button {
  font-family: inherit;
}

input,
textarea {
  font-family: inherit;
}

/* Utility Classes */
.glass {
  background: rgba(var(--background-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style> 