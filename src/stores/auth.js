import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
  const router = useRouter()
  const user = ref(null)
  const isAuthenticated = ref(false)

  async function login(credentials) {
    try {
      // Your login logic here
      isAuthenticated.value = true
      // Redirect to the new dashboard after successful login
      router.push('/dashboard')
    } catch (error) {
      throw error
    }
  }

  async function logout() {
    try {
      // Your logout logic here
      isAuthenticated.value = false
      router.push('/login')
    } catch (error) {
      throw error
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    logout
  }
})
