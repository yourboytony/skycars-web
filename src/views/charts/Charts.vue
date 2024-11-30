<template>
  <div class="charts-page">
    <!-- Header -->
    <div class="charts-header">
      <h1>Airport Charts</h1>
      <div class="header-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search airport (ICAO)"
            @keyup.enter="searchAirport"
            maxlength="4"
          >
          <button 
            class="btn-primary search-btn"
            @click="searchAirport"
          >
            Search
          </button>
        </div>
        <div class="recent-airports">
          <button 
            v-for="airport in recentAirports" 
            :key="airport"
            @click="selectAirport(airport)"
            class="airport-chip"
          >
            {{ airport }}
          </button>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="charts-content" v-if="selectedAirport">
      <div class="airport-info">
        <div class="airport-header">
          <div class="airport-title">
            <h2>{{ selectedAirport }}</h2>
            <span class="airport-name">{{ airportData.name }}</span>
          </div>
          <button 
            class="btn-secondary favorite-btn"
            :class="{ active: isFavorite }"
            @click="toggleFavorite"
          >
            <i class="fas fa-star"></i>
            {{ isFavorite ? 'Favorited' : 'Add to Favorites' }}
          </button>
        </div>

        <div class="charts-grid">
          <!-- Chart Categories -->
          <div class="chart-categories">
            <div class="category-list">
              <button 
                v-for="category in chartCategories" 
                :key="category.id"
                class="category-btn"
                :class="{ active: selectedCategory === category.id }"
                @click="selectedCategory = category.id"
              >
                <i :class="category.icon"></i>
                {{ category.name }}
                <span class="chart-count">{{ category.count }}</span>
              </button>
            </div>
          </div>

          <!-- Chart List -->
          <div class="chart-list">
            <div 
              v-for="chart in filteredCharts" 
              :key="chart.id"
              class="chart-card"
              @click="viewChart(chart)"
            >
              <div class="chart-preview">
                <img :src="chart.thumbnail" :alt="chart.name">
                <div class="chart-overlay">
                  <button class="btn-primary">View</button>
                </div>
              </div>
              <div class="chart-info">
                <h3>{{ chart.name }}</h3>
                <p class="chart-details">
                  <span class="chart-type">{{ chart.type }}</span>
                  <span class="chart-date">Updated: {{ chart.date }}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div class="empty-state" v-else>
      <i class="fas fa-map"></i>
      <h2>Search for an Airport</h2>
      <p>Enter an ICAO code to view available charts</p>
    </div>

    <!-- Chart Provider Section -->
    <div class="chart-providers">
      <div class="provider-list">
        <div 
          v-for="provider in chartProviders" 
          :key="provider.id"
          class="provider-item"
        >
          <PlaceholderIcon 
            :type="provider.id" 
            size="sm"
          />
          <span>{{ provider.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import PlaceholderIcon from '@/components/PlaceholderIcon.vue'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const selectedAirport = ref(null)
const selectedCategory = ref('all')
const isFavorite = ref(false)

// Mock data
const recentAirports = ref(['KJFK', 'KLAX', 'KORD'])
const airportData = ref({
  name: 'John F. Kennedy International Airport',
  charts: []
})

const chartCategories = ref([
  { id: 'all', name: 'All Charts', icon: 'fas fa-th-large', count: 24 },
  { id: 'approach', name: 'Approach', icon: 'fas fa-plane-arrival', count: 12 },
  { id: 'departure', name: 'Departure', icon: 'fas fa-plane-departure', count: 6 },
  { id: 'airport', name: 'Airport', icon: 'fas fa-map', count: 3 },
  { id: 'ground', name: 'Ground', icon: 'fas fa-road', count: 3 }
])

const charts = ref([
  {
    id: 1,
    name: 'RNAV (GPS) RWY 13L',
    type: 'Approach',
    category: 'approach',
    date: '2024-01-15',
    thumbnail: '/charts/approach-13l.jpg'
  },
  // Add more charts...
])

const filteredCharts = computed(() => {
  if (selectedCategory.value === 'all') {
    return charts.value
  }
  return charts.value.filter(chart => chart.category === selectedCategory.value)
})

function searchAirport() {
  if (searchQuery.value.length === 4) {
    selectedAirport.value = searchQuery.value.toUpperCase()
    // TODO: Fetch airport data and charts
  }
}

function selectAirport(airport) {
  searchQuery.value = airport
  selectedAirport.value = airport
  // TODO: Fetch airport data and charts
}

function toggleFavorite() {
  isFavorite.value = !isFavorite.value
  // TODO: Update in store/backend
}

function viewChart(chart) {
  router.push({
    name: 'ChartViewer',
    params: { 
      airport: selectedAirport.value,
      chartId: chart.id 
    }
  })
}

const chartProviders = [
  { id: 'navigraph', name: 'Navigraph Charts' },
  { id: 'jeppesen', name: 'Jeppesen' },
  { id: 'faa', name: 'FAA Digital Charts' }
]
</script>

<style scoped>
.charts-page {
  padding: 24px;
}

.charts-header {
  margin-bottom: 24px;
}

.header-actions {
  margin-top: 16px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 12px;
  max-width: 500px;
}

.search-box input {
  flex: 1;
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 16px;
}

.recent-airports {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.airport-chip {
  padding: 6px 12px;
  background: #f1f5f9;
  border: none;
  border-radius: 100px;
  font-size: 14px;
  cursor: pointer;
}

.airport-chip:hover {
  background: #e2e8f0;
}

.airport-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.airport-title {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.airport-name {
  color: var(--text-secondary);
  font-size: 16px;
}

.favorite-btn {
  display: flex;
  align-items: center;
  gap: 8px;
}

.favorite-btn.active {
  background: #fef3c7;
  color: #92400e;
}

.favorite-btn.active i {
  color: #f59e0b;
}

.charts-grid {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 24px;
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

.chart-categories {
  padding: 20px;
  border-right: 1px solid var(--border-color);
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  border-radius: 6px;
}

.category-btn i {
  width: 20px;
}

.category-btn:hover {
  background: #f8fafc;
}

.category-btn.active {
  background: var(--primary);
  color: white;
}

.chart-count {
  margin-left: auto;
  background: #e2e8f0;
  padding: 2px 8px;
  border-radius: 100px;
  font-size: 12px;
  color: var(--text-secondary);
}

.category-btn.active .chart-count {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.chart-list {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.chart-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.chart-card:hover {
  transform: translateY(-2px);
}

.chart-preview {
  position: relative;
  aspect-ratio: 4/3;
  border-radius: 8px;
  overflow: hidden;
}

.chart-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.chart-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.chart-card:hover .chart-overlay {
  opacity: 1;
}

.chart-info {
  margin-top: 12px;
}

.chart-info h3 {
  font-size: 14px;
  margin-bottom: 4px;
}

.chart-details {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary);
}

.empty-state {
  text-align: center;
  padding: 48px;
  color: var(--text-secondary);
}

.empty-state i {
  font-size: 48px;
  margin-bottom: 16px;
}

@media (max-width: 768px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }

  .chart-categories {
    border-right: none;
    border-bottom: 1px solid var(--border-color);
  }

  .category-list {
    display: flex;
    overflow-x: auto;
    padding-bottom: 12px;
  }

  .category-btn {
    white-space: nowrap;
  }
}
</style> 