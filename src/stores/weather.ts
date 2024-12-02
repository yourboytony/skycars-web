import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useToast } from '@/composables/useToast'
import { useAuthStore } from './auth'

export const useWeatherStore = defineStore('weather', () => {
  const toast = useToast()
  const authStore = useAuthStore()

  // State
  const currentWeather = ref({})
  const forecasts = ref([])
  const metars = ref({})
  const tafs = ref({})
  const loading = ref(false)
  const lastUpdate = ref(null)

  // Getters
  const isDataStale = computed(() => {
    if (!lastUpdate.value) return true
    const staleThreshold = 5 * 60 * 1000 // 5 minutes
    return Date.now() - lastUpdate.value > staleThreshold
  })

  // Actions
  async function fetchWeather(icao) {
    loading.value = true
    try {
      const response = await fetch(`/api/weather/${icao}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch weather')

      const data = await response.json()
      currentWeather.value = data.current
      forecasts.value = data.forecast
      lastUpdate.value = Date.now()
    } catch (error) {
      toast.error(error.message || 'Failed to load weather')
      throw error
    } finally {
      loading.value = false
    }
  }

  async function fetchMetar(icao) {
    try {
      const response = await fetch(`/api/weather/metar/${icao}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch METAR')

      const data = await response.json()
      metars.value[icao] = {
        raw: data.raw,
        decoded: data.decoded,
        timestamp: Date.now()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load METAR')
      throw error
    }
  }

  async function fetchTaf(icao) {
    try {
      const response = await fetch(`/api/weather/taf/${icao}`, {
        headers: {
          'Authorization': `Bearer ${authStore.token}`
        }
      })

      if (!response.ok) throw new Error('Failed to fetch TAF')

      const data = await response.json()
      tafs.value[icao] = {
        raw: data.raw,
        decoded: data.decoded,
        timestamp: Date.now()
      }
    } catch (error) {
      toast.error(error.message || 'Failed to load TAF')
      throw error
    }
  }

  function clearWeatherData() {
    currentWeather.value = {}
    forecasts.value = []
    metars.value = {}
    tafs.value = {}
    lastUpdate.value = null
  }

  return {
    currentWeather,
    forecasts,
    metars,
    tafs,
    loading,
    lastUpdate,
    isDataStale,
    fetchWeather,
    fetchMetar,
    fetchTaf,
    clearWeatherData
  }
}) 