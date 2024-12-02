<template>
  <div class="map-container" ref="mapContainer">
    <div class="map-wrapper" ref="mapElement"></div>
    
    <!-- Map Controls -->
    <div class="map-controls">
      <div class="control-group">
        <button 
          v-for="layer in mapLayers"
          :key="layer.id"
          @click="toggleLayer(layer.id)"
          class="layer-btn"
          :class="{ active: activeLayerIds.includes(layer.id) }"
          :title="layer.label"
        >
          <i :class="layer.icon"></i>
          <span>{{ layer.label }}</span>
        </button>
      </div>
      
      <div class="zoom-controls">
        <button @click="zoomIn" class="zoom-btn" title="Zoom In">
          <i class="fas fa-plus"></i>
        </button>
        <button @click="zoomOut" class="zoom-btn" title="Zoom Out">
          <i class="fas fa-minus"></i>
        </button>
      </div>
      
      <button @click="centerOnUser" class="location-btn" title="Center on my location">
        <i class="fas fa-location-crosshairs"></i>
      </button>
    </div>

    <!-- Route Info -->
    <div v-if="routeInfo" class="route-info">
      <div class="info-header">
        <h3>Route Details</h3>
        <button @click="clearRoute" class="btn-clear">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="info-content">
        <div class="info-row">
          <span class="label">Distance</span>
          <span class="value">{{ formatDistance(routeInfo.distance) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Duration</span>
          <span class="value">{{ formatDuration(routeInfo.duration) }}</span>
        </div>
        <div class="info-row">
          <span class="label">Heading</span>
          <span class="value">{{ formatHeading(routeInfo.heading) }}</span>
        </div>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="loading-overlay">
      <div class="spinner"></div>
      <span>Loading map data...</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import { useGeolocation } from '@/composables/useGeolocation'
import { useSettingsStore } from '@/stores/settings'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  initialCenter?: [number, number]
  initialZoom?: number
  route?: {
    departure: [number, number]
    arrival: [number, number]
    waypoints?: [number, number][]
  }
}>()

const emit = defineEmits<{
  (e: 'routeUpdate', route: any): void
  (e: 'mapClick', lngLat: [number, number]): void
}>()

const mapContainer = ref<HTMLElement | null>(null)
const mapElement = ref<HTMLElement | null>(null)
const map = ref<maplibregl.Map | null>(null)
const loading = ref(true)
const routeInfo = ref(null)
const activeLayerIds = ref<string[]>(['terrain', 'airports', 'airspace'])

const settings = useSettingsStore()
const { coords, request: requestLocation } = useGeolocation()
const toast = useToast()

// Map layer definitions
const mapLayers = [
  { id: 'terrain', label: 'Terrain', icon: 'fas fa-mountain' },
  { id: 'airports', label: 'Airports', icon: 'fas fa-plane' },
  { id: 'airspace', label: 'Airspace', icon: 'fas fa-layer-group' },
  { id: 'weather', label: 'Weather', icon: 'fas fa-cloud' }
]

// Initialize map
async function initializeMap() {
  if (!mapElement.value) return

  try {
    map.value = new maplibregl.Map({
      container: mapElement.value,
      style: settings.mapSettings.style || 'https://api.maptiler.com/maps/basic/style.json',
      center: props.initialCenter || [0, 0],
      zoom: props.initialZoom || 5,
      attributionControl: false
    })

    // Add controls
    map.value.addControl(new maplibregl.AttributionControl(), 'bottom-right')
    map.value.addControl(new maplibregl.NavigationControl(), 'top-right')

    // Setup event listeners
    map.value.on('load', onMapLoad)
    map.value.on('click', onMapClick)
    map.value.on('moveend', saveMapState)

    // Load saved state
    loadMapState()
  } catch (error) {
    toast.error('Failed to initialize map')
    console.error('Map initialization error:', error)
  }
}

// Map event handlers
async function onMapLoad() {
  loading.value = false
  
  // Add map layers
  await Promise.all([
    loadTerrainLayer(),
    loadAirportsLayer(),
    loadAirspaceLayer(),
    loadWeatherLayer()
  ])

  // Draw route if provided
  if (props.route) {
    drawRoute(props.route)
  }
}

function onMapClick(e: maplibregl.MapMouseEvent) {
  const lngLat: [number, number] = [e.lngLat.lng, e.lngLat.lat]
  emit('mapClick', lngLat)
}

// Layer management
function toggleLayer(layerId: string) {
  if (!map.value) return

  const index = activeLayerIds.value.indexOf(layerId)
  if (index === -1) {
    activeLayerIds.value.push(layerId)
    map.value.setLayoutProperty(layerId, 'visibility', 'visible')
  } else {
    activeLayerIds.value.splice(index, 1)
    map.value.setLayoutProperty(layerId, 'visibility', 'none')
  }
  
  saveMapState()
}

// Route handling
function drawRoute(route: any) {
  if (!map.value) return

  // Clear existing route
  clearRoute()

  // Add route layer
  map.value.addLayer({
    id: 'route',
    type: 'line',
    source: {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            route.departure,
            ...(route.waypoints || []),
            route.arrival
          ]
        }
      }
    },
    paint: {
      'line-color': '#0ea5e9',
      'line-width': 2,
      'line-dasharray': [2, 1]
    }
  })

  // Add markers
  new maplibregl.Marker({ color: '#0ea5e9' })
    .setLngLat(route.departure)
    .addTo(map.value)

  new maplibregl.Marker({ color: '#0ea5e9' })
    .setLngLat(route.arrival)
    .addTo(map.value)

  // Calculate and update route info
  updateRouteInfo(route)
}

