import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    user: null,
    isAuthenticated: false,
    initialized: false
  }),

  getters: {
    getUser: (state) => state.user,
    getToken: (state) => state.token,
    isLoggedIn: (state) => state.isAuthenticated
  },

  actions: {
    setAuth({ token, user }) {
      console.log('Setting auth state:', { token, user })
      this.token = token
      this.user = user
      this.isAuthenticated = true
      
      // Save to localStorage as backup
      localStorage.setItem('auth', JSON.stringify({ token, user }))
    },

    clearAuth() {
      console.log('Clearing auth state')
      this.token = null
      this.user = null
      this.isAuthenticated = false
      localStorage.removeItem('auth')
    },

    initAuth() {
      console.log('Initializing auth state')
      const saved = localStorage.getItem('auth')
      if (saved) {
        const { token, user } = JSON.parse(saved)
        this.token = token
        this.user = user
        this.isAuthenticated = true
      }
      this.initialized = true
    }
  },

  persist: true
})
