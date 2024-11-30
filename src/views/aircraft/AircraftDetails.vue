<template>
  <div class="aircraft-details">
    <div class="aircraft-header">
      <h1>{{ aircraft.registration }}</h1>
      <div class="header-actions">
        <button class="btn-secondary">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn-primary">
          <i class="fas fa-plane-departure"></i> Plan Flight
        </button>
      </div>
    </div>

    <div class="details-grid">
      <div class="detail-card">
        <h3>Aircraft Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Type</span>
            <span class="value">{{ aircraft.type }}</span>
          </div>
          <div class="info-item">
            <span class="label">Model</span>
            <span class="value">{{ aircraft.model }}</span>
          </div>
          <div class="info-item">
            <span class="label">Engine Type</span>
            <span class="value">{{ aircraft.engineType }}</span>
          </div>
        </div>
      </div>

      <div class="detail-card">
        <h3>Performance Data</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Cruise Speed</span>
            <span class="value">{{ aircraft.cruiseSpeed }} kts</span>
          </div>
          <div class="info-item">
            <span class="label">Service Ceiling</span>
            <span class="value">{{ aircraft.serviceCeiling }} ft</span>
          </div>
          <div class="info-item">
            <span class="label">Range</span>
            <span class="value">{{ aircraft.range }} nm</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const aircraft = ref({
  registration: 'N12345',
  type: 'C172',
  model: 'Skyhawk',
  engineType: 'Single Piston',
  cruiseSpeed: 122,
  serviceCeiling: 14000,
  range: 696
})

onMounted(async () => {
  // TODO: Fetch aircraft details using route.params.id
})
</script>

<style scoped>
.aircraft-details {
  padding: 24px;
}

.aircraft-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
}

.detail-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.info-grid {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  color: var(--text-secondary);
}

.value {
  font-weight: 500;
}
</style> 