// Utility functions
function centerOnUser() {
  if (!coords.value.latitude || !coords.value.longitude) {
    requestLocation()
    return
  }

  map.value?.flyTo({
    center: [coords.value.longitude, coords.value.latitude],
    zoom: 12
  })
}

function zoomIn() {
  map.value?.zoomIn()
}

function zoomOut() {
  map.value?.zoomOut()
}

function clearRoute() {
  if (!map.value) return

  if (map.value.getLayer('route')) {
    map.value.removeLayer('route')
    map.value.removeSource('route')
  }
  
  routeInfo.value = null
}

// State management
function saveMapState() {
  if (!map.value) return

  const center = map.value.getCenter()
  const zoom = map.value.getZoom()
  
  localStorage.setItem('mapState', JSON.stringify({
    center: [center.lng, center.lat],
    zoom,
    activeLayers: activeLayerIds.value
  }))
}

function loadMapState() {
  const savedState = localStorage.getItem('mapState')
  if (savedState) {
    const state = JSON.parse(savedState)
    map.value?.setCenter(state.center)
    map.value?.setZoom(state.zoom)
    activeLayerIds.value = state.activeLayers
  }
}

// Lifecycle hooks
onMounted(() => {
  initializeMap()
})

onUnmounted(() => {
  map.value?.remove()
})

// Watch for route changes
watch(() => props.route, (newRoute) => {
  if (newRoute) {
    drawRoute(newRoute)
  }
})
</script>

<style lang="scss">
@import 'maplibre-gl/dist/maplibre-gl.css';

.map-container {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 400px;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.map-wrapper {
  width: 100%;
  height: 100%;
}

.map-controls {
  position: absolute;
  top: 1rem;
  left: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
}

.control-group {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-primary);
  padding: 0.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.layer-btn,
.zoom-btn,
.location-btn {
  padding: 0.5rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
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
  
  span {
    margin-left: 0.5rem;
  }
}

.zoom-controls {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  background: var(--bg-primary);
  padding: 0.5rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.route-info {
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  min-width: 200px;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  
  h3 {
    font-size: 1rem;
    font-weight: 500;
    margin: 0;
  }
}

.info-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  
  .label {
    color: var(--text-secondary);
  }
  
  .value {
    font-weight: 500;
  }
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(var(--bg-primary-rgb), 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--border-color);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (max-width: 640px) {
  .layer-btn span {
    display: none;
  }
  
  .control-group {
    flex-wrap: wrap;
  }
}
</style> 