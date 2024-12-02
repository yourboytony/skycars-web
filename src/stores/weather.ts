import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useToast } from '@/composables/useToast'

interface WeatherData {
  icao: string
  timestamp: string
  data: any // Replace with proper type when available
}

interface WeatherState {
  currentWeather: Record<string, WeatherData>
  forecasts: WeatherData[]
  metars: Record<string, WeatherData>
  tafs: Record<string, WeatherData>
  loading: boolean
  lastUpdate: string | null
}

export const useWeatherStore = defineStore('weather', () => {
  const toast = useToast()
  
  const state = ref<WeatherState>({
    currentWeather: {},
    forecasts: [],
    metars: {},
    tafs: {},
    loading: false,
    lastUpdate: null
  })

  async function fetchMetar(icao: string) {
    try {
      state.value.loading = true
      const response = await fetch(`/api/weather/metar/${icao}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch METAR')
      }

      const data = await response.json()
      state.value.metars[icao] = {
        icao,
        timestamp: new Date().toISOString(),
        data
      }
      state.value.lastUpdate = new Date().toISOString()
    } catch (error) {
      toast.show(error instanceof Error ? error.message : 'Failed to fetch METAR', 'error')
    } finally {
      state.value.loading = false
    }
  }

  async function fetchTaf(icao: string) {
    try {
      state.value.loading = true
      const response = await fetch(`/api/weather/taf/${icao}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch TAF')
      }

      const data = await response.json()
      state.value.tafs[icao] = {
        icao,
        timestamp: new Date().toISOString(),
        data
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : 'Failed to fetch TAF', 'error')
    } finally {
      state.value.loading = false
    }
  }

  async function fetchWeather(icao: string) {
    try {
      state.value.loading = true
      const response = await fetch(`/api/weather/${icao}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch weather')
      }

      const data = await response.json()
      state.value.currentWeather[icao] = {
        icao,
        timestamp: new Date().toISOString(),
        data
      }
    } catch (error) {
      toast.show(error instanceof Error ? error.message : 'Failed to fetch weather', 'error')
    } finally {
      state.value.loading = false
    }
  }

  // Add these new methods for the WeatherLayer component
  async function fetchRadarData() {
    // Implementation
  }

  async function fetchCloudsData() {
    // Implementation
  }

  async function fetchTemperatureData() {
    // Implementation
  }

  async function fetchWindData() {
    // Implementation
  }

  function clearWeatherData() {
    state.value = {
      currentWeather: {},
      forecasts: [],
      metars: {},
      tafs: {},
      loading: false,
      lastUpdate: null
    }
  }

  return {
    ...state.value,
    fetchMetar,
    fetchTaf,
    fetchWeather,
    fetchRadarData,
    fetchCloudsData,
    fetchTemperatureData,
    fetchWindData,
    clearWeatherData
  }
}) 