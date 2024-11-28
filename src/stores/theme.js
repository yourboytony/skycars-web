import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref(localStorage.getItem('theme') === 'dark')

  function toggle() {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  // Watch for changes and update document class
  watch(isDark, (newValue) => {
    document.documentElement.classList.toggle('dark', newValue)
  }, { immediate: true })

  return {
    isDark,
    toggle
  }
}) 