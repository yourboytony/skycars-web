<template>
  <div class="weather-layer-controls" v-if="visible">
    <div class="layer-options">
      <button 
        v-for="option in weatherOptions"
        :key="option.id"
        @click="setWeatherType(option.id)"
        class="option-btn"
        :class="{ active: currentType === option.id }"
      >
        <i :class="option.icon"></i>
        <span>{{ option.label }}</span>
      </button>
    </div>
    
    <div class="opacity-control">
      <span>Opacity</span>
      <input 
        type="range" 
        v-model="opacity" 
        min="0" 
        max="1" 
        step="0.1"
        @input="updateOpacity"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import { useWeatherStore } from '@/stores/weather'

const props = defineProps<{
  map: maplibregl.Map
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const weatherStore = useWeatherStore()
const currentType = ref('radar')
const opacity = ref(0.7)

const weatherOptions = [
  { id: 'radar', label: 'Radar', icon: 'fas fa-satellite-dish' },
  { id: 'clouds', label: 'Clouds', icon: 'fas fa-cloud' },
  { id: 'temp', label: 'Temperature', icon: 'fas fa-temperature-high' },
  { id: 'wind', label: 'Wind', icon: 'fas fa-wind' }
]

// Layer management
async function addWeatherLayer(type: string) {
  try {
    // Remove existing weather layers
    removeWeatherLayers()

    // Add new weather layer based on type
    switch (type) {
      case 'radar':
        await addRadarLayer()
        break
      case 'clouds':
        await addCloudsLayer()
        break
      case 'temp':
        await addTemperatureLayer()
        break
      case 'wind':
        await addWindLayer()
        break
    }

    updateOpacity()
  } catch (error) {
    console.error('Error adding weather layer:', error)
  }
}

function removeWeatherLayers() {
  const layers = ['weather-radar', 'weather-clouds', 'weather-temp', 'weather-wind']
  
  layers.forEach(layer => {
    if (props.map.getLayer(layer)) {
      props.map.removeLayer(layer)
    }
    if (props.map.getSource(layer)) {
      props.map.removeSource(layer)
    }
  })
}

// Specific layer implementations
async function addRadarLayer() {
  const data = await weatherStore.fetchRadarData()
  
  props.map.addSource('weather-radar', {
    type: 'raster',
    tiles: [data.tileUrl],
    tileSize: 256
  })

  props.map.addLayer({
    id: 'weather-radar',
    type: 'raster',
    source: 'weather-radar',
    paint: {
      'raster-opacity': opacity.value
    }
  })
}

async function addCloudsLayer() {
  const data = await weatherStore.fetchCloudsData()
  
  props.map.addSource('weather-clouds', {
    type: 'raster',
    tiles: [data.tileUrl],
    tileSize: 256
  })

  props.map.addLayer({
    id: 'weather-clouds',
    type: 'raster',
    source: 'weather-clouds',
    paint: {
      'raster-opacity': opacity.value
    }
  })
}

async function addTemperatureLayer() {
  const data = await weatherStore.fetchTemperatureData()
  
  props.map.addSource('weather-temp', {
    type: 'geojson',
    data: data.features
  })

  props.map.addLayer({
    id: 'weather-temp',
    type: 'fill',
    source: 'weather-temp',
    paint: {
      'fill-color': [
        'interpolate',
        ['linear'],
        ['get', 'temperature'],
        -20, '#9CA3AF',
        0, '#93C5FD',
        10, '#60A5FA',
        20, '#34D399',
        30, '#F59E0B',
        40, '#EF4444'
      ],
      'fill-opacity': opacity.value
    }
  })
}

async function addWindLayer() {
  const data = await weatherStore.fetchWindData()
  
  props.map.addSource('weather-wind', {
    type: 'geojson',
    data: data.features
  })

  props.map.addLayer({
    id: 'weather-wind',
    type: 'symbol',
    source: 'weather-wind',
    layout: {
      'icon-image': ['get', 'icon'],
      'icon-size': 0.5,
      'icon-rotate': ['get', 'direction'],
      'icon-allow-overlap': true
    },
    paint: {
      'icon-opacity': opacity.value
    }
  })
}

// Event handlers
function setWeatherType(type: string) {
  currentType.value = type
  addWeatherLayer(type)
}

function updateOpacity() {
  const layer = `weather-${currentType.value}`
  if (props.map.getLayer(layer)) {
    if (layer === 'weather-wind') {
      props.map.setPaintProperty(layer, 'icon-opacity', opacity.value)
    } else if (layer === 'weather-temp') {
      props.map.setPaintProperty(layer, 'fill-opacity', opacity.value)
    } else {
      props.map.setPaintProperty(layer, 'raster-opacity', opacity.value)
    }
  }
}

// Visibility handling
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    addWeatherLayer(currentType.value)
  } else {
    removeWeatherLayers()
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.visible) {
    addWeatherLayer(currentType.value)
  }
})

onUnmounted(() => {
  removeWeatherLayers()
})
</script>

<style lang="scss" scoped>
.weather-layer-controls {
  position: absolute;
  top: 5rem;
  right: 1rem;
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 1;
}

.layer-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.option-btn {
  padding: 0.5rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    background: var(--bg-hover);
    color: var(--text-primary);
  }
  
  &.active {
    background: var(--primary);
    color: white;
  }
  
  i {
    width: 1rem;
    text-align: center;
  }
}

.opacity-control {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  span {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  input[type="range"] {
    width: 100%;
    
    &::-webkit-slider-thumb {
      background: var(--primary);
    }
    
    &::-moz-range-thumb {
      background: var(--primary);
    }
  }
}

@media (max-width: 640px) {
  .weather-layer-controls {
    right: auto;
    left: 1rem;
    width: calc(100% - 2rem);
  }
  
  .layer-options {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .option-btn span {
    display: none;
  }
}
</style> 