<template>
  <div class="airspace-layer-controls" v-if="visible">
    <div class="layer-options">
      <button 
        v-for="option in airspaceOptions"
        :key="option.id"
        @click="toggleAirspaceClass(option.id)"
        class="option-btn"
        :class="{ active: activeClasses.includes(option.id) }"
        :title="option.description"
      >
        <i :class="option.icon"></i>
        <span>{{ option.label }}</span>
      </button>
    </div>
    
    <div class="filter-controls">
      <div class="altitude-filter">
        <label>Altitude Range (ft)</label>
        <div class="range-inputs">
          <input 
            type="number" 
            v-model="altitudeRange.min" 
            @input="updateAltitudeFilter"
            placeholder="Min"
          />
          <span>to</span>
          <input 
            type="number" 
            v-model="altitudeRange.max" 
            @input="updateAltitudeFilter"
            placeholder="Max"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import maplibregl from 'maplibre-gl'
import { useToast } from '@/composables/useToast'

const props = defineProps<{
  map: maplibregl.Map
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const toast = useToast()
const activeClasses = ref<string[]>(['A', 'B', 'C', 'D'])
const altitudeRange = ref({ min: 0, max: 60000 })
const loading = ref(false)

const airspaceOptions = [
  { 
    id: 'A', 
    label: 'Class A', 
    icon: 'fas fa-square',
    description: 'Class A Airspace (18,000ft MSL to FL600)',
    color: '#EF4444'
  },
  { 
    id: 'B', 
    label: 'Class B', 
    icon: 'fas fa-square',
    description: 'Class B Airspace (Surface to 10,000ft MSL)',
    color: '#3B82F6'
  },
  { 
    id: 'C', 
    label: 'Class C', 
    icon: 'fas fa-square',
    description: 'Class C Airspace (Surface to 4,000ft AGL)',
    color: '#8B5CF6'
  },
  { 
    id: 'D', 
    label: 'Class D', 
    icon: 'fas fa-square',
    description: 'Class D Airspace (Surface to 2,500ft AGL)',
    color: '#10B981'
  },
  { 
    id: 'E', 
    label: 'Class E', 
    icon: 'fas fa-square',
    description: 'Class E Airspace',
    color: '#F59E0B'
  },
  { 
    id: 'R', 
    label: 'Restricted', 
    icon: 'fas fa-ban',
    description: 'Restricted Areas',
    color: '#DC2626'
  },
  { 
    id: 'P', 
    label: 'Prohibited', 
    icon: 'fas fa-exclamation-triangle',
    description: 'Prohibited Areas',
    color: '#991B1B'
  },
  { 
    id: 'MOA', 
    label: 'MOA', 
    icon: 'fas fa-fighter-jet',
    description: 'Military Operations Area',
    color: '#6B7280'
  }
]

// Layer management
async function loadAirspaceData() {
  loading.value = true
  try {
    const response = await fetch('/api/airspace')
    if (!response.ok) throw new Error('Failed to load airspace data')
    
    const data = await response.json()
    
    props.map.addSource('airspace', {
      type: 'geojson',
      data: data
    })

    // Add fill layer
    props.map.addLayer({
      id: 'airspace-fill',
      type: 'fill',
      source: 'airspace',
      paint: {
        'fill-color': [
          'match',
          ['get', 'class'],
          'A', '#EF4444',
          'B', '#3B82F6',
          'C', '#8B5CF6',
          'D', '#10B981',
          'E', '#F59E0B',
          'R', '#DC2626',
          'P', '#991B1B',
          'MOA', '#6B7280',
          '#94A3B8' // default color
        ],
        'fill-opacity': 0.2
      },
      filter: ['in', 'class', ...activeClasses.value]
    })

    // Add outline layer
    props.map.addLayer({
      id: 'airspace-line',
      type: 'line',
      source: 'airspace',
      paint: {
        'line-color': [
          'match',
          ['get', 'class'],
          'A', '#EF4444',
          'B', '#3B82F6',
          'C', '#8B5CF6',
          'D', '#10B981',
          'E', '#F59E0B',
          'R', '#DC2626',
          'P', '#991B1B',
          'MOA', '#6B7280',
          '#94A3B8' // default color
        ],
        'line-width': 1
      },
      filter: ['in', 'class', ...activeClasses.value]
    })

    // Add labels
    props.map.addLayer({
      id: 'airspace-labels',
      type: 'symbol',
      source: 'airspace',
      layout: {
        'text-field': [
          'format',
          ['get', 'name'],
          { 'font-scale': 0.8 },
          '\n',
          {},
          ['get', 'class'],
          { 'font-scale': 0.6 }
        ],
        'text-size': 12,
        'text-anchor': 'center',
        'text-justify': 'center',
        'text-optional': true
      },
      paint: {
        'text-color': '#1F2937',
        'text-halo-color': '#FFFFFF',
        'text-halo-width': 2
      },
      filter: ['in', 'class', ...activeClasses.value]
    })

  } catch (error) {
    toast.error('Failed to load airspace data')
    console.error('Airspace data error:', error)
  } finally {
    loading.value = false
  }
}

function removeAirspaceLayers() {
  ['airspace-fill', 'airspace-line', 'airspace-labels'].forEach(layer => {
    if (props.map.getLayer(layer)) {
      props.map.removeLayer(layer)
    }
  })

  if (props.map.getSource('airspace')) {
    props.map.removeSource('airspace')
  }
}

// Event handlers
function toggleAirspaceClass(classId: string) {
  const index = activeClasses.value.indexOf(classId)
  if (index === -1) {
    activeClasses.value.push(classId)
  } else {
    activeClasses.value.splice(index, 1)
  }
  updateFilters()
}

function updateAltitudeFilter() {
  const { min, max } = altitudeRange.value
  if (min < 0 || max < min) return

  const filter = [
    'all',
    ['in', 'class', ...activeClasses.value],
    ['>=', ['get', 'floor'], min],
    ['<=', ['get', 'ceiling'], max]
  ]

  ['airspace-fill', 'airspace-line', 'airspace-labels'].forEach(layer => {
    if (props.map.getLayer(layer)) {
      props.map.setFilter(layer, filter)
    }
  })
}

function updateFilters() {
  const filter = ['in', 'class', ...activeClasses.value]
  
  ['airspace-fill', 'airspace-line', 'airspace-labels'].forEach(layer => {
    if (props.map.getLayer(layer)) {
      props.map.setFilter(layer, filter)
    }
  })
}

// Visibility handling
watch(() => props.visible, (isVisible) => {
  if (isVisible) {
    loadAirspaceData()
  } else {
    removeAirspaceLayers()
  }
})

// Lifecycle hooks
onMounted(() => {
  if (props.visible) {
    loadAirspaceData()
  }
})

onUnmounted(() => {
  removeAirspaceLayers()
})
</script>

<style lang="scss" scoped>
.airspace-layer-controls {
  position: absolute;
  top: 5rem;
  left: 1rem;
  background: var(--bg-primary);
  padding: 1rem;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 1;
  min-width: 240px;
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

.filter-controls {
  border-top: 1px solid var(--border-color);
  padding-top: 1rem;
}

.altitude-filter {
  label {
    display: block;
    font-size: 0.875rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
  }
}

.range-inputs {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input {
    width: 80px;
    padding: 0.25rem 0.5rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-sm);
    background: var(--bg-secondary);
    color: var(--text-primary);
    
    &:focus {
      border-color: var(--primary);
      outline: none;
    }
  }
  
  span {
    color: var(--text-secondary);
  }
}

@media (max-width: 640px) {
  .airspace-layer-controls {
    left: 1rem;
    right: 1rem;
    width: auto;
  }
  
  .layer-options {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .option-btn span {
    display: none;
  }
}
</style> 