<template>
  <div class="chart-viewer">
    <div class="chart-header">
      <div class="chart-info">
        <h1>{{ chart.name }}</h1>
        <span class="chart-type">{{ chart.type }} - {{ chart.airport }}</span>
      </div>
      <div class="chart-actions">
        <button class="btn-secondary">
          <i class="fas fa-download"></i> Download
        </button>
        <button class="btn-secondary">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>

    <div class="chart-container">
      <!-- Chart viewer implementation -->
      <div class="chart-controls">
        <button><i class="fas fa-search-plus"></i></button>
        <button><i class="fas fa-search-minus"></i></button>
        <button><i class="fas fa-rotate"></i></button>
        <button><i class="fas fa-expand"></i></button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const chart = ref({
  name: 'RNAV (GPS) RWY 26',
  type: 'Approach',
  airport: 'KJFK'
})

onMounted(async () => {
  // TODO: Load chart data using route.params.id
})
</script>

<style scoped>
.chart-viewer {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.chart-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-color);
}

.chart-type {
  color: var(--text-secondary);
  font-size: 14px;
}

.chart-actions {
  display: flex;
  gap: 12px;
}

.chart-container {
  flex: 1;
  position: relative;
  background: #f1f5f9;
}

.chart-controls {
  position: absolute;
  right: 20px;
  top: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: white;
  padding: 8px;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.chart-controls button {
  padding: 8px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--text-secondary);
}

.chart-controls button:hover {
  color: var(--primary);
}
</style> 