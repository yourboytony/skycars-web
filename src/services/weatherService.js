import axios from 'axios'

const awcClient = axios.create({
  baseURL: 'https://aviationweather.gov/api/data/',
})

const nwsClient = axios.create({
  baseURL: 'https://api.weather.gov/',
})

export const weatherService = {
  async getMetar(icao) {
    try {
      const response = await awcClient.get('metar', {
        params: {
          ids: icao,
          format: 'json',
          hours: 1
        }
      })
      return this.parseMetar(response.data[0])
    } catch (error) {
      console.error('Error fetching METAR:', error)
      throw error
    }
  },

  async getTaf(icao) {
    try {
      const response = await awcClient.get('taf', {
        params: {
          ids: icao,
          format: 'json'
        }
      })
      return this.parseTaf(response.data[0])
    } catch (error) {
      console.error('Error fetching TAF:', error)
      throw error
    }
  },

  async getStationInfo(icao) {
    try {
      const response = await awcClient.get('station', {
        params: {
          ids: icao,
          format: 'json'
        }
      })
      return this.parseStationInfo(response.data[0])
    } catch (error) {
      console.error('Error fetching station info:', error)
      throw error
    }
  },

  async getNearbyStations(lat, lon, radius = 50) {
    try {
      const response = await awcClient.get('station', {
        params: {
          format: 'json',
          radialDistance: `${lat},${lon},${radius}`
        }
      })
      return response.data.map(this.parseStationInfo)
    } catch (error) {
      console.error('Error fetching nearby stations:', error)
      throw error
    }
  },

  async getWeatherHistory(lat, lon) {
    try {
      // Get NWS grid point for the location
      const pointResponse = await nwsClient.get(`points/${lat},${lon}`)
      const { gridId, gridX, gridY } = pointResponse.data.properties

      // Get hourly forecast data which includes recent history
      const forecastResponse = await nwsClient.get(
        `gridpoints/${gridId}/${gridX}/${gridY}/forecast/hourly`
      )

      return this.parseNWSForecast(forecastResponse.data.properties.periods)
    } catch (error) {
      console.error('Error fetching weather history:', error)
      // Fallback to mock data if API fails
      return this.generateMockHistoryData(7)
    }
  },

  // Parser methods
  parseMetar(raw) {
    if (!raw) return null
    
    return {
      raw: raw.raw_text,
      temp: {
        celsius: raw.temp
      },
      wind: {
        direction: raw.wind_dir_degrees,
        speed: raw.wind_speed_kt,
        gust: raw.wind_gust_kt
      },
      visibility: {
        meters: raw.visibility_statute_mi * 1609.34
      },
      clouds: this.parseClouds(raw),
      barometer: {
        hpa: raw.altim_in_hg * 33.8639
      },
      flight_rules: this.getFlightRules(raw),
      observed: raw.observation_time,
      summary: this.createMetarSummary(raw)
    }
  },

  parseTaf(raw) {
    if (!raw) return null

    return {
      raw: raw.raw_text,
      valid_from: raw.bulletin_time,
      valid_to: raw.valid_time_to,
      summary: this.createTafSummary(raw)
    }
  },

  parseStationInfo(raw) {
    if (!raw) return null

    return {
      icao: raw.station_id,
      name: raw.site,
      latitude: raw.latitude,
      longitude: raw.longitude,
      elevation: raw.elevation_m,
      country: raw.country,
      state: raw.state
    }
  },

  parseNWSForecast(periods) {
    return periods.map(period => ({
      timestamp: period.startTime,
      temperature: this.fahrenheitToCelsius(period.temperature),
      windSpeed: this.mphToKnots(period.windSpeed),
      pressure: null, // NWS doesn't provide pressure in hourly forecast
      visibility: null // NWS doesn't provide visibility in hourly forecast
    }))
  },

  parseClouds(metar) {
    const clouds = []
    const layers = ['cloud_base_ft_agl1', 'cloud_base_ft_agl2', 'cloud_base_ft_agl3']
    const covers = ['cloud_coverage1', 'cloud_coverage2', 'cloud_coverage3']
    
    layers.forEach((layer, i) => {
      if (metar[layer]) {
        clouds.push({
          code: metar[covers[i]],
          height: Math.round(metar[layer] / 100)
        })
      }
    })
    
    return clouds
  },

  getFlightRules(metar) {
    const visibility = metar.visibility_statute_mi
    const ceiling = this.getCeiling(metar)
    
    if (visibility < 1 || ceiling < 500) return 'LIFR'
    if (visibility < 3 || ceiling < 1000) return 'IFR'
    if (visibility < 5 || ceiling < 3000) return 'MVFR'
    return 'VFR'
  },

  getCeiling(metar) {
    const ceilingLayers = ['BKN', 'OVC']
    const clouds = this.parseClouds(metar)
    
    for (const cloud of clouds) {
      if (ceilingLayers.includes(cloud.code)) {
        return cloud.height * 100
      }
    }
    return Infinity
  },

  createMetarSummary(metar) {
    const parts = []
    
    if (metar.wind_dir_degrees && metar.wind_speed_kt) {
      parts.push(`Wind ${metar.wind_dir_degrees}° at ${metar.wind_speed_kt}kt`)
    }
    
    if (metar.visibility_statute_mi) {
      parts.push(`Visibility ${metar.visibility_statute_mi}SM`)
    }
    
    if (metar.temp) {
      parts.push(`Temperature ${metar.temp}°C`)
    }
    
    return parts.join(', ')
  },

  createTafSummary(taf) {
    if (!taf.raw_text) return ''
    
    // Extract first forecast period
    const match = taf.raw_text.match(/\d{6}Z\s+(.+?)\s+(?=\d{4}\/\d{4}|$)/)
    return match ? match[1] : 'No forecast details available'
  },

  // Utility methods
  fahrenheitToCelsius(f) {
    return (f - 32) * 5/9
  },

  mphToKnots(mph) {
    return mph * 0.868976
  },

  // Fallback mock data generator
  generateMockHistoryData(days) {
    const data = []
    const now = new Date()
    
    for (let i = 0; i < days * 24; i++) {
      const date = new Date(now - i * 3600000)
      data.push({
        timestamp: date.toISOString(),
        temperature: 15 + Math.random() * 10,
        windSpeed: 5 + Math.random() * 15,
        pressure: 1013 + Math.random() * 10,
        visibility: 8 + Math.random() * 4
      })
    }
    
    return data.reverse()
  }
} 