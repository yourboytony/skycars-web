<template>
  <div class="weather-panel">
    <!-- Route Weather Overview -->
    <div class="route-weather" v-if="currentRoute">
      <div class="route-header">
        <h2>Route Weather</h2>
        <div class="route-airports">
          {{ currentRoute.departure }} → {{ currentRoute.arrival }}
        </div>
      </div>

      <!-- Weather Map -->
      <div class="weather-map">
        <div class="map-controls">
          <div class="layer-toggles">
            <button 
              v-for="layer in mapLayers"
              :key="layer.id"
              @click="toggleLayer(layer.id)"
              :class="['layer-btn', { active: activeMapLayers.includes(layer.id) }]"
            >
              <i :class="layer.icon"></i>
              {{ layer.name }}
            </button>
          </div>
          <div class="map-actions">
            <button @click="centerMap">
              <i class="fas fa-crosshairs"></i>
            </button>
            <button @click="toggleAnimation">
              <i :class="['fas', isAnimating ? 'fa-pause' : 'fa-play']"></i>
            </button>
          </div>
        </div>

        <!-- Map Container -->
        <div ref="mapContainer" class="map-container"></div>
      </div>

      <!-- Weather Alerts -->
      <div class="weather-alerts" v-if="alerts.length">
        <div 
          v-for="alert in alerts" 
          :key="alert.id"
          :class="['alert-item', alert.severity]"
        >
          <i :class="alert.icon"></i>
          <span>{{ alert.message }}</span>
        </div>
      </div>
    </div>

    <!-- Airport Weather Details -->
    <div class="airport-weather">
      <!-- Departure Weather -->
      <div class="weather-card departure">
        <div class="weather-header">
          <h3>Departure ({{ currentRoute?.departure }})</h3>
          <span class="update-time">Updated: {{ formatTime(depWeather?.time) }}</span>
        </div>

        <div class="weather-content" v-if="depWeather">
          <!-- METAR -->
          <div class="metar-section">
            <div class="raw-metar">{{ depWeather.metar }}</div>
            <div class="conditions">
              <div class="condition-item">
                <i class="fas fa-wind"></i>
                <span>{{ depWeather.wind }}</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-eye"></i>
                <span>{{ depWeather.visibility }}</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-cloud"></i>
                <span>{{ depWeather.clouds }}</span>
              </div>
            </div>
          </div>

          <!-- TAF -->
          <div class="taf-section">
            <h4>TAF</h4>
            <div class="taf-periods">
              <div 
                v-for="period in depWeather.taf"
                :key="period.time"
                class="taf-period"
              >
                <div class="period-time">{{ formatTime(period.time) }}</div>
                <div class="period-conditions">{{ period.conditions }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Arrival Weather -->
      <div class="weather-card arrival">
        <div class="weather-header">
          <h3>Arrival ({{ currentRoute?.arrival }})</h3>
          <span class="update-time">Updated: {{ formatTime(arrWeather?.time) }}</span>
        </div>

        <div class="weather-content" v-if="arrWeather">
          <!-- METAR -->
          <div class="metar-section">
            <div class="raw-metar">{{ arrWeather.metar }}</div>
            <div class="conditions">
              <div class="condition-item">
                <i class="fas fa-wind"></i>
                <span>{{ arrWeather.wind }}</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-eye"></i>
                <span>{{ arrWeather.visibility }}</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-cloud"></i>
                <span>{{ arrWeather.clouds }}</span>
              </div>
            </div>
          </div>

          <!-- TAF -->
          <div class="taf-section">
            <h4>TAF</h4>
            <div class="taf-periods">
              <div 
                v-for="period in arrWeather.taf"
                :key="period.time"
                class="taf-period"
              >
                <div class="period-time">{{ formatTime(period.time) }}</div>
                <div class="period-conditions">{{ period.conditions }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- En-route Weather -->
      <div class="weather-card enroute">
        <div class="weather-header">
          <h3>En-route Conditions</h3>
        </div>

        <div class="enroute-content">
          <div class="wind-aloft">
            <h4>Winds Aloft</h4>
            <div class="wind-levels">
              <div 
                v-for="level in windLevels"
                :key="level.altitude"
                class="wind-level"
              >
                <span class="altitude">FL{{ level.altitude }}</span>
                <span class="wind-data">
                  {{ level.direction }}°/{{ level.speed }}kt
                </span>
                <span class="temperature">{{ level.temp }}°C</span>
              </div>
            </div>
          </div>

          <div class="sigmets" v-if="sigmets.length">
            <h4>SIGMETs</h4>
            <div class="sigmet-list">
              <div 
                v-for="sigmet in sigmets"
                :key="sigmet.id"
                class="sigmet-item"
              >
                {{ sigmet.text }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
// Import format conditionally
let format = (date, pattern) => date.toLocaleString()
try {
  const dateFns = await import('date-fns')
  format = dateFns.format
} catch (error) {
  console.warn('date-fns not available, using fallback date formatting')
}

// State
const currentRoute = ref(null)
const depWeather = ref(null)
const arrWeather = ref(null)
const alerts = ref([])
const sigmets = ref([])
const windLevels = ref([])
const mapContainer = ref(null)
const map = ref(null)
const isAnimating = ref(false)
const activeMapLayers = ref(['radar'])
const weatherError = ref(null)
const isLoading = ref(false)

// Map layer configuration
const mapLayers = [
  { id: 'radar', name: 'Radar', icon: 'fas fa-satellite-dish' },
  { id: 'clouds', name: 'Clouds', icon: 'fas fa-cloud' },
  { id: 'lightning', name: 'Lightning', icon: 'fas fa-bolt' },
  { id: 'turbulence', name: 'Turbulence', icon: 'fas fa-wind' }
]

// Methods
function formatTime(date) {
  if (!date) return ''
  try {
    return format(new Date(date), 'MMM dd, HH:mm')
  } catch (error) {
    return new Date(date).toLocaleString()
  }
}

function toggleLayer(layerId) {
  const index = activeMapLayers.value.indexOf(layerId)
  if (index === -1) {
    activeMapLayers.value.push(layerId)
  } else {
    activeMapLayers.value.splice(index, 1)
  }
  updateMapLayers()
}

function toggleAnimation() {
  isAnimating.value = !isAnimating.value
  // Implement radar animation
}

function centerMap() {
  if (!map.value || !currentRoute.value) return
  // Center map on route
}

function updateMapLayers() {
  if (!map.value) return
  // Update map layers based on activeMapLayers
}

// Fetch weather data for an airport
async function fetchAirportWeather(icao) {
  if (!icao) return
  
  isLoading.value = true
  try {
    const [metar, taf, station] = await Promise.all([
      weatherService.getMetar(icao),
      weatherService.getTaf(icao),
      weatherService.getStation(icao)
    ])

    return {
      metar: metar[0], // Latest METAR
      taf: taf[0], // Latest TAF
      station: station[0], // Station info
      time: new Date(),
      parsed: parseWeatherData(metar[0])
    }
  } catch (error) {
    console.error(`Weather fetch failed for ${icao}:`, error)
    weatherError.value = `Failed to fetch weather for ${icao}`
    throw error
  } finally {
    isLoading.value = false
  }
}

// Parse METAR data into readable format
function parseWeatherData(metar) {
  if (!metar) return null
  
  return {
    wind: parseWind(metar),
    visibility: parseVisibility(metar),
    clouds: parseClouds(metar),
    temperature: parseTemperature(metar),
    pressure: parsePressure(metar)
  }
}

// Update weather for current route
async function updateRouteWeather() {
  if (!currentRoute.value) return
  
  try {
    const [depData, arrData] = await Promise.all([
      fetchAirportWeather(currentRoute.value.departure),
      fetchAirportWeather(currentRoute.value.arrival)
    ])

    depWeather.value = depData
    arrWeather.value = arrData
    
    // Update weather alerts based on conditions
    updateWeatherAlerts()
  } catch (error) {
    console.error('Route weather update failed:', error)
  }
}

// Watch for route changes
watch(() => currentRoute.value, updateRouteWeather, { immediate: true })

// Set up automatic weather refresh (every 5 minutes)
onMounted(() => {
  updateRouteWeather()
  const refreshInterval = setInterval(updateRouteWeather, 300000)
  
  onUnmounted(() => {
    clearInterval(refreshInterval)
  })
})
</script>

<style scoped>
.weather-panel {
  height: 100%;
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 1rem;
  padding: 1rem;
  background: white;
}

.route-weather {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
}

.weather-map {
  height: 300px;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
}

.map-container {
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1000;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.airport-weather {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  overflow-y: auto;
}

.weather-card {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1rem;
}

.metar-section {
  margin-bottom: 1rem;
}

.raw-metar {
  font-family: monospace;
  padding: 0.5rem;
  background: #e2e8f0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
}

.conditions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.taf-periods {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.taf-period {
  padding: 0.5rem;
  background: #e2e8f0;
  border-radius: 4px;
}

.wind-levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.5rem;
}

.wind-level {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #e2e8f0;
  border-radius: 4px;
}

.weather-alerts {
  margin-top: 1rem;
}

.alert-item {
  padding: 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.alert-item.severe {
  background: #fee2e2;
  color: #991b1b;
}

.alert-item.moderate {
  background: #fef3c7;
  color: #92400e;
}

.layer-btn {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.layer-btn.active {
  background: #2563eb;
  color: white;
  border-color: #2563eb;
}

/* Add responsive styles as needed */
</style> 