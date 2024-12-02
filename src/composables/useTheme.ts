import { ref, onMounted, watch } from 'vue'

export function useTheme() {
  const isDark = ref(false)

  const updateTheme = (dark: boolean) => {
    isDark.value = dark
    document.documentElement.classList.toggle('dark', dark)
  }

  const toggleTheme = () => {
    updateTheme(!isDark.value)
  }

  onMounted(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    updateTheme(prefersDark)
  })

  return {
    isDark,
    toggleTheme
  }
} 