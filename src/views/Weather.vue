<template>
  <div class="weather-view">
    <h1>Aviation Weather</h1>
    
    <div class="weather-search">
      <input 
        v-model="searchQuery" 
        type="text" 
        placeholder="Enter ICAO code (e.g., KJFK)"
        @keyup.enter="fetchWeather"
      >
      <button @click="fetchWeather" class="btn-search">Search</button>
    </div>

    <div class="weather-container">
      <div class="weather-card metar" v-if="metar">
        <h2>METAR</h2>
        <pre>{{ metar.raw }}</pre>
        <div class="decoded-info">
          <div class="info-item">
            <span>Temperature:</span>
            <span>{{ metar.temp }}°C</span>
          </div>
          <div class="info-item">
            <span>Wind:</span>
            <span>{{ metar.wind }}</span>
          </div>
          <div class="info-item">
            <span>Visibility:</span>
            <span>{{ metar.visibility }}</span>
          </div>
        </div>
      </div>

      <div class="weather-card taf" v-if="taf">
        <h2>TAF</h2>
        <pre>{{ taf.raw }}</pre>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Weather',
  data() {
    return {
      searchQuery: '',
      metar: null,
      taf: null
    }
  },
  methods: {
    async fetchWeather() {
      // Implement CheckWX API integration
      // Using API key: 769330e7548b49dda87c211300
    }
  }
}
</script>

<style scoped>
.weather-view {
  padding: 2rem;
}

.weather-search {
  display: flex;
  gap: 1rem;
  margin: 2rem 0;
}

.weather-search input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  font-size: 1rem;
}

.btn-search {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.weather-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.weather-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.weather-card h2 {
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.weather-card pre {
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
  white-space: pre-wrap;
  margin-bottom: 1rem;
}

.decoded-info {
  border-top: 1px solid #e5e7eb;
  padding-top: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f3f4f6;
}
</style> 