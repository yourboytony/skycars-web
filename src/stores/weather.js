import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useWeatherStore = defineStore('weather', () => {
  const metar = ref(null)
  const taf = ref(null)
  const loading = ref(false)
  const error = ref(null)

  const API_KEY = '769330e7548b49dda87c211300'

  async function fetchMetar(icao) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`https://api.checkwx.com/metar/${icao}/decoded`, {
        headers: {
          'X-API-Key': API_KEY
        }
      })
      
      const data = await response.json()
      
      if (data.results > 0) {
        metar.value = data.data[0]
      } else {
        error.value = 'No METAR data available for this airport'
      }
    } catch (err) {
      console.error('Error fetching METAR:', err)
      error.value = 'Failed to fetch weather data'
    } finally {
      loading.value = false
    }
  }

  async function fetchTaf(icao) {
    loading.value = true
    error.value = null
    
    try {
      const response = await fetch(`https://api.checkwx.com/taf/${icao}/decoded`, {
        headers: {
          'X-API-Key': API_KEY
        }
      })
      
      const data = await response.json()
      
      if (data.results > 0) {
        taf.value = data.data[0]
      } else {
        error.value = 'No TAF data available for this airport'
      }
    } catch (err) {
      console.error('Error fetching TAF:', err)
      error.value = 'Failed to fetch forecast data'
    } finally {
      loading.value = false
    }
  }

  return {
    metar,
    taf,
    loading,
    error,
    fetchMetar,
    fetchTaf
  }
}) 