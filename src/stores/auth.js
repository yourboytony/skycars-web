import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user
  },

  actions: {
    async login(email, password) {
      this.loading = true
      this.error = null
      try {
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password })
        })

        const data = await response.json()
        
        if (!response.ok) throw new Error(data.message)

        this.token = data.token
        this.user = data.user
        localStorage.setItem('token', data.token)
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(email, password, username) {
      this.loading = true
      this.error = null
      
      try {
        console.log('Sending registration request')
        const response = await fetch('/api/auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password, username })
        })

        const data = await response.json()
        console.log('Registration response:', data)
        
        if (!response.ok) {
          throw new Error(data.message || 'Registration failed')
        }

        this.token = data.token
        this.user = data.user
        localStorage.setItem('token', data.token)
        
        return data
      } catch (error) {
        console.error('Registration error:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.token = null
      this.user = null
      localStorage.removeItem('token')
    }
  }
}) 