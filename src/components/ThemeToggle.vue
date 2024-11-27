<template>
  <button 
    @click="themeStore.toggleTheme()" 
    class="theme-toggle"
    :title="themeStore.isDark ? 'Switch to light mode' : 'Switch to dark mode'"
  >
    <div class="icon-container">
      <i class="fas fa-sun sun-icon" :class="{ active: !themeStore.isDark }"></i>
      <i class="fas fa-moon moon-icon" :class="{ active: themeStore.isDark }"></i>
    </div>
  </button>
</template>

<script setup>
import { useThemeStore } from '../stores/theme'

const themeStore = useThemeStore()
</script>

<style scoped>
.theme-toggle {
  position: relative;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.icon-container {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sun-icon,
.moon-icon {
  position: absolute;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  opacity: 0;
  transform: scale(0.5);
}

.sun-icon {
  color: var(--accent-color);
}

.moon-icon {
  color: var(--primary-color);
}

.sun-icon.active,
.moon-icon.active {
  opacity: 1;
  transform: scale(1);
}

.theme-toggle:hover {
  background: var(--background-hover);
}
</style> 