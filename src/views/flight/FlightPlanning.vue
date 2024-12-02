<template>
  <div class="flight-planning">
    <div class="planning-container">
      <!-- Flight Plan Form -->
      <div class="plan-form">
        <div class="form-header">
          <h2>Flight Plan</h2>
          <div class="form-actions">
            <button @click="savePlan" class="btn-primary" :disabled="!isValid">
              <i class="fas fa-save"></i>
              Save Plan
            </button>
            <button @click="clearPlan" class="btn-secondary">
              <i class="fas fa-times"></i>
              Clear
            </button>
          </div>
        </div>

        <div class="route-inputs">
          <div class="input-group">
            <label>Departure</label>
            <div class="airport-input">
              <i class="fas fa-plane-departure"></i>
              <input 
                v-model="departure"
                type="text"
                placeholder="ICAO code"
                @input="searchAirports('departure')"
              />
              <div v-if="showDepartureResults" class="airport-results">
                <div 
                  v-for="airport in departureResults"
                  :key="airport.icao"
                  class="airport-item"
                  @click="selectAirport('departure', airport)"
                >
                  <span class="airport-code">{{ airport.icao }}</span>
                  <span class="airport-name">{{ airport.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <button @click="swapAirports" class="btn-swap">
            <i class="fas fa-exchange-alt"></i>
          </button>

          <div class="input-group">
            <label>Arrival</label>
            <div class="airport-input">
              <i class="fas fa-plane-arrival"></i>
              <input 
                v-model="arrival"
                type="text"
                placeholder="ICAO code"
                @input="searchAirports('arrival')"
              />
              <div v-if="showArrivalResults" class="airport-results">
                <div 
                  v-for="airport in arrivalResults"
                  :key="airport.icao"
                  class="airport-item"
                  @click="selectAirport('arrival', airport)"
                >
                  <span class="airport-code">{{ airport.icao }}</span>
                  <span class="airport-name">{{ airport.name }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="flight-details">
          <div class="detail-row">
            <div class="input-group">
              <label>Aircraft</label>
              <select v-model="aircraft" class="select-input">
                <option value="">Select Aircraft</option>
                <option 
                  v-for="ac in aircraftList" 
                  :key="ac.id" 
                  :value="ac.id"
                >
                  {{ ac.name }}
                </option>
              </select>
            </div>

            <div class="input-group">
              <label>Cruise Altitude</label>
              <div class="number-input">
                <input 
                  v-model.number="altitude"
                  type="number"
                  step="1000"
                  min="0"
                  max="45000"
                />
                <span class="unit">ft</span>
              </div>
            </div>
          </div>

          <div class="detail-row">
            <div class="input-group">
              <label>Route Type</label>
              <div class="radio-group">
                <label class="radio-label">
                  <input 
                    type="radio" 
                    v-model="routeType" 
                    value="direct"
                  />
                  Direct
                </label>
                <label class="radio-label">
                  <input 
                    type="radio" 
                    v-model="routeType" 
                    value="airways"
                  />
                  Airways
                </label>
              </div>
            </div>

            <div class="input-group">
              <label>Departure Time</label>
              <input 
                type="datetime-local"
                v-model="departureTime"
                class="time-input"
              />
            </div>
          </div>

          <div class="route-info" v-if="routeCalculated">
            <div class="info-item">
              <i class="fas fa-route"></i>
              <span>Distance: {{ distance }} nm</span>
            </div>
            <div class="info-item">
              <i class="fas fa-clock"></i>
              <span>Est. Time: {{ estimatedTime }}</span>
            </div>
            <div class="info-item">
              <i class="fas fa-gas-pump"></i>
              <span>Fuel Required: {{ fuelRequired }} lbs</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Container -->
      <div class="map-container">
        <div class="map-controls">
          <button 
            v-for="layer in mapLayers"
            :key="layer.id"
            @click="toggleLayer(layer.id)"
            class="layer-btn"
            :class="{ active: layer.active }"
          >
            <i :class="layer.icon"></i>
            {{ layer.name }}
          </button>
        </div>
        <div ref="mapElement" class="map"></div>
      </div>
    </div>

    <!-- Weather Brief -->
    <div class="weather-brief" v-if="weatherData">
      <div class="weather-header">
        <h3>Weather Brief</h3>
        <button @click="refreshWeather" class="btn-refresh">
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>

      <div class="weather-grid">
        <div class="weather-card departure">
          <h4>Departure ({{ departure }})</h4>
          <div class="weather-info">
            <div class="metar">{{ weatherData.departure.metar }}</div>
            <div class="conditions">
              <div class="condition-item">
                <i class="fas fa-temperature-high"></i>
                <span>{{ weatherData.departure.temp }}°C</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-wind"></i>
                <span>{{ weatherData.departure.wind }}</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-cloud"></i>
                <span>{{ weatherData.departure.clouds }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="weather-card enroute">
          <h4>Enroute</h4>
          <div class="weather-info">
            <div class="sigmet" v-if="weatherData.enroute.sigmets.length">
              <h5>SIGMETs</h5>
              <ul>
                <li 
                  v-for="(sigmet, index) in weatherData.enroute.sigmets"
                  :key="index"
                >
                  {{ sigmet }}
                </li>
              </ul>
            </div>
            <div class="winds">
              <h5>Winds Aloft</h5>
              <div class="wind-levels">
                <div 
                  v-for="(wind, level) in weatherData.enroute.winds"
                  :key="level"
                  class="wind-item"
                >
                  <span class="level">FL{{ level }}</span>
                  <span class="direction">{{ wind.direction }}°</span>
                  <span class="speed">{{ wind.speed }}kt</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="weather-card arrival">
          <h4>Arrival ({{ arrival }})</h4>
          <div class="weather-info">
            <div class="metar">{{ weatherData.arrival.metar }}</div>
            <div class="conditions">
              <div class="condition-item">
                <i class="fas fa-temperature-high"></i>
                <span>{{ weatherData.arrival.temp }}°C</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-wind"></i>
                <span>{{ weatherData.arrival.wind }}</span>
              </div>
              <div class="condition-item">
                <i class="fas fa-cloud"></i>
                <span>{{ weatherData.arrival.clouds }}</span>
              </div>
            </div>
            <div class="forecast">
              <h5>TAF</h5>
              <div class="taf-text">{{ weatherData.arrival.taf }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'
import mapboxgl from 'mapbox-gl'

const toast = useToast()

// Form inputs
const departure = ref('')
const arrival = ref('')
const aircraft = ref('')
const altitude = ref(35000)
const routeType = ref('airways')
const departureTime = ref('')

// Search results
const showDepartureResults = ref(false)
const showArrivalResults = ref(false)
const departureResults = ref([])
const arrivalResults = ref([])

// Map
const mapElement = ref(null)
const map = ref(null)
const mapLayers = ref([
  { id: 'terrain', name: 'Terrain', icon: 'fas fa-mountain', active: true },
  { id: 'airways', name: 'Airways', icon: 'fas fa-route', active: true },
  { id: 'weather', name: 'Weather', icon: 'fas fa-cloud', active: true }
])

// Route info
const routeCalculated = ref(false)
const distance = ref(0)
const estimatedTime = ref('00:00')
const fuelRequired = ref(0)

// Weather data (mock)
const weatherData = ref({
  departure: {
    metar: 'KLAX 241853Z 25012KT 10SM FEW035 SCT250 22/14 A2993',
    temp: 22,
    wind: '250° 12kt',
    clouds: 'FEW035'
  },
  enroute: {
    sigmets: ['CONVECTIVE SIGMET 25E'],
    winds: {
      '340': { direction: 270, speed: 55 },
      '360': { direction: 275, speed: 65 },
      '380': { direction: 280, speed: 70 }
    }
  },
  arrival: {
    metar: 'KSFO 241853Z 28015KT 8SM FEW020 19/12 A2992',
    temp: 19,
    wind: '280° 15kt',
    clouds: 'FEW020',
    taf: 'KSFO 241720Z 2418/2524 28015KT P6SM FEW020'
  }
})

// Aircraft list (mock)
const aircraftList = [
  { id: 'B738', name: 'Boeing 737-800' },
  { id: 'A320', name: 'Airbus A320' },
  { id: 'E175', name: 'Embraer E175' }
]

// Computed
const isValid = computed(() => {
  return departure.value && arrival.value && aircraft.value && departureTime.value
})

// Methods
function searchAirports(type) {
  // Implement airport search
  if (type === 'departure') {
    showDepartureResults.value = departure.value.length >= 2
    // Mock results
    departureResults.value = [
      { icao: 'KLAX', name: 'Los Angeles Intl' },
      { icao: 'KLAS', name: 'Las Vegas Intl' }
    ]
  } else {
    showArrivalResults.value = arrival.value.length >= 2
    // Mock results
    arrivalResults.value = [
      { icao: 'KSFO', name: 'San Francisco Intl' },
      { icao: 'KOAK', name: 'Oakland Intl' }
    ]
  }
}

function selectAirport(type, airport) {
  if (type === 'departure') {
    departure.value = airport.icao
    showDepartureResults.value = false
  } else {
    arrival.value = airport.icao
    showArrivalResults.value = false
  }
  calculateRoute()
}

function swapAirports() {
  [departure.value, arrival.value] = [arrival.value, departure.value]
  calculateRoute()
}

function calculateRoute() {
  if (departure.value && arrival.value) {
    // Mock calculation
    routeCalculated.value = true
    distance.value = 337
    estimatedTime.value = '01:15'
    fuelRequired.value = 12500
    updateMapRoute()
  }
}

function updateMapRoute() {
  // Implement map route drawing
}

function toggleLayer(layerId) {
  const layer = mapLayers.value.find(l => l.id === layerId)
  if (layer) {
    layer.active = !layer.active
    // Implement layer toggle
  }
}

function savePlan() {
  toast.success('Flight plan saved successfully!')
}

function clearPlan() {
  departure.value = ''
  arrival.value = ''
  aircraft.value = ''
  altitude.value = 35000
  routeType.value = 'airways'
  departureTime.value = ''
  routeCalculated.value = false
}

function refreshWeather() {
  toast.info('Refreshing weather data...')
  // Implement weather refresh
}

// Lifecycle
onMounted(() => {
  // Initialize map
  mapboxgl.accessToken = 'your-mapbox-token'
  map.value = new mapboxgl.Map({
    container: mapElement.value,
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    center: [-98.5795, 39.8283],
    zoom: 3
  })
})

// Watchers
watch([departure, arrival], () => {
  if (departure.value && arrival.value) {
    calculateRoute()
  }
})
</script>

<style lang="scss" scoped>
.flight-planning {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.planning-container {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: 2rem;
  height: 600px;
}

.plan-form {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h2 {
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.form-actions {
  display: flex;
  gap: 0.5rem;
}

.route-inputs {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.input-group {
  flex: 1;
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
}

.airport-input {
  position: relative;
  
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

.airport-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  margin-top: 0.5rem;
  z-index: 10;
}

.airport-item {
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
  }
  
  .airport-code {
    font-weight: 500;
    margin-right: 0.5rem;
  }
  
  .airport-name {
    color: var(--text-secondary);
  }
}

.btn-swap {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-light);
    color: white;
    transform: rotate(180deg);
  }
}

.flight-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
}

.number-input {
  position: relative;
  
  input {
    width: 100%;
    padding: 0.75rem;
    padding-right: 3rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
  }
  
  .unit {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-secondary);
  }
}

.radio-group {
  display: flex;
  gap: 1rem;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input[type="radio"] {
    accent-color: var(--primary);
  }
}

.time-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.route-info {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  
  i {
    color: var(--primary);
  }
}

.map-container {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.map {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 1;
  display: flex;
  gap: 0.5rem;
}

.layer-btn {
  padding: 0.5rem 1rem;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
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

.weather-brief {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }
}

.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.weather-card {
  background: var(--bg-secondary);
  padding: 1.5rem;
  border-radius: var(--radius-md);
  
  h4 {
    font-weight: 600;
    margin-bottom: 1rem;
  }
}

.metar {
  font-family: monospace;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  margin-bottom: 1rem;
}

.conditions {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-secondary);
  
  i {
    color: var(--primary);
  }
}

.winds {
  h5 {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
}

.wind-levels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.5rem;
}

.wind-item {
  display: flex;
  flex-direction: column;
  padding: 0.5rem;
  background: var(--bg-primary);
  border-radius: var(--radius-sm);
  
  .level {
    font-weight: 500;
  }
  
  .direction,
  .speed {
    color: var(--text-secondary);
    font-size: 0.875rem;
  }
}

.forecast {
  margin-top: 1rem;
  
  h5 {
    font-weight: 500;
    margin-bottom: 0.5rem;
  }
  
  .taf-text {
    font-family: monospace;
    padding: 0.75rem;
    background: var(--bg-primary);
    border-radius: var(--radius-sm);
    font-size: 0.875rem;
    line-height: 1.5;
  }
}

@media (max-width: 1024px) {
  .planning-container {
    grid-template-columns: 1fr;
    height: auto;
  }
  
  .plan-form {
    height: auto;
  }
  
  .map-container {
    height: 400px;
  }
}

@media (max-width: 640px) {
  .route-inputs {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  
  .btn-swap {
    align-self: center;
    transform: rotate(90deg);
    
    &:hover {
      transform: rotate(270deg);
    }
  }
  
  .detail-row {
    grid-template-columns: 1fr;
  }
  
  .route-info {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style> 