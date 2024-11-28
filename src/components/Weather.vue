<template>
  <div class="weather-widget glass">
    <div class="weather-header">
      <h2>Airport Weather</h2>
      <div class="search-box">
        <input 
          v-model="icao"
          type="text"
          placeholder="Enter ICAO code"
          @keyup.enter="fetchWeather"
          maxlength="4"
          :disabled="weather.loading"
        >
        <button 
          @click="fetchWeather"
          :disabled="!icao || weather.loading"
          class="search-btn"
        >
          <i :class="weather.loading ? 'fas fa-spinner fa-spin' : 'fas fa-search'"></i>
        </button>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="weather.error" class="weather-error">
      <i class="fas fa-exclamation-circle"></i>
      {{ weather.error }}
    </div>

    <!-- Weather Data -->
    <div v-if="weather.metar && !weather.error" class="weather-data">
      <!-- Current Conditions -->
      <div class="current-conditions">
        <div class="station-info">
          <h3>{{ weather.metar.station.name }}</h3>
          <span class="icao">{{ weather.metar.icao }}</span>
        </div>

        <div class="conditions">
          <div class="condition-item">
            <i class="fas fa-thermometer-half"></i>
            <span>{{ weather.metar.temperature?.celsius }}°C</span>
          </div>
          
          <div class="condition-item">
            <i class="fas fa-tint"></i>
            <span>{{ weather.metar.humidity?.percent }}%</span>
          </div>

          <div class="condition-item">
            <i class="fas fa-wind"></i>
            <span>
              {{ weather.metar.wind?.degrees }}° 
              {{ weather.metar.wind?.speed_kts }}kts
            </span>
          </div>

          <div class="condition-item">
            <i class="fas fa-eye"></i>
            <span>{{ weather.metar.visibility?.meters }}m</span>
          </div>
        </div>

        <div class="cloud-layers">
          <template v-if="weather.metar.clouds">
            <div 
              v-for="(cloud, index) in weather.metar.clouds" 
              :key="index"
              class="cloud-layer"
            >
              {{ cloud.text }} at {{ cloud.feet }}ft
            </div>
          </template>
          <div v-else class="cloud-layer">No cloud data available</div>
        </div>
      </div>

      <!-- Raw METAR -->
      <div class="raw-data">
        <h4>Raw METAR</h4>
        <code>{{ weather.metar.raw_text }}</code>
      </div>

      <!-- TAF Data if available -->
      <div v-if="weather.taf" class="forecast">
        <h4>Forecast (TAF)</h4>
        <code>{{ weather.taf.raw_text }}</code>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useWeatherStore } from '../stores/weather'

const weather = useWeatherStore()
const icao = ref('')

async function fetchWeather() {
  if (icao.value.length === 4) {
    await Promise.all([
      weather.fetchMetar(icao.value.toUpperCase()),
      weather.fetchTaf(icao.value.toUpperCase())
    ])
  }
}

// Auto-uppercase ICAO input
watch(icao, (newValue) => {
  icao.value = newValue.toUpperCase()
})
</script>

<style scoped>
.weather-widget {
  padding: 1.5rem;
  margin: 1rem 0;
  border-radius: 1rem;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.weather-header h2 {
  margin: 0;
  color: var(--text-color);
}

.search-box {
  display: flex;
  gap: 0.5rem;
}

.search-box input {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
}

.search-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.5rem;
  background: var(--primary-color);
  color: white;
  cursor: pointer;
  transition: opacity 0.2s;
}

.search-btn:hover:not(:disabled) {
  opacity: 0.9;
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.weather-error {
  padding: 1rem;
  background: rgba(220, 38, 38, 0.1);
  color: var(--error-color);
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.weather-data {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.current-conditions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.station-info {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
}

.station-info h3 {
  margin: 0;
  color: var(--text-color);
}

.icao {
  color: var(--text-light);
  font-size: 0.875rem;
}

.conditions {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.condition-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-color);
}

.condition-item i {
  color: var(--primary-color);
  width: 1.5rem;
}

.cloud-layers {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cloud-layer {
  padding: 0.5rem;
  background: var(--background-secondary);
  border-radius: 0.5rem;
  color: var(--text-color);
}

.raw-data,
.forecast {
  background: var(--background-secondary);
  padding: 1rem;
  border-radius: 0.5rem;
}

.raw-data h4,
.forecast h4 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

code {
  display: block;
  white-space: pre-wrap;
  word-break: break-all;
  color: var(--text-light);
  font-family: monospace;
}

@media (max-width: 768px) {
  .weather-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .search-box {
    flex: 1;
  }

  .search-box input {
    flex: 1;
  }

  .conditions {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }
}
</style> 