<template>
  <div class="admin-dashboard">
    <h1>Admin Dashboard</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total Users</h3>
        <p class="stat-value">{{ stats.totalUsers }}</p>
      </div>
      <div class="stat-card">
        <h3>Active Flights</h3>
        <p class="stat-value">{{ stats.activeFlights }}</p>
      </div>
      <div class="stat-card">
        <h3>API Usage</h3>
        <p class="stat-value">{{ stats.apiCalls }}/day</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const stats = ref({
  totalUsers: 0,
  activeFlights: 0,
  apiCalls: 0
})

onMounted(async () => {
  // TODO: Fetch admin stats
})
</script>

<style scoped>
.admin-dashboard {
  padding: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--primary);
  margin-top: 8px;
}
</style> 