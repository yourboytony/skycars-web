<template>
  <button 
    @click="themeStore.toggleTheme()" 
    class="theme-toggle"
    :class="{ 'dark': themeStore.isDark }"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <div class="toggle-wrapper">
      <i class="fas fa-sun sun-icon"></i>
      <i class="fas fa-moon moon-icon"></i>
      <div class="toggle-circle"></div>
    </div>
  </button>
</template>

<script setup>
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 80px;
  height: 40px;
  border-radius: 20px;
  padding: 4px;
  border: none;
  cursor: pointer;
  background: #f0f0f0;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.theme-toggle.dark {
  background: #2d3748;
}

.toggle-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px;
}

.sun-icon,
.moon-icon {
  font-size: 1.2rem;
  z-index: 1;
}

.sun-icon {
  color: #f59e0b;
}

.moon-icon {
  color: #60a5fa;
}

.toggle-circle {
  position: absolute;
  left: 4px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: white;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.dark .toggle-circle {
  transform: translateX(40px);
  background: #1a202c;
}

.theme-toggle:hover {
  transform: scale(1.05);
}
</style> 