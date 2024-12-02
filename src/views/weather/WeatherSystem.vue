<template>
  <div class="weather-system">
    <!-- Weather Overview -->
    <div class="weather-header">
      <div class="location-search">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery"
          type="text"
          placeholder="Search location (ICAO/City)"
          @input="searchLocations"
        />
        <div v-if="searchResults.length" class="search-results">
          <div 
            v-for="result in searchResults"
            :key="result.id"
            class="search-item"
            @click="selectLocation(result)"
          >
            <div class="location-info">
              <span class="location-name">{{ result.name }}</span>
              <span class="location-detail">{{ result.detail }}</span>
            </div>
            <i class="fas fa-chevron-right"></i>
          </div>
        </div>
      </div>

      <div class="weather-actions">
        <button 
          v-for="view in viewOptions"
          :key="view.id"
          @click="changeView(view.id)"
          class="view-btn"
          :class="{ active: currentView === view.id }"
        >
          <i :class="view.icon"></i>
          {{ view.label }}
        </button>
      </div>
    </div>

    <!-- Current Conditions -->
    <div v-if="currentView === 'current'" class="current-conditions">
      <div class="conditions-card">
        <div class="current-header">
          <div class="location-main">
            <h2>{{ currentLocation.name }}</h2>
            <span class="location-time">{{ currentTime }}</span>
          </div>
          <button @click="refreshWeather" class="btn-refresh">
            <i class="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>

        <div class="conditions-grid">
          <div class="condition-main">
            <div class="temp-display">
              <span class="temp">{{ currentTemp }}°</span>
              <span class="unit">C</span>
            </div>
            <div class="condition-info">
              <i :class="weatherIcon"></i>
              <span>{{ weatherCondition }}</span>
            </div>
          </div>

          <div class="conditions-details">
            <div class="detail-item">
              <i class="fas fa-wind"></i>
              <div class="detail-info">
                <span class="label">Wind</span>
                <span class="value">{{ windInfo }}</span>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-compress-alt"></i>
              <div class="detail-info">
                <span class="label">Pressure</span>
                <span class="value">{{ pressure }} hPa</span>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-tint"></i>
              <div class="detail-info">
                <span class="label">Humidity</span>
                <span class="value">{{ humidity }}%</span>
              </div>
            </div>
            <div class="detail-item">
              <i class="fas fa-eye"></i>
              <div class="detail-info">
                <span class="label">Visibility</span>
                <span class="value">{{ visibility }} km</span>
              </div>
            </div>
          </div>
        </div>

        <div class="metar-section">
          <h3>METAR</h3>
          <div class="metar-display">
            <code>{{ metarRaw }}</code>
            <button @click="copyMetar" class="btn-copy">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          <div class="metar-decoded">
            {{ metarDecoded }}
          </div>
        </div>
      </div>

      <div class="forecast-card">
        <h3>Forecast</h3>
        <div class="hourly-forecast">
          <div 
            v-for="hour in hourlyForecast"
            :key="hour.time"
            class="forecast-hour"
          >
            <span class="time">{{ hour.time }}</span>
            <i :class="hour.icon"></i>
            <span class="temp">{{ hour.temp }}°</span>
            <div class="wind-info">
              <i class="fas fa-arrow-up" :style="{ transform: `rotate(${hour.windDir}deg)` }"></i>
              {{ hour.windSpeed }}kt
            </div>
          </div>
        </div>

        <div class="taf-section">
          <h3>TAF</h3>
          <div class="taf-display">
            <code>{{ tafRaw }}</code>
            <button @click="copyTaf" class="btn-copy">
              <i class="fas fa-copy"></i>
            </button>
          </div>
          <div class="taf-decoded">
            {{ tafDecoded }}
          </div>
        </div>
      </div>
    </div>

    <!-- Weather Map -->
    <div v-else-if="currentView === 'map'" class="weather-map">
      <div class="map-controls">
        <div class="layer-controls">
          <button 
            v-for="layer in mapLayers"
            :key="layer.id"
            @click="toggleLayer(layer.id)"
            class="layer-btn"
            :class="{ active: layer.active }"
          >
            <i :class="layer.icon"></i>
            {{ layer.label }}
          </button>
        </div>
        <div class="time-controls">
          <button @click="previousTime" :disabled="isFirstTime">
            <i class="fas fa-chevron-left"></i>
          </button>
          <span class="time-display">{{ currentMapTime }}</span>
          <button @click="nextTime" :disabled="isLastTime">
            <i class="fas fa-chevron-right"></i>
          </button>
          <button @click="playAnimation" class="btn-play">
            <i :class="isPlaying ? 'fas fa-pause' : 'fas fa-play'"></i>
          </button>
        </div>
      </div>

      <div ref="mapContainer" class="map-container"></div>

      <div class="map-legend">
        <div 
          v-for="legend in activeLegends"
          :key="legend.id"
          class="legend-item"
        >
          <img :src="legend.image" :alt="legend.label" />
          <span>{{ legend.label }}</span>
        </div>
      </div>
    </div>

    <!-- Alerts -->
    <div v-else-if="currentView === 'alerts'" class="weather-alerts">
      <div class="alerts-header">
        <h3>Weather Alerts</h3>
        <div class="alert-filters">
          <select v-model="alertType" class="select-input">
            <option value="all">All Alerts</option>
            <option value="sigmet">SIGMETs</option>
            <option value="airmet">AIRMETs</option>
            <option value="notam">NOTAMs</option>
          </select>
          <button @click="refreshAlerts" class="btn-refresh">
            <i class="fas fa-sync-alt"></i>
            Refresh
          </button>
        </div>
      </div>

      <div class="alerts-grid">
        <div 
          v-for="alert in filteredAlerts"
          :key="alert.id"
          class="alert-card"
          :class="alert.type.toLowerCase()"
        >
          <div class="alert-header">
            <span class="alert-type">{{ alert.type }}</span>
            <span class="alert-time">{{ alert.time }}</span>
          </div>
          <div class="alert-content">
            <h4>{{ alert.title }}</h4>
            <p>{{ alert.description }}</p>
          </div>
          <div class="alert-footer">
            <span class="alert-area">{{ alert.area }}</span>
            <span class="alert-validity">Valid until {{ alert.validUntil }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/composables/useToast'
// Import map library of your choice (Leaflet, Mapbox, etc.)

const toast = useToast()

// State
const searchQuery = ref('')
const searchResults = ref([])
const currentView = ref('current')
const currentLocation = ref({
  name: 'KLAX - Los Angeles Intl',
  lat: 33.9425,
  lon: -118.4081
})
const currentTime = ref('')
const currentTemp = ref(22)
const weatherCondition = ref('Partly Cloudy')
const weatherIcon = ref('fas fa-cloud-sun')
const windInfo = ref('240° 10kt')
const pressure = ref(1013)
const humidity = ref(65)
const visibility = ref(10)
const metarRaw = ref('KLAX 241853Z 24010KT 10SM FEW035 SCT250 22/14 A2992 RMK AO2 SLP132 T02220139')
const tafRaw = ref('KLAX 241720Z 2418/2524 24012KT P6SM FEW035 SCT250')
const hourlyForecast = ref([
  { time: '19:00', temp: 22, icon: 'fas fa-cloud-sun', windDir: 240, windSpeed: 10 },
  { time: '20:00', temp: 21, icon: 'fas fa-cloud', windDir: 245, windSpeed: 12 },
  // ... more forecast hours
])

// Map state
const mapLayers = ref([
  { id: 'radar', label: 'Radar', icon: 'fas fa-satellite-dish', active: true },
  { id: 'satellite', label: 'Satellite', icon: 'fas fa-satellite', active: false },
  { id: 'winds', label: 'Winds', icon: 'fas fa-wind', active: false },
  { id: 'temp', label: 'Temperature', icon: 'fas fa-temperature-high', active: false }
])

// View options
const viewOptions = [
  { id: 'current', label: 'Current', icon: 'fas fa-cloud-sun' },
  { id: 'map', label: 'Map', icon: 'fas fa-map' },
  { id: 'alerts', label: 'Alerts', icon: 'fas fa-exclamation-triangle' }
]

// Computed
const metarDecoded = computed(() => {
  // Implement METAR decoding logic
  return 'Decoded METAR information...'
})

const tafDecoded = computed(() => {
  // Implement TAF decoding logic
  return 'Decoded TAF information...'
})

// Methods
function searchLocations() {
  // Implement location search
}

function selectLocation(location) {
  currentLocation.value = location
  searchQuery.value = ''
  searchResults.value = []
  refreshWeather()
}

function changeView(view) {
  currentView.value = view
}

function refreshWeather() {
  // Implement weather refresh
  toast.success('Weather data updated')
}

function copyMetar() {
  navigator.clipboard.writeText(metarRaw.value)
  toast.success('METAR copied to clipboard')
}

function copyTaf() {
  navigator.clipboard.writeText(tafRaw.value)
  toast.success('TAF copied to clipboard')
}

// Map methods
function toggleLayer(layerId) {
  const layer = mapLayers.value.find(l => l.id === layerId)
  if (layer) {
    layer.active = !layer.active
    updateMapLayers()
  }
}

function updateMapLayers() {
  // Implement map layer updates
}

// Lifecycle
onMounted(() => {
  // Initialize map and weather data
  updateCurrentTime()
  const timeInterval = setInterval(updateCurrentTime, 60000)
  
  onUnmounted(() => {
    clearInterval(timeInterval)
  })
})

function updateCurrentTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  })
}
</script>

