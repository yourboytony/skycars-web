<template>
  <div class="charts-panel">
    <!-- Airport Search -->
    <div class="search-bar">
      <div class="search-input">
        <i class="fas fa-search"></i>
        <input 
          v-model="searchQuery"
          @input="searchAirports"
          placeholder="Search airport (ICAO/IATA)"
          type="text"
        >
      </div>
      
      <div class="chart-filters">
        <select v-model="selectedChartType">
          <option value="all">All Charts</option>
          <option value="SID">SIDs</option>
          <option value="STAR">STARs</option>
          <option value="APP">Approaches</option>
          <option value="GND">Ground</option>
          <option value="ENR">Enroute</option>
        </select>
      </div>
    </div>

    <!-- Chart Display -->
    <div class="chart-content">
      <!-- Airport Info -->
      <div v-if="selectedAirport" class="airport-info">
        <div class="airport-header">
          <h2>{{ selectedAirport.icao }} - {{ selectedAirport.name }}</h2>
          <button @click="toggleFavorite" class="favorite-btn">
            <i :class="['fas', isFavorite ? 'fa-star' : 'fa-star-o']"></i>
          </button>
        </div>

        <!-- Chart Categories -->
        <div class="chart-tabs">
          <button 
            v-for="tab in chartTabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="['tab-btn', { active: activeTab === tab.id }]"
          >
            <i :class="tab.icon"></i>
            {{ tab.name }}
          </button>
        </div>

        <!-- Chart List -->
        <div class="chart-list">
          <div 
            v-for="chart in filteredCharts"
            :key="chart.id"
            @click="selectChart(chart)"
            :class="['chart-item', { active: selectedChart?.id === chart.id }]"
          >
            <div class="chart-info">
              <span class="chart-name">{{ chart.name }}</span>
              <span class="chart-type">{{ chart.type }}</span>
            </div>
            <div class="chart-actions">
              <button @click.stop="downloadChart(chart)" class="action-btn">
                <i class="fas fa-download"></i>
              </button>
              <button @click.stop="printChart(chart)" class="action-btn">
                <i class="fas fa-print"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Chart Viewer -->
      <div class="chart-viewer">
        <div v-if="selectedChart" class="viewer-content">
          <div class="viewer-toolbar">
            <div class="zoom-controls">
              <button @click="zoomOut">
                <i class="fas fa-search-minus"></i>
              </button>
              <span>{{ Math.round(zoomLevel * 100) }}%</span>
              <button @click="zoomIn">
                <i class="fas fa-search-plus"></i>
              </button>
            </div>
            <div class="viewer-actions">
              <button @click="rotateChart">
                <i class="fas fa-sync"></i>
              </button>
              <button @click="downloadChart(selectedChart)">
                <i class="fas fa-download"></i>
              </button>
              <button @click="printChart(selectedChart)">
                <i class="fas fa-print"></i>
              </button>
            </div>
          </div>

          <div 
            class="chart-container"
            @wheel="handleZoom"
            @mousedown="startPan"
            @mousemove="pan"
            @mouseup="endPan"
            @mouseleave="endPan"
          >
            <img 
              :src="selectedChart.url"
              :style="chartStyle"
              @load="initializeChart"
              alt="Airport Chart"
            >
          </div>
        </div>
        <div v-else class="no-chart">
          <i class="fas fa-map"></i>
          <p>Select a chart to view</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// State
const searchQuery = ref('')
const selectedChartType = ref('all')
const selectedAirport = ref(null)
const activeTab = ref('all')
const selectedChart = ref(null)
const zoomLevel = ref(1)
const rotation = ref(0)
const isPanning = ref(false)
const panStart = ref({ x: 0, y: 0 })
const panOffset = ref({ x: 0, y: 0 })

// Chart tabs configuration
const chartTabs = [
  { id: 'all', name: 'All', icon: 'fas fa-th-list' },
  { id: 'SID', name: 'SIDs', icon: 'fas fa-plane-departure' },
  { id: 'STAR', name: 'STARs', icon: 'fas fa-plane-arrival' },
  { id: 'APP', name: 'Approaches', icon: 'fas fa-crosshairs' },
  { id: 'GND', name: 'Ground', icon: 'fas fa-road' },
  { id: 'ENR', name: 'Enroute', icon: 'fas fa-route' }
]

// Computed
const chartStyle = computed(() => ({
  transform: `scale(${zoomLevel.value}) rotate(${rotation.value}deg)`,
  translate: `${panOffset.value.x}px ${panOffset.value.y}px`
}))

const filteredCharts = computed(() => {
  if (!selectedAirport.value) return []
  
  let charts = selectedAirport.value.charts
  if (selectedChartType.value !== 'all') {
    charts = charts.filter(c => c.type === selectedChartType.value)
  }
  return charts
})

// Methods
async function searchAirports() {
  if (searchQuery.value.length < 2) return
  
  try {
    // Implement airport search
    const response = await fetch(`/api/airports/search?q=${searchQuery.value}`)
    const data = await response.json()
    // Handle results
  } catch (error) {
    console.error('Airport search failed:', error)
  }
}

function selectChart(chart) {
  selectedChart.value = chart
  zoomLevel.value = 1
  rotation.value = 0
  panOffset.value = { x: 0, y: 0 }
}

function zoomIn() {
  zoomLevel.value = Math.min(zoomLevel.value + 0.1, 3)
}

function zoomOut() {
  zoomLevel.value = Math.max(zoomLevel.value - 0.1, 0.5)
}

function rotateChart() {
  rotation.value = (rotation.value + 90) % 360
}

function handleZoom(event) {
  event.preventDefault()
  if (event.deltaY < 0) {
    zoomIn()
  } else {
    zoomOut()
  }
}

function startPan(event) {
  isPanning.value = true
  panStart.value = {
    x: event.clientX - panOffset.value.x,
    y: event.clientY - panOffset.value.y
  }
}

function pan(event) {
  if (!isPanning.value) return
  
  panOffset.value = {
    x: event.clientX - panStart.value.x,
    y: event.clientY - panStart.value.y
  }
}

function endPan() {
  isPanning.value = false
}

async function downloadChart(chart) {
  // Implement chart download
}

async function printChart(chart) {
  // Implement chart printing
}

function toggleFavorite() {
  // Implement favorite toggle
}

function initializeChart() {
  // Initialize chart viewer
}
</script>

<style scoped>
.charts-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: white;
}

.search-bar {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 1;
  position: relative;
}

.search-input i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--secondary-color);
}

.search-input input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.chart-content {
  flex: 1;
  display: grid;
  grid-template-columns: 300px 1fr;
  overflow: hidden;
}

.airport-info {
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.chart-viewer {
  position: relative;
  overflow: hidden;
}

.viewer-toolbar {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 10;
  display: flex;
  gap: 1rem;
  background: white;
  padding: 0.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.chart-container {
  height: 100%;
  overflow: hidden;
  position: relative;
}

.chart-container img {
  max-width: 100%;
  height: auto;
  transition: transform 0.1s;
}

/* Add more styles as needed */
</style> 