import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    loading: false,
    error: null
  }),

  actions: {
    async register(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Registration failed')
        }

        this.token = data.token
        this.user = data.user

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async login(credentials) {
      this.loading = true
      this.error = null
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(credentials)
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Login failed')
        }

        this.token = data.token
        this.user = data.user

        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))

        return data
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      this.error = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    isAuthenticated() {
      return !!this.token
    }
  }
})