<style lang="scss" scoped>
.weather-system {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.location-search {
  position: relative;
  flex: 1;
  max-width: 400px;
  
  input {
    width: 100%;
    padding: 0.75rem 1rem 0.75rem 2.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    
    &:focus {
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-light);
    }
  }
  
  i {
    position: absolute;
    left: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
}

.search-results {
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  z-index: 10;
}

.search-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1rem;
  cursor: pointer;
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  .location-info {
    display: flex;
    flex-direction: column;
    
    .location-name {
      font-weight: 500;
    }
    
    .location-detail {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  }
}

.weather-actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn {
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }
  
  i {
    margin-right: 0.5rem;
  }
}

.current-conditions {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.conditions-card,
.forecast-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.current-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 0.25rem;
  }
  
  .location-time {
    color: var(--text-secondary);
  }
}

.conditions-grid {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.condition-main {
  text-align: center;
  
  .temp-display {
    font-size: 4rem;
    font-weight: 300;
    line-height: 1;
    margin-bottom: 1rem;
    
    .unit {
      font-size: 2rem;
      color: var(--text-secondary);
    }
  }
  
  .condition-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-secondary);
    
    i {
      font-size: 2rem;
      color: var(--primary);
    }
  }
}

.conditions-details {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  i {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg-secondary);
    border-radius: var(--radius-md);
    color: var(--primary);
  }
  
  .detail-info {
    display: flex;
    flex-direction: column;
    
    .label {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
    
    .value {
      font-weight: 500;
    }
  }
}

