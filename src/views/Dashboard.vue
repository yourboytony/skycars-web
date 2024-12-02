<template>
  <div class="dashboard">
    <!-- Welcome Section -->
    <div class="welcome-section">
      <div class="welcome-content">
        <h1>Welcome back, {{ userName }}!</h1>
        <p>{{ welcomeMessage }}</p>
      </div>
      <div class="weather-preview">
        <div class="weather-icon">
          <i :class="currentWeather.icon"></i>
        </div>
        <div class="weather-info">
          <span class="temperature">{{ currentWeather.temp }}°C</span>
          <span class="condition">{{ currentWeather.condition }}</span>
          <span class="location">{{ currentWeather.location }}</span>
        </div>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div 
        v-for="stat in stats" 
        :key="stat.id" 
        class="stat-card"
        :class="stat.trend"
      >
        <div class="stat-icon">
          <i :class="stat.icon"></i>
        </div>
        <div class="stat-info">
          <span class="stat-label">{{ stat.label }}</span>
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-trend">
            <i :class="stat.trend === 'up' ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ stat.change }}%
          </span>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="charts-grid">
      <div class="chart-card flight-activity">
        <div class="card-header">
          <h3>Flight Activity</h3>
          <div class="card-actions">
            <select v-model="timeRange" class="select-input">
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
            </select>
            <button @click="refreshData" class="btn-refresh">
              <i class="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>
        <LineChart :data="flightActivityData" :options="chartOptions" />
      </div>

      <div class="chart-card popular-routes">
        <div class="card-header">
          <h3>Popular Routes</h3>
          <button @click="viewAllRoutes" class="btn-text">
            View All
            <i class="fas fa-arrow-right"></i>
          </button>
        </div>
        <BarChart :data="popularRoutesData" :options="chartOptions" />
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="recent-activity">
      <div class="card-header">
        <h3>Recent Activity</h3>
        <button @click="viewAllActivity" class="btn-text">
          View All
          <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      <div class="activity-list">
        <div 
          v-for="activity in recentActivity" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon" :class="activity.type">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-content">
            <div class="activity-header">
              <span class="activity-title">{{ activity.title }}</span>
              <span class="activity-time">{{ activity.time }}</span>
            </div>
            <p class="activity-description">{{ activity.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LineChart from '@/components/charts/LineChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

const router = useRouter()
const authStore = useAuthStore()
const timeRange = ref('30d')

// User info
const userName = computed(() => authStore.user?.name?.split(' ')[0] || 'User')
const welcomeMessage = computed(() => {
  const hour = new Date().getHours()
  if (hour < 12) return 'Ready for your morning flights?'
  if (hour < 17) return 'Having a great day of flying?'
  return 'Planning your evening flights?'
})

// Weather info (mock data)
const currentWeather = ref({
  temp: 22,
  condition: 'Partly Cloudy',
  location: 'KLAX',
  icon: 'fas fa-cloud-sun'
})

// Stats data
const stats = ref([
  {
    id: 1,
    label: 'Total Flights',
    value: '156',
    change: '12.5',
    trend: 'up',
    icon: 'fas fa-plane-departure'
  },
  {
    id: 2,
    label: 'Flight Hours',
    value: '342h',
    change: '8.3',
    trend: 'up',
    icon: 'fas fa-clock'
  },
  {
    id: 3,
    label: 'Fuel Efficiency',
    value: '89%',
    change: '5.2',
    trend: 'up',
    icon: 'fas fa-gas-pump'
  },
  {
    id: 4,
    label: 'Delays',
    value: '2.3%',
    change: '1.5',
    trend: 'down',
    icon: 'fas fa-hourglass-half'
  }
])

// Chart data
const flightActivityData = ref({
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [{
    label: 'Flights',
    data: [12, 19, 3, 5, 2, 3, 7],
    borderColor: 'rgb(75, 192, 192)',
    tension: 0.4
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

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    }
  }
}

// Recent activity
const recentActivity = ref([
  {
    id: 1,
    type: 'flight',
    icon: 'fas fa-plane',
    title: 'Flight Completed',
    description: 'KLAX → KSFO completed successfully',
    time: '2h ago'
  },
  {
    id: 2,
    type: 'weather',
    icon: 'fas fa-cloud',
    title: 'Weather Alert',
    description: 'Strong winds reported at KDEN',
    time: '4h ago'
  },
  {
    id: 3,
    type: 'maintenance',
    icon: 'fas fa-wrench',
    title: 'Maintenance Check',
    description: 'Routine maintenance completed',
    time: '6h ago'
  }
])

// Functions
function refreshData() {
  // Implement data refresh
}

function viewAllRoutes() {
  router.push('/flights/routes')
}

function viewAllActivity() {
  router.push('/activity')
}

onMounted(() => {
  // Fetch initial data
})
</script>

<style lang="scss" scoped>
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.welcome-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
  padding: 2rem;
  border-radius: var(--radius-lg);
  color: white;
  
  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    opacity: 0.9;
  }
}

.weather-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  backdrop-filter: blur(8px);
  
  .weather-icon {
    font-size: 2.5rem;
  }
  
  .weather-info {
    display: flex;
    flex-direction: column;
    
    .temperature {
      font-size: 1.5rem;
      font-weight: 600;
    }
    
    .condition,
    .location {
      font-size: 0.875rem;
      opacity: 0.9;
    }
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
}

.stat-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all var(--transition-fast);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }
  
  &.up .stat-trend {
    color: var(--success);
  }
  
  &.down .stat-trend {
    color: var(--error);
  }
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: var(--radius-md);
  background: var(--primary-light);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
  
  .stat-label {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .stat-trend {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    font-size: 0.875rem;
    font-weight: 500;
    
    i {
      font-size: 0.75rem;
    }
  }
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.chart-card {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--text-primary);
  }
}

.card-actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.select-input {
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
}

.btn-refresh {
  width: 2rem;
  height: 2rem;
  border-radius: var(--radius-md);
  border: none;
  background: var(--bg-secondary);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--primary-light);
    color: white;
  }
}

.btn-text {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border: none;
  background: none;
  color: var(--primary);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    opacity: 0.8;
    
    i {
      transform: translateX(2px);
    }
  }
  
  i {
    transition: transform var(--transition-fast);
  }
}

.recent-activity {
  background: var(--bg-primary);
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--bg-secondary);
  }
}

.activity-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  
  &.flight {
    background: var(--primary-light);
    color: var(--primary);
  }
  
  &.weather {
    background: var(--warning-light);
    color: var(--warning);
  }
  
  &.maintenance {
    background: var(--success-light);
    color: var(--success);
  }
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.25rem;
  
  .activity-title {
    font-weight: 500;
    color: var(--text-primary);
  }
  
  .activity-time {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.activity-description {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .welcome-section {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
  
  .charts-grid {
    grid-template-columns: 1fr;
  }
}
</style> 