import { ref, onMounted, onUnmounted } from 'vue'

export function useGeolocation() {
  const coords = ref({ latitude: 0, longitude: 0 })
  const isSupported = 'navigator' in window && 'geolocation' in navigator

  const error = ref<GeolocationPositionError | null>(null)
  const loading = ref(false)

  let watcher: number | null = null

  function updatePosition(position: GeolocationPosition) {
    coords.value = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }
    error.value = null
    loading.value = false
  }

  function handleError(err: GeolocationPositionError) {
    error.value = err
    loading.value = false
  }

  function request() {
    if (!isSupported) {
      error.value = new Error('Geolocation is not supported') as any
      return
    }

    loading.value = true
    navigator.geolocation.getCurrentPosition(updatePosition, handleError)
  }

  function watch() {
    if (!isSupported) {
      error.value = new Error('Geolocation is not supported') as any
      return
    }

    loading.value = true
    watcher = navigator.geolocation.watchPosition(updatePosition, handleError)
  }

  onMounted(() => {
    request()
  })

  onUnmounted(() => {
    if (watcher) navigator.geolocation.clearWatch(watcher)
  })

  return {
    coords,
    error,
    loading,
    isSupported,
    request,
    watch
  }
} 