.metar-section,
.taf-section {
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
}

.metar-display,
.taf-display {
  position: relative;
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: var(--radius-md);
  margin-bottom: 1rem;
  
  code {
    font-family: monospace;
    word-break: break-all;
  }
  
  .btn-copy {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    padding: 0.5rem;
    background: none;
    border: none;
    color: var(--text-secondary);
    cursor: pointer;
    
    &:hover {
      color: var(--primary);
    }
  }
}

.metar-decoded,
.taf-decoded {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.hourly-forecast {
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
  
  &::-webkit-scrollbar {
    height: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 3px;
    
    &:hover {
      background: var(--text-secondary);
    }
  }
}

.forecast-hour {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 80px;
  
  .time {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  i {
    font-size: 1.5rem;
    color: var(--primary);
  }
  
  .temp {
    font-weight: 500;
  }
  
  .wind-info {
    font-size: 0.875rem;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 0.25rem;
    
    i {
      font-size: 0.875rem;
      color: var(--text-secondary);
    }
  }
}

.weather-map {
  position: relative;
  height: 600px;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.map-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  right: 1rem;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.layer-controls,
.time-controls {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-primary);
  padding: 0.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.layer-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-secondary);
  cursor: pointer;
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  &.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
  }
  
  i {
    margin-right: 0.5rem;
  }
}

.time-controls {
  button {
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    background: none;
    color: var(--text-secondary);
    cursor: pointer;
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &:not(:disabled):hover {
      color: var(--primary);
    }
  }
  
  .time-display {
    padding: 0 1rem;
    color: var(--text-primary);
    font-weight: 500;
  }
  
  .btn-play {
    width: 2.5rem;
    background: var(--primary);
    border-radius: var(--radius-md);
    color: white;
    
    &:hover:not(:disabled) {
      background: var(--primary-dark);
    }
  }
}

.map-container {
  width: 100%;
  height: 100%;
}

.map-legend {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: var(--bg-primary);
  padding: 0.75rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  display: flex;
  gap: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  img {
    height: 20px;
  }
  
  span {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.weather-alerts {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.alerts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.alert-filters {
  display: flex;
  gap: 1rem;
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.alert-card {
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 1rem;
  border-left: 4px solid;
  
  &.sigmet { border-color: var(--error); }
  &.airmet { border-color: var(--warning); }
  &.notam { border-color: var(--info); }
}

.alert-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  
  .alert-type {
    font-weight: 500;
    padding: 0.25rem 0.5rem;
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    
    .sigmet & {
      background: var(--error-light);
      color: var(--error);
    }
    
    .airmet & {
      background: var(--warning-light);
      color: var(--warning);
    }
    
    .notam & {
      background: var(--info-light);
      color: var(--info);
    }
  }
  
  .alert-time {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.alert-content {
  margin-bottom: 1rem;
  
  h4 {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
    font-size: 0.875rem;
    line-height: 1.5;
  }
}

.alert-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

@media (max-width: 1024px) {
  .current-conditions {
    grid-template-columns: 1fr;
  }
  
  .conditions-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .conditions-details {
    justify-items: center;
  }
}

@media (max-width: 768px) {
  .weather-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .location-search {
    max-width: none;
  }
  
  .weather-actions {
    justify-content: center;
  }
  
  .map-controls {
    flex-direction: column;
    gap: 1rem;
  }
  
  .layer-controls {
    flex-wrap: wrap;
    justify-content: center;
  }
}
</style> 