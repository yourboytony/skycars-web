<template>
  <!-- Layer is rendered directly on the map -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Map } from 'maplibre-gl'
import { useWeatherStore } from '@/stores/weather'

interface WeatherData {
  tileUrl: string
  features: any[] // Replace with proper feature type
}

const props = defineProps<{
  map: Map
}>()

const weather = useWeatherStore()
const weatherData = ref<WeatherData | null>(null)

const fetchWeatherData = async () => {
  try {
    const data = await weather.fetchWeatherData()
    weatherData.value = data
  } catch (err) {
    console.error('Failed to fetch weather data:', err)
  }
}

onMounted(() => {
  fetchWeatherData()
})

watch(() => weatherData.value, (data) => {
  if (!data) return

  // Update weather layers with new data
  const source = props.map.getSource('weather') as GeoJSONSource
  if (source) {
    source.setData(data.features)
  }
})
</script> 