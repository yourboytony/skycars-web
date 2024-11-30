import { defineStore } from 'pinia'

export const useAircraftStore = defineStore('aircraft', {
  state: () => ({
    aircraftList: []
  }),
  actions: {
    fetchAircraft() {
      // Fetch logic...
    }
  }
}) 