<template>
  <div class="weather-briefing">
    <div class="briefing-header">
      <h1>Route Weather Briefing</h1>
      <div class="route-info">
        <span class="airport">{{ route.departure }}</span>
        <i class="fas fa-arrow-right"></i>
        <span class="airport">{{ route.arrival }}</span>
      </div>
    </div>

    <div class="briefing-content">
      <div class="weather-section">
        <h2>Departure Weather</h2>
        <div class="weather-card">
          <div class="metar">{{ departureWeather.metar }}</div>
          <div class="taf">{{ departureWeather.taf }}</div>
        </div>
      </div>

      <div class="weather-section">
        <h2>En-Route Weather</h2>
        <div class="weather-card">
          <!-- En-route weather components -->
        </div>
      </div>

      <div class="weather-section">
        <h2>Arrival Weather</h2>
        <div class="weather-card">
          <div class="metar">{{ arrivalWeather.metar }}</div>
          <div class="taf">{{ arrivalWeather.taf }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const routeInfo = ref({
  departure: 'KJFK',
  arrival: 'KLAX'
})

const departureWeather = ref({
  metar: 'KJFK 241852Z 18009KT 10SM FEW050 23/16 A3001',
  taf: 'KJFK 241730Z 2418/2524 18010KT P6SM FEW050'
})

const arrivalWeather = ref({
  metar: 'KLAX 241852Z 25012KT 10SM FEW020 21/16 A2995',
  taf: 'KLAX 241730Z 2418/2524 25012KT P6SM FEW020'
})

onMounted(async () => {
  // TODO: Fetch weather data using route.params.route
})
</script>

<style scoped>
.weather-briefing {
  padding: 24px;
}

.briefing-header {
  margin-bottom: 24px;
}

.route-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  font-size: 18px;
}

.airport {
  font-weight: 500;
}

.weather-section {
  margin-bottom: 24px;
}

.weather-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.metar, .taf {
  font-family: monospace;
  margin-bottom: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 4px;
}
</style> 