import { defineStore } from 'pinia'
import axios from 'axios'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {
      id: null,
      name: '',
      email: '',
      phone: '',
      location: '',
      avatar: null,
      role: 'pilot',
      company: '',
      licenseNumber: '',
      ratings: [],
      totalHours: 0,
      lastFlight: null,
      preferences: {
        darkMode: false,
        emailNotifications: true,
        units: 'imperial', // or metric
        defaultAircraft: null,
        recentAirports: [],
        favoriteRoutes: []
      }
    },
    integrations: {
      simbrief: {
        username: null,
        pilotId: null,
        isConnected: false,
        lastSync: null
      },
      weather: {
        provider: 'checkwx',
        apiKey: null,
        isConnected: false
      },
      charts: {
        provider: null,
        credentials: null,
        isConnected: false
      }
    },
    flightLog: {
      total: 0,
      entries: [],
      recentFlights: []
    },
    aircraft: {
      favorites: [],
      recent: []
    },
    isAuthenticated: false,
    isLoading: false,
    error: null,
    lastUpdate: null
  }),

  getters: {
    // User Info
    getUserProfile: (state) => state.user,
    getPreferences: (state) => state.user.preferences,
    getIntegrations: (state) => state.integrations,
    isSimBriefConnected: (state) => state.integrations.simbrief.isConnected,
    hasWeatherApi: (state) => state.integrations.weather.isConnected,
    
    // Flight Related
    getRecentFlights: (state) => state.flightLog.recentFlights,
    getFavoriteAircraft: (state) => state.aircraft.favorites,
    getTotalHours: (state) => state.user.totalHours,
    
    // Preferences
    isDarkMode: (state) => state.user.preferences.darkMode,
    getUnits: (state) => state.user.preferences.units,
    getFavoriteRoutes: (state) => state.user.preferences.favoriteRoutes
  },

  actions: {
    // User Profile Management
    async updateProfile(profileData) {
      try {
        this.isLoading = true
        // TODO: API call to update profile
        this.user = { ...this.user, ...profileData }
        this.lastUpdate = new Date()
        return true
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateAvatar(file) {
      try {
        this.isLoading = true
        // TODO: API call to upload avatar
        // this.user.avatar = response.data.avatarUrl
        return true
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Integration Management
    async saveSimBriefCredentials(credentials) {
      try {
        const { username, pilotId } = credentials
        this.integrations.simbrief = {
          username,
          pilotId,
          isConnected: true,
          lastSync: new Date()
        }
        localStorage.setItem('simbrief_credentials', JSON.stringify(credentials))
        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    async saveWeatherApiKey(apiKey) {
      try {
        this.integrations.weather = {
          provider: 'checkwx',
          apiKey,
          isConnected: true
        }
        localStorage.setItem('weather_api_key', apiKey)
        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Preferences Management
    async updatePreferences(preferences) {
      try {
        this.user.preferences = { ...this.user.preferences, ...preferences }
        localStorage.setItem('user_preferences', JSON.stringify(this.user.preferences))
        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Flight Log Management
    async addFlightLog(flightData) {
      try {
        this.flightLog.entries.unshift(flightData)
        this.flightLog.total += 1
        this.user.totalHours += flightData.duration
        this.user.lastFlight = flightData
        return true
      } catch (error) {
        this.error = error.message
        throw error
      }
    },

    // Aircraft Management
    async addFavoriteAircraft(aircraft) {
      if (!this.aircraft.favorites.find(a => a.id === aircraft.id)) {
        this.aircraft.favorites.push(aircraft)
      }
    },

    async removeFavoriteAircraft(aircraftId) {
      this.aircraft.favorites = this.aircraft.favorites.filter(a => a.id !== aircraftId)
    },

    // Route Management
    async addFavoriteRoute(route) {
      if (!this.user.preferences.favoriteRoutes.find(r => 
        r.departure === route.departure && r.arrival === route.arrival
      )) {
        this.user.preferences.favoriteRoutes.push(route)
      }
    },

    // Data Loading
    async loadUserData() {
      try {
        this.isLoading = true
        // Load preferences
        const preferences = localStorage.getItem('user_preferences')
        if (preferences) {
          this.user.preferences = { ...this.user.preferences, ...JSON.parse(preferences) }
        }

        // Load SimBrief credentials
        const simbrief = localStorage.getItem('simbrief_credentials')
        if (simbrief) {
          this.integrations.simbrief = { ...JSON.parse(simbrief), isConnected: true }
        }

        // Load Weather API key
        const weatherKey = localStorage.getItem('weather_api_key')
        if (weatherKey) {
          this.integrations.weather = {
            provider: 'checkwx',
            apiKey: weatherKey,
            isConnected: true
          }
        }

        return true
      } catch (error) {
        this.error = error.message
        throw error
      } finally {
        this.isLoading = false
      }
    },

    // Error Handling
    clearError() {
      this.error = null
    },

    // Cleanup
    resetStore() {
      this.$reset()
    }
  }
}) 