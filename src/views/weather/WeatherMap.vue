<template>
  <div class="weather-map">
    <div class="map-header">
      <h1>Weather Map</h1>
      <div class="map-controls">
        <select v-model="selectedLayer" class="layer-select">
          <option value="temperature">Temperature</option>
          <option value="precipitation">Precipitation</option>
          <option value="clouds">Cloud Cover</option>
          <option value="wind">Wind Speed</option>
        </select>
        <button @click="refreshMap" class="btn-refresh">
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>
    </div>

    <div class="map-container" ref="mapContainer">
      <!-- Map will be mounted here -->
      <div v-if="isLoading" class="map-loading">
        <i class="fas fa-spinner fa-spin"></i>
        Loading weather data...
      </div>
    </div>

    <div class="map-legend">
      <div class="legend-item" v-for="(item, index) in legendItems" :key="index">
        <div class="legend-color" :style="{ background: item.color }"></div>
        <span>{{ item.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useToast } from '@/composables/useToast'

const mapContainer = ref(null)
const selectedLayer = ref('temperature')
const isLoading = ref(true)
const toast = useToast()

// Simulated legend items (update based on selected layer)
const legendItems = ref([
  { color: '#0000FF', label: 'Cold' },
  { color: '#00FF00', label: 'Mild' },
  { color: '#FF0000', label: 'Hot' }
])

// Initialize map (you'll need to implement this with your preferred map library)
function initMap() {
  isLoading.value = true
  try {
    // Initialize your map here
    // Example: new google.maps.Map(mapContainer.value, {...})
    toast.success('Weather map loaded successfully')
  } catch (error) {
    toast.error('Failed to load weather map')
    console.error('Map initialization error:', error)
  } finally {
    isLoading.value = false
  }
}

function refreshMap() {
  isLoading.value = true
  try {
    // Refresh map data here
    toast.success('Weather data updated')
  } catch (error) {
    toast.error('Failed to update weather data')
  } finally {
    isLoading.value = false
  }
}

// Watch for layer changes
watch(selectedLayer, (newLayer) => {
  // Update map layer here
  console.log('Layer changed to:', newLayer)
})

onMounted(() => {
  initMap()
})
</script>

<style scoped>
.weather-map {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.map-controls {
  display: flex;
  gap: 16px;
}

.layer-select {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: white;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-refresh:hover {
  opacity: 0.9;
}

.map-container {
  flex: 1;
  position: relative;
  background: #f1f5f9;
  border-radius: 12px;
  overflow: hidden;
  min-height: 500px;
}

.map-loading {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background: rgba(255, 255, 255, 0.9);
}

.map-loading i {
  font-size: 24px;
  color: var(--primary);
}

.map-legend {
  display: flex;
  gap: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .weather-map {
    padding: 16px;
  }

  .map-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .map-controls {
    width: 100%;
  }

  .layer-select {
    flex: 1;
  }

  .map-legend {
    flex-wrap: wrap;
  }
}
</style> 