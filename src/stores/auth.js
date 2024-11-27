import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('user-token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user-data') || 'null'))
  const isLoading = ref(false)
  const error = ref(null)

  const login = async (email, password) => {
    try {
      isLoading.value = true
      error.value = null
      
      console.log('Attempting login with:', { email }) // Debug log

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()
      console.log('Login response:', data) // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      // Store token and user data
      token.value = data.token
      user.value = data.user
      localStorage.setItem('user-token', data.token)
      localStorage.setItem('user-data', JSON.stringify(data.user))

      return data
    } catch (err) {
      console.error('Login error:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const register = async (name, email, password) => {
    try {
      isLoading.value = true
      error.value = null

      console.log('Attempting registration with:', { name, email }) // Debug log

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()
      console.log('Registration response:', data) // Debug log

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed')
      }

      // Store token and user data
      token.value = data.token
      user.value = data.user
      localStorage.setItem('user-token', data.token)
      localStorage.setItem('user-data', JSON.stringify(data.user))

      return data
    } catch (err) {
      console.error('Registration error:', err)
      error.value = err.message
      throw err
    } finally {
      isLoading.value = false
    }
  }

  const logout = () => {
    token.value = null
    user.value = null
    localStorage.removeItem('user-token')
    localStorage.removeItem('user-data')
  }

  const isAuthenticated = () => !!token.value

  return {
    token,
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    isAuthenticated
  }
}) 