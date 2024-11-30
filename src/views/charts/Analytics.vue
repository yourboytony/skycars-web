<template>
  <div class="analytics">
    <div class="analytics-header">
      <h1>Flight Analytics</h1>
      <div class="header-controls">
        <select v-model="timeRange" class="select-input">
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
          <option value="1y">Last Year</option>
        </select>
        <button @click="refreshData" class="btn-refresh">
          <i class="fas fa-sync-alt"></i>
          Refresh
        </button>
      </div>
    </div>

    <div class="analytics-grid">
      <!-- Summary Cards -->
      <div class="summary-cards">
        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-plane-departure"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Total Flights</span>
            <span class="stat-value">{{ stats.totalFlights }}</span>
            <span class="stat-change" :class="stats.flightsTrend">
              {{ stats.flightsChange }}%
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-clock"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Flight Hours</span>
            <span class="stat-value">{{ stats.flightHours }}h</span>
            <span class="stat-change" :class="stats.hoursTrend">
              {{ stats.hoursChange }}%
            </span>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="stat-info">
            <span class="stat-label">Destinations</span>
            <span class="stat-value">{{ stats.destinations }}</span>
            <span class="stat-change" :class="stats.destTrend">
              {{ stats.destChange }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="chart-grid">
        <div class="chart-card">
          <h3>Flight Activity</h3>
          <LineChart :data="flightActivityData" />
        </div>

        <div class="chart-card">
          <h3>Popular Routes</h3>
          <BarChart :data="popularRoutesData" />
        </div>

        <div class="chart-card">
          <h3>Flight Duration Distribution</h3>
          <PieChart :data="durationData" />
        </div>

        <div class="chart-card">
          <h3>Aircraft Usage</h3>
          <DoughnutChart :data="aircraftData" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useToast } from '@/composables/useToast'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import DoughnutChart from '@/components/charts/DoughnutChart.vue'

const toast = useToast()
const timeRange = ref('30d')
const isLoading = ref(false)

// Sample data - replace with real data from your API
const stats = ref({
  totalFlights: 156,
  flightHours: 342,
  destinations: 28,
  flightsTrend: 'positive',
  hoursTrend: 'positive',
  destTrend: 'neutral',
  flightsChange: 12.5,
  hoursChange: 8.3,
  destChange: 0
})

// Sample chart data
const flightActivityData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Flights',
    data: [12, 19, 3, 5, 2, 3, 7],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.1
  }]
})

const popularRoutesData = ref({
  labels: ['KLAX-KSFO', 'KJFK-KBOS', 'KORD-KATL', 'KDEN-KPHX', 'KSEA-KPDX'],
  datasets: [{
    label: 'Number of Flights',
    data: [65, 59, 80, 81, 56],
    backgroundColor: 'rgba(54, 162, 235, 0.5)'
  }]
})

const durationData = ref({
  labels: ['< 1h', '1-2h', '2-3h', '3-4h', '> 4h'],
  datasets: [{
    data: [30, 50, 20, 10, 5],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)'
    ]
  }]
})

const aircraftData = ref({
  labels: ['B737', 'A320', 'E175', 'CRJ9', 'A220'],
  datasets: [{
    data: [40, 30, 15, 10, 5],
    backgroundColor: [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)'
    ]
  }]
})

async function refreshData() {
  isLoading.value = true
  try {
    // Fetch your analytics data here
    toast.success('Analytics data updated')
  } catch (error) {
    toast.error('Failed to update analytics')
    console.error('Analytics refresh error:', error)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  refreshData()
})
</script>

<style scoped>
.analytics {
  padding: 24px;
  height: 100%;
}

.analytics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-controls {
  display: flex;
  gap: 16px;
}

.select-input {
  padding: 8px 16px;
  border-radius: 8px;
  border: 1px solid var(--border-color);
  background: white;
}

.btn-refresh {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 14px;
  color: var(--text-secondary);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-change {
  font-size: 14px;
  font-weight: 500;
}

.stat-change.positive {
  color: #16a34a;
}

.stat-change.negative {
  color: #dc2626;
}

.stat-change.neutral {
  color: #6b7280;
}

.chart-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: var(--shadow-sm);
}

.chart-card h3 {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .analytics {
    padding: 16px;
  }

  .analytics-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .header-controls {
    width: 100%;
  }

  .select-input {
    flex: 1;
  }

  .chart-grid {
    grid-template-columns: 1fr;
  }
}
</style> 