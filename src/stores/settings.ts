import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Settings {
  units: {
    distance: 'nm' | 'km' | 'mi'
    speed: 'kts' | 'kph' | 'mph'
    altitude: 'ft' | 'm'
  }
  map: {
    style: 'default' | 'satellite' | 'terrain'
    layers: string[]
  }
  theme: 'light' | 'dark' | 'system'
}

export const useSettingsStore = defineStore('settings', () => {
  const settings = ref<Settings>({
    units: {
      distance: 'nm',
      speed: 'kts',
      altitude: 'ft'
    },
    map: {
      style: 'default',
      layers: ['terrain', 'airspace', 'weather']
    },
    theme: 'system'
  })

  function updateSettings(newSettings: Partial<Settings>) {
    settings.value = { ...settings.value, ...newSettings }
    localStorage.setItem('settings', JSON.stringify(settings.value))
  }

  function loadSettings() {
    const saved = localStorage.getItem('settings')
    if (saved) {
      settings.value = JSON.parse(saved)
    }
  }

  return {
    settings,
    updateSettings,
    loadSettings
  }
}) 