<template>
  <!-- Layer is rendered directly on the map -->
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import type { Map, GeoJSONSource } from 'maplibre-gl'
import { useToastStore } from '@/stores/toast'

interface Layer {
  id: string
  type: string
  source: string
  // Add other layer properties as needed
}

const props = defineProps<{
  map: Map
}>()

const toast = useToastStore()

const addAirspaceLayers = async () => {
  try {
    const response = await fetch('/api/airspace')
    const data = await response.json()

    props.map.addSource('airspace', {
      type: 'geojson',
      data
    })

    const layers: Layer[] = [
      {
        id: 'airspace-fill',
        type: 'fill',
        source: 'airspace'
      },
      // Add other layers as needed
    ]

    layers.forEach(layer => {
      props.map.addLayer(layer)
    })

  } catch (err) {
    toast.show('Failed to load airspace data', 'error')
  }
}

onMounted(() => {
  addAirspaceLayers()
})
</script> 