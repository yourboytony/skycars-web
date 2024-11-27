<template>
  <div class="dashboard">
    <div class="dashboard-container">
      <header class="dashboard-header glass">
        <h1>Welcome back, {{ auth.user?.name }}</h1>
        <p class="last-login">Last login: {{ formatDate(lastLogin) }}</p>
      </header>

      <div class="dashboard-grid">
        <!-- Stats Section -->
        <div class="stats-section glass">
          <h2>Overview</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <i class="fas fa-car"></i>
              <div class="stat-info">
                <h3>Active Listings</h3>
                <p class="stat-value">{{ stats.activeListings }}</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-eye"></i>
              <div class="stat-info">
                <h3>Total Views</h3>
                <p class="stat-value">{{ stats.totalViews }}</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-heart"></i>
              <div class="stat-info">
                <h3>Favorites</h3>
                <p class="stat-value">{{ stats.favorites }}</p>
              </div>
            </div>
            <div class="stat-card">
              <i class="fas fa-envelope"></i>
              <div class="stat-info">
                <h3>Messages</h3>
                <p class="stat-value">{{ stats.unreadMessages }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Quick Actions -->
        <div class="quick-actions glass">
          <h2>Quick Actions</h2>
          <div class="actions-grid">
            <button @click="router.push('/listings/new')" class="action-btn">
              <i class="fas fa-plus"></i>
              <span>New Listing</span>
            </button>
            <button @click="router.push('/messages')" class="action-btn">
              <i class="fas fa-envelope"></i>
              <span>Messages</span>
            </button>
            <button @click="router.push('/profile')" class="action-btn">
              <i class="fas fa-user"></i>
              <span>Profile</span>
            </button>
            <button @click="router.push('/settings')" class="action-btn">
              <i class="fas fa-cog"></i>
              <span>Settings</span>
            </button>
          </div>
        </div>

        <!-- Recent Activity -->
        <div class="recent-activity glass">
          <h2>Recent Activity</h2>
          <div class="activity-list" v-if="activities.length">
            <div v-for="activity in activities" :key="activity.id" class="activity-item">
              <i :class="activity.icon"></i>
              <div class="activity-content">
                <p>{{ activity.message }}</p>
                <span class="activity-time">{{ formatDate(activity.timestamp) }}</span>
              </div>
            </div>
          </div>
          <p v-else class="no-activity">No recent activity</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const lastLogin = ref(new Date())

const stats = ref({
  activeListings: 0,
  totalViews: 0,
  favorites: 0,
  unreadMessages: 0
})

const activities = ref([])

const formatDate = (date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(new Date(date))
}

onMounted(async () => {
  try {
    // Fetch dashboard data
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/dashboard`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      stats.value = data.stats
      activities.value = data.activities
      lastLogin.value = data.lastLogin
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
  }
})
</script>

<style scoped>
.dashboard {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 60px;
}

.dashboard-header {
  padding: 2rem;
  border-radius: 1rem;
  margin-bottom: 2rem;
}

.dashboard-header h1 {
  margin: 0;
  color: var(--text-color);
}

.last-login {
  color: var(--text-light);
  margin-top: 0.5rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stats-section,
.quick-actions,
.recent-activity {
  padding: 2rem;
}

h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: var(--text-color);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 1rem;
}

.stat-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: 0.5rem;
}

.stat-card i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.stat-info h3 {
  margin: 0;
  font-size: 0.875rem;
  color: var(--text-light);
}

.stat-value {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-color);
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--background-secondary);
  border: none;
  border-radius: 0.5rem;
  color: var(--text-color);
  cursor: pointer;
  transition: transform 0.2s;
}

.action-btn:hover {
  transform: translateY(-2px);
}

.action-btn i {
  font-size: 1.5rem;
  color: var(--primary-color);
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
  background: var(--background-secondary);
  border-radius: 0.5rem;
}

.activity-item i {
  color: var(--primary-color);
}

.activity-content {
  flex: 1;
}

.activity-content p {
  margin: 0;
  color: var(--text-color);
}

.activity-time {
  font-size: 0.875rem;
  color: var(--text-light);
}

.no-activity {
  text-align: center;
  color: var(--text-light);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 1rem;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 