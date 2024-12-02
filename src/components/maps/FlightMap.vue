<template>
  <div class="relative w-full h-full">
    <div ref="mapContainer" class="w-full h-full" />
    
    <div v-if="routeInfo" class="absolute bottom-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <div class="space-y-2">
        <p>Distance: {{ formatDistance(routeInfo.distance) }}</p>
        <p>Duration: {{ formatDuration(routeInfo.duration) }}</p>
        <p>Heading: {{ formatHeading(routeInfo.heading) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { Map } from 'maplibre-gl'
import { useSettingsStore } from '@/stores/settings'
import { useToastStore } from '@/stores/toast'
import { formatDistance, formatDuration, formatHeading } from '@/utils/formatters'
import { loadTerrainLayer, loadAirportsLayer, loadAirspaceLayer, loadWeatherLayer } from '@/utils/mapLayers'

interface RouteInfo {
  distance: number
  duration: number
  heading: number
}

const props = defineProps<{
  initialCenter?: [number, number]
  initialZoom?: number
  route?: any // Replace with proper route type
}>()

const mapContainer = ref<HTMLDivElement | null>(null)
const map = ref<Map | null>(null)
const routeInfo = ref<RouteInfo>({
  distance: 0,
  duration: 0,
  heading: 0
})

const settings = useSettingsStore()
const toast = useToastStore()

const updateRouteInfo = (route: any) => { // Replace with proper route type
  if (!route) return
  routeInfo.value = {
    distance: route.distance,
    duration: route.duration,
    heading: route.heading
  }
}

const initializeMap = () => {
  if (!mapContainer.value) return

  try {
    map.value = new Map({
      container: mapContainer.value,
      style: settings.settings.map.style,
      center: props.initialCenter || [0, 0],
      zoom: props.initialZoom || 1
    })

    map.value.on('load', () => {
      if (!map.value) return

      loadTerrainLayer(map.value)
      loadAirportsLayer(map.value)
      loadAirspaceLayer(map.value)
      loadWeatherLayer(map.value)
    })

  } catch (error) {
    toast.show('Failed to initialize map', 'error')
  }
}

onMounted(() => {
  initializeMap()
})

watch(() => props.route, updateRouteInfo, { immediate: true })
</script> 