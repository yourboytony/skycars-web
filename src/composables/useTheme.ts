import { ref, onMounted } from 'vue'

export function useTheme() {
  const isDark = ref(false)
  const theme = ref<'light' | 'dark'>('light')

  const updateTheme = (dark: boolean) => {
    isDark.value = dark
    theme.value = dark ? 'dark' : 'light'
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
    theme,
    toggleTheme
  }
} 