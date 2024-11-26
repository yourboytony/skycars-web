<template>
  <div class="radar-view">
    <div class="radar-header">
      <h1>VATSIM Radar</h1>
      <div class="radar-controls">
        <button class="btn" @click="refreshData">Refresh Data</button>
        <select v-model="selectedRegion" class="select-region">
          <option value="global">Global</option>
          <option value="na">North America</option>
          <option value="eu">Europe</option>
          <option value="asia">Asia</option>
        </select>
      </div>
    </div>

    <div class="radar-container">
      <!-- Placeholder for radar map -->
      <div class="radar-map">
        <div v-if="loading" class="loading">Loading VATSIM data...</div>
        <!-- Map will be initialized here -->
      </div>

      <div class="radar-sidebar">
        <div class="stats-panel">
          <h3>Live Statistics</h3>
          <div class="stat-item">
            <span>Active Pilots:</span>
            <span>{{ stats.pilots || 0 }}</span>
          </div>
          <div class="stat-item">
            <span>Active Controllers:</span>
            <span>{{ stats.controllers || 0 }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Radar',
  data() {
    return {
      loading: true,
      selectedRegion: 'global',
      stats: {
        pilots: 0,
        controllers: 0
      }
    }
  },
  methods: {
    refreshData() {
      // Implement VATSIM data refresh
      this.loading = true
      // Add VATSIM API integration here
      setTimeout(() => this.loading = false, 1000)
    }
  },
  mounted() {
    this.refreshData()
  }
}
</script>

<style scoped>
.radar-view {
  padding: 2rem;
}

.radar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.radar-controls {
  display: flex;
  gap: 1rem;
}

.radar-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 2rem;
  height: 70vh;
}

.radar-map {
  background: #f1f5f9;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radar-sidebar {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats-panel {
  margin-bottom: 2rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background: var(--primary-color);
  color: white;
  border: none;
  cursor: pointer;
}

.select-region {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #e5e7eb;
}
</style> 