import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // Try to get the value from localStorage
  const stored = localStorage.getItem(key)
  
  // Create a ref with either the stored value or default
  const value = ref(stored ? JSON.parse(stored) : defaultValue)

  // Watch for changes and update localStorage
  watch(
    value,
    (newValue) => {
      if (newValue === null) {
        localStorage.removeItem(key)
      } else {
        localStorage.setItem(key, JSON.stringify(newValue))
      }
    },
    { deep: true }
  )

  return value
} 