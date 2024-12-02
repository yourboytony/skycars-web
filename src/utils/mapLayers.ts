import type { Map } from 'maplibre-gl'

export function loadTerrainLayer(map: Map) {
  // Add terrain source
  map.addSource('terrain', {
    type: 'raster-dem',
    url: 'https://api.maptiler.com/tiles/terrain-rgb/tiles.json',
    tileSize: 256
  })

  // Add terrain layer
  map.addLayer({
    id: 'terrain-layer',
    type: 'hillshade',
    source: 'terrain',
    layout: {
      visibility: 'visible'
    }
  })
}

export function loadAirportsLayer(map: Map) {
  // Add airports source
  map.addSource('airports', {
    type: 'geojson',
    data: '/api/airports'
  })

  // Add airports layer
  map.addLayer({
    id: 'airports-layer',
    type: 'symbol',
    source: 'airports',
    layout: {
      'icon-image': 'airport',
      'icon-size': 1,
      visibility: 'visible'
    }
  })
}

export function loadAirspaceLayer(map: Map) {
  // Add airspace source
  map.addSource('airspace', {
    type: 'geojson',
    data: '/api/airspace'
  })

  // Add airspace layer
  map.addLayer({
    id: 'airspace-layer',
    type: 'fill',
    source: 'airspace',
    paint: {
      'fill-color': '#3b82f680',
      'fill-outline-color': '#2563eb'
    },
    layout: {
      visibility: 'visible'
    }
  })
}

export function loadWeatherLayer(map: Map) {
  // Add weather source
  map.addSource('weather', {
    type: 'geojson',
    data: '/api/weather'
  })

  // Add weather layer
  map.addLayer({
    id: 'weather-layer',
    type: 'symbol',
    source: 'weather',
    layout: {
      'icon-image': 'weather',
      'icon-size': 1,
      visibility: 'visible'
    }
  })
} 