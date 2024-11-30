<template>
    <div class="weather-page">
      <!-- Search Header -->
      <div class="weather-header">
        <div class="header-content">
          <h1>Weather Information</h1>
          <div class="search-box">
            <input 
              type="text" 
              v-model="searchQuery"
              @keyup.enter="searchAirport"
              placeholder="Enter ICAO code (e.g., KJFK)"
              maxlength="4"
              :class="{ 'error': searchError }"
            >
            <button 
              class="search-btn"
              @click="searchAirport"
              :disabled="searchQuery.length !== 4"
            >
              <i class="fas fa-search"></i>
            </button>
          </div>
          <div class="recent-searches">
            <button 
              v-for="airport in recentSearches" 
              :key="airport"
              @click="quickSearch(airport)"
              class="recent-chip"
            >
              {{ airport }}
            </button>
          </div>
        </div>
      </div>
  
      <!-- Main Content -->
      <div v-if="currentWeather" class="weather-content">
        <!-- View Toggle -->
        <div class="view-toggle">
          <button 
            :class="['toggle-btn', { active: viewMode === 'simple' }]"
            @click="viewMode = 'simple'"
          >
            Simple View
          </button>
          <button 
            :class="['toggle-btn', { active: viewMode === 'professional' }]"
            @click="viewMode = 'professional'"
          >
            Professional View
          </button>
        </div>
  
        <!-- Airport Info -->
        <div class="airport-info">
          <div class="airport-header">
            <h2>{{ currentWeather.station.icao }}</h2>
            <span class="airport-name">{{ currentWeather.station.name }}</span>
            <span class="coordinates">
              {{ formatCoordinates(currentWeather.station.latitude, currentWeather.station.longitude) }}
            </span>
          </div>
          <div class="flight-category" :class="currentWeather.metar.flight_rules.toLowerCase()">
            {{ currentWeather.metar.flight_rules }}
          </div>
        </div>
  
        <!-- Current Conditions -->
        <div class="conditions-grid">
          <div class="condition-card">
            <div class="card-header">
              <h3>Temperature</h3>
              <i class="fas fa-temperature-high"></i>
            </div>
            <div class="card-value">{{ currentWeather.metar.temp.celsius }}°C</div>
          </div>
  
          <div class="condition-card">
            <div class="card-header">
              <h3>Wind</h3>
              <i class="fas fa-wind"></i>
            </div>
            <div class="card-value">
              {{ formatWind(currentWeather.metar.wind) }}
            </div>
          </div>
  
          <div class="condition-card">
            <div class="card-header">
              <h3>Visibility</h3>
              <i class="fas fa-eye"></i>
            </div>
            <div class="card-value">
              {{ formatVisibility(currentWeather.metar.visibility.meters) }}
            </div>
          </div>
  
          <div class="condition-card">
            <div class="card-header">
              <h3>Pressure</h3>
              <i class="fas fa-tachometer-alt"></i>
            </div>
            <div class="card-value">
              {{ Math.round(currentWeather.metar.barometer.hpa) }} hPa
            </div>
          </div>
        </div>
  
        <!-- Professional View Content -->
        <div v-if="viewMode === 'professional'" class="professional-content">
          <!-- METAR/TAF Section -->
          <div class="weather-card">
            <div class="card-header">
              <h3>METAR / TAF</h3>
              <div class="card-actions">
                <button 
                  class="action-btn"
                  @click="toggleDecoded"
                >
                  {{ isDecoded ? 'Raw' : 'Decoded' }}
                </button>
                <button 
                  class="action-btn"
                  @click="copyWeather"
                >
                  <i class="fas fa-copy"></i>
                </button>
              </div>
            </div>
  
            <div class="weather-data">
              <div class="metar-section">
                <h4>METAR</h4>
                <pre v-if="!isDecoded">{{ currentWeather.metar.raw }}</pre>
                <div v-else class="decoded">
                  {{ currentWeather.metar.summary }}
                </div>
                <span class="time-stamp">
                  {{ formatTime(currentWeather.metar.observed) }}
                </span>
              </div>
  
              <div class="taf-section">
                <h4>TAF</h4>
                <pre v-if="!isDecoded">{{ currentWeather.taf.raw }}</pre>
                <div v-else class="decoded">
                  {{ currentWeather.taf.summary }}
                </div>
                <span class="time-stamp">
                  Valid: {{ formatTime(currentWeather.taf.valid_from) }} 
                  to {{ formatTime(currentWeather.taf.valid_to) }}
                </span>
              </div>
            </div>
          </div>
  
          <!-- Clouds Section -->
          <div class="weather-card">
            <h3>Cloud Layers</h3>
            <div class="cloud-layers">
              <div 
                v-for="(cloud, index) in currentWeather.metar.clouds"
                :key="index"
                class="cloud-layer"
                :style="{ bottom: `${(cloud.height * 100 / 5000) * 100}%` }"
              >
                <span class="cloud-type">{{ cloud.code }}</span>
                <span class="cloud-height">{{ cloud.height }}00ft</span>
              </div>
            </div>
          </div>
  
          <!-- Nearby Stations -->
          <div class="weather-card">
            <h3>Nearby Stations</h3>
            <div class="nearby-list">
              <div 
                v-for="station in nearbyStations"
                :key="station.icao"
                class="nearby-station"
                @click="quickSearch(station.icao)"
              >
                <div class="station-info">
                  <span class="station-icao">{{ station.icao }}</span>
                  <span class="station-name">{{ station.name }}</span>
                </div>
                <span class="station-distance">{{ station.distance }}nm</span>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Weather Trends -->
        <div v-if="weatherHistory.length" class="weather-card full-width">
          <div class="card-header">
            <h3>Weather Trends</h3>
            <div class="trend-controls">
              <button 
                v-for="type in trendTypes"
                :key="type.id"
                :class="['trend-btn', { active: selectedTrend === type.id }]"
                @click="selectedTrend = type.id"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
          <div class="trend-chart">
            <Line 
              :data="chartData"
              :options="chartOptions"
            />
          </div>
        </div>
      </div>
  
      <!-- Empty State -->
      <div v-else-if="!isLoading" class="empty-state">
        <i class="fas fa-cloud-sun"></i>
        <h2>Enter an Airport Code</h2>
        <p>Search by ICAO code to view detailed weather information</p>
      </div>
  
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-overlay">
        <div class="loader"></div>
        <span>Loading weather data...</span>
      </div>
  
      <!-- Error Toast -->
      <div 
        v-if="errorMessage"
        class="error-toast"
        @click="errorMessage = ''"
      >
        <i class="fas fa-exclamation-circle"></i>
        {{ errorMessage }}
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { Line } from 'vue-chartjs'
  import { weatherService } from '@/services/weatherService'
  import { useLocalStorage } from '@/composables/useLocalStorage'
  
  // State
  const searchQuery = ref('')
  const searchError = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const currentWeather = ref(null)
  const nearbyStations = ref([])
  const weatherHistory = ref([])
  const viewMode = ref('simple')
  const isDecoded = ref(false)
  const selectedTrend = ref('temperature')
  
  // Local Storage
  const { getValue, setValue } = useLocalStorage()
  const recentSearches = ref(getValue('recentSearches', []))
  
  // Chart Configuration
  const trendTypes = [
    { id: 'temperature', label: 'Temperature' },
    { id: 'windSpeed', label: 'Wind Speed' },
    { id: 'pressure', label: 'Pressure' },
    { id: 'visibility', label: 'Visibility' }
  ]
  
  const chartData = computed(() => ({
    labels: weatherHistory.value.map(entry => 
      new Date(entry.timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    ),
    datasets: [{
      label: trendTypes.find(t => t.id === selectedTrend.value).label,
      data: weatherHistory.value.map(entry => entry[selectedTrend.value]),
      borderColor: '#3b82f6',
      tension: 0.4
    }]
  }))
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        beginAtZero: false,
        grid: { color: 'rgba(0, 0, 0, 0.05)' }
      },
      x: {
        grid: { display: false }
      }
    }
  }
  
  // Methods
  async function searchAirport() {
    if (searchQuery.value.length !== 4) {
      searchError.value = true
      return
    }
  
    isLoading.value = true
    errorMessage.value = ''
    searchError.value = false
  
    try {
      const icao = searchQuery.value.toUpperCase()
      
      const [metar, taf, station] = await Promise.all([
        weatherService.getMetar(icao),
        weatherService.getTaf(icao),
        weatherService.getStationInfo(icao)
      ])
  
      if (!metar || !station) {
        throw new Error('Airport not found')
      }
  
      currentWeather.value = { metar, taf, station }
  
      // Get nearby stations
      const nearby = await weatherService.getNearbyStations(
        station.latitude,
        station.longitude
      )
      nearbyStations.value = nearby.filter(s => s.icao !== icao)
  
      // Get weather history
      const history = await weatherService.getWeatherHistory(
        station.latitude,
        station.longitude
      )
      weatherHistory.value = history
  
      // Update recent searches
      updateRecentSearches(icao)
  
    } catch (error) {
      errorMessage.value = error.message || 'Error fetching weather data'
      currentWeather.value = null
    } finally {
      isLoading.value = false
    }
  }
  
  function quickSearch(icao) {
    searchQuery.value = icao
    searchAirport()
  }
  
  function updateRecentSearches(icao) {
    const updated = [icao, ...recentSearches.value.filter(a => a !== icao)].slice(0, 5)
    recentSearches.value = updated
    setValue('recentSearches', updated)
  }
  
  function formatCoordinates(lat, lon) {
    return `${Math.abs(lat)}°${lat >= 0 ? 'N' : 'S'} ${Math.abs(lon)}°${lon >= 0 ? 'E' : 'W'}`
  }
  
  function formatWind(wind) {
    if (wind.direction === 0 && wind.speed === 0) return 'Calm'
    return `${wind.direction.toString().padStart(3, '0')}° ${wind.speed}kt${wind.gust ? ` G${wind.gust}` : ''}`
  }
  
  function formatVisibility(meters) {
    const km = meters / 1000
    return km >= 10 ? '10+ km' : `${km.toFixed(1)} km`
  }
  
  function formatTime(timestamp) {
    return new Date(timestamp).toLocaleString([], {
      hour: '2-digit',
      minute: '2-digit',
      day: '2-digit',
      month: 'short'
    })
  }
  
  async function copyWeather() {
    const text = isDecoded.value
      ? `${currentWeather.value.metar.summary}\n\n${currentWeather.value.taf.summary}`
      : `${currentWeather.value.metar.raw}\n\n${currentWeather.value.taf.raw}`
    
    try {
      await navigator.clipboard.writeText(text)
      // Show success toast (implement as needed)
    } catch (error) {
      errorMessage.value = 'Failed to copy weather data'
    }
  }
  
  // Lifecycle
  onMounted(() => {
    if (recentSearches.value.length > 0) {
      searchQuery.value = recentSearches.value[0]
      searchAirport()
    }
  })
  </script>
  
  <style scoped>
  .weather-page {
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .weather-header {
    background: white;
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    box-shadow: var(--shadow-sm);
  }

  .header-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .header-content h1 {
    font-size: 24px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .search-box {
    display: flex;
    gap: 8px;
    max-width: 400px;
  }

  .search-box input {
    flex: 1;
    padding: 12px 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    font-size: 16px;
    text-transform: uppercase;
  }

  .search-box input.error {
    border-color: #ef4444;
  }

  .search-btn {
    padding: 0 20px;
    background: var(--primary);
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .search-btn:hover {
    background: var(--primary-dark);
  }

  .search-btn:disabled {
    background: var(--border-color);
    cursor: not-allowed;
  }

  .recent-searches {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .recent-chip {
    padding: 6px 12px;
    background: #f1f5f9;
    border: none;
    border-radius: 100px;
    font-size: 14px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .recent-chip:hover {
    background: #e2e8f0;
  }

  .weather-content {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .view-toggle {
    display: flex;
    gap: 8px;
    padding: 4px;
    background: #f1f5f9;
    border-radius: 8px;
    width: fit-content;
  }

  .toggle-btn {
    padding: 8px 16px;
    border: none;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .toggle-btn.active {
    background: white;
    box-shadow: var(--shadow-sm);
  }

  .airport-info {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
  }

  .airport-header h2 {
    font-size: 32px;
    font-weight: 600;
  }

  .airport-name {
    display: block;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .coordinates {
    display: block;
    font-size: 14px;
    color: var(--text-secondary);
    margin-top: 4px;
  }

  .flight-category {
    padding: 8px 16px;
    border-radius: 100px;
    font-weight: 500;
    text-align: center;
  }

  .flight-category.vfr {
    background: #dcfce7;
    color: #166534;
  }

  .flight-category.mvfr {
    background: #dbeafe;
    color: #1e40af;
  }

  .flight-category.ifr {
    background: #fee2e2;
    color: #991b1b;
  }

  .flight-category.lifr {
    background: #fae8ff;
    color: #86198f;
  }

  .conditions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
  }

  .condition-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .card-header h3 {
    font-size: 16px;
    color: var(--text-secondary);
  }

  .card-header i {
    color: var(--primary);
    font-size: 20px;
  }

  .card-value {
    font-size: 24px;
    font-weight: 600;
  }

  .weather-card {
    background: white;
    padding: 24px;
    border-radius: 12px;
    box-shadow: var(--shadow-sm);
  }

  .weather-card.full-width {
    grid-column: 1 / -1;
  }

  .card-actions {
    display: flex;
    gap: 8px;
  }

  .action-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .action-btn:hover {
    background: #f8fafc;
  }

  .weather-data {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .metar-section,
  .taf-section {
    background: #f8fafc;
    padding: 16px;
    border-radius: 8px;
  }

  pre {
    font-family: monospace;
    white-space: pre-wrap;
    margin: 8px 0;
    font-size: 14px;
  }

  .decoded {
    line-height: 1.6;
    margin: 8px 0;
  }

  .time-stamp {
    display: block;
    font-size: 12px;
    color: var(--text-secondary);
    margin-top: 8px;
  }

  .cloud-layers {
    height: 300px;
    position: relative;
    background: linear-gradient(to top, #f8fafc, #dbeafe);
    border-radius: 8px;
    margin-top: 16px;
  }

  .cloud-layer {
    position: absolute;
    left: 0;
    right: 0;
    height: 40px;
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 16px;
    border-radius: 4px;
  }

  .cloud-type {
    font-weight: 500;
  }

  .cloud-height {
    color: var(--text-secondary);
  }

  .nearby-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 16px;
  }

  .nearby-station {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.2s;
  }

  .nearby-station:hover {
    background: #f1f5f9;
  }

  .station-info {
    display: flex;
    flex-direction: column;
  }

  .station-icao {
    font-weight: 500;
  }

  .station-name {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .station-distance {
    color: var(--text-secondary);
  }

  .trend-controls {
    display: flex;
    gap: 8px;
  }

  .trend-btn {
    padding: 6px 12px;
    border: 1px solid var(--border-color);
    border-radius: 6px;
    background: white;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
  }

  .trend-btn.active {
    background: var(--primary);
    color: white;
    border-color: var(--primary);
  }

  .trend-chart {
    height: 300px;
    margin-top: 20px;
  }

  .empty-state {
    text-align: center;
    padding: 48px;
    color: var(--text-secondary);
  }

  .empty-state i {
    font-size: 48px;
    margin-bottom: 16px;
    color: var(--primary);
  }

  .loading-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255, 255, 255, 0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    z-index: 1000;
  }

  .loader {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-toast {
    position: fixed;
    bottom: 24px;
    right: 24px;
    background: #fee2e2;
    color: #991b1b;
    padding: 12px 24px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    animation: slideIn 0.3s ease-out;
    z-index: 1000;
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to { transform: translateX(0); }
  }

  @media (max-width: 768px) {
    .weather-page {
      padding: 16px;
    }

    .conditions-grid {
      grid-template-columns: 1fr;
    }

    .weather-data {
      gap: 16px;
    }

    .card-value {
      font-size: 20px;
    }

    .cloud-layers {
      height: 200px;
    }

    .trend-chart {
      height: 200px;
    }
  }
  </style>