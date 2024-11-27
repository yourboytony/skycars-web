import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    isDark: localStorage.getItem('theme') === 'dark'
  }),
  
  actions: {
    toggleTheme() {
      this.isDark = !this.isDark
      localStorage.setItem('theme', this.isDark ? 'dark' : 'light')
      document.documentElement.classList.toggle('dark', this.isDark)
    },
    
    initTheme() {
      // Check system preference on first load
      if (!localStorage.getItem('theme')) {
        this.isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      }
      document.documentElement.classList.toggle('dark', this.isDark)
    }
  }
}) 