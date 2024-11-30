import axios from 'axios'
import { useUserStore } from '@/stores/user'

// API Configuration
const CHECKWX_API_KEY = '769330e7548b49dda87c211300'
const CHECKWX_BASE_URL = 'https://api.checkwx.com'
const NOTAM_BASE_URL = 'https://applications.icao.int/dataservices/api/notams-realtime-list'

// Create API instances
const weatherApi = axios.create({
  baseURL: CHECKWX_BASE_URL,
  headers: {
    'X-API-Key': CHECKWX_API_KEY
  }
})

const notamApi = axios.create({
  baseURL: NOTAM_BASE_URL
})

export const weatherService = {
  // Get METAR for single or multiple airports
  async getMetar(icao) {
    const userStore = useUserStore()
    const apiKey = await userStore.getWeatherApiKey()
    
    if (!apiKey) {
      throw new Error('Weather API key not configured')
    }

    try {
      const response = await axios.get(`https://api.checkwx.com/metar/${icao}`, {
        headers: {
          'X-API-Key': apiKey
        }
      })
      return response.data.data
    } catch (error) {
      console.error('METAR fetch failed:', error)
      throw error
    }
  },

  // Get TAF for single or multiple airports
  async getTaf(icao) {
    const userStore = useUserStore()
    const apiKey = await userStore.getWeatherApiKey()
    
    if (!apiKey) {
      throw new Error('Weather API key not configured')
    }

    try {
      const response = await axios.get(`https://api.checkwx.com/taf/${icao}`, {
        headers: {
          'X-API-Key': apiKey
        }
      })
      return response.data.data
    } catch (error) {
      console.error('TAF fetch failed:', error)
      throw error
    }
  },

  // Get station information
  async getStation(icao) {
    try {
      const response = await weatherApi.get(`/station/${icao}`)
      return response.data.data
    } catch (error) {
      console.error('Station fetch failed:', error)
      throw error
    }
  }
}

export const notamService = {
  // Get NOTAMs for an airport
  async getAirportNotams(icao) {
    try {
      // Using the free ICAO API (requires registration)
      const response = await notamApi.get(`?api_key=${process.env.VITE_NOTAM_API_KEY}&format=json&locations=${icao}`)
      return response.data
    } catch (error) {
      console.error('NOTAM fetch failed:', error)
      throw error
    }
  },

  // Get NOTAMs for a route
  async getRouteNotams(departure, arrival, alternates = []) {
    try {
      const airports = [departure, arrival, ...alternates].join(',')
      const response = await notamApi.get(`?api_key=${process.env.VITE_NOTAM_API_KEY}&format=json&locations=${airports}`)
      return response.data
    } catch (error) {
      console.error('Route NOTAMs fetch failed:', error)
      throw error
    }
  }
} 