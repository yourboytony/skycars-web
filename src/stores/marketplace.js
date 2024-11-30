import { defineStore } from 'pinia'

export const useMarketplaceStore = defineStore('marketplace', {
  state: () => ({
    credits: 0,
    favorites: [],
    messages: [],
    unreadCount: 0
  }),

  actions: {
    async fetchCredits() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/credits/balance`, {
          headers: {
            'Authorization': `Bearer ${this.auth.token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.credits = data.credits
        }
      } catch (error) {
        console.error('Failed to fetch credits:', error)
      }
    },

    async fetchFavorites() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/favorites`, {
          headers: {
            'Authorization': `Bearer ${this.auth.token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.favorites = data.favorites
        }
      } catch (error) {
        console.error('Failed to fetch favorites:', error)
      }
    },

    async toggleFavorite(listingId) {
      const isFavorite = this.favorites.some(f => f.listing_id === listingId)
      const method = isFavorite ? 'DELETE' : 'POST'

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/listings/${listingId}/favorite`,
          {
            method,
            headers: {
              'Authorization': `Bearer ${this.auth.token}`
            }
          }
        )
        
        if (response.ok) {
          if (isFavorite) {
            this.favorites = this.favorites.filter(f => f.listing_id !== listingId)
          } else {
            await this.fetchFavorites()
          }
        }
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    },

    async fetchMessages() {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/messages`, {
          headers: {
            'Authorization': `Bearer ${this.auth.token}`
          }
        })
        const data = await response.json()
        if (response.ok) {
          this.messages = data.messages
          this.unreadCount = data.messages.filter(m => !m.read).length
        }
      } catch (error) {
        console.error('Failed to fetch messages:', error)
      }
    }
  }
}) 