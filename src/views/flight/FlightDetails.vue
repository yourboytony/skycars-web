<template>
  <div class="flight-details">
    <div class="details-header">
      <div class="route-info">
        <h1>Flight {{ flight.callsign }}</h1>
        <div class="route-display">
          <span class="airport">{{ flight.departure }}</span>
          <i class="fas fa-arrow-right"></i>
          <span class="airport">{{ flight.arrival }}</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-secondary">
          <i class="fas fa-download"></i> Export
        </button>
        <button class="btn-secondary">
          <i class="fas fa-print"></i> Print
        </button>
      </div>
    </div>

    <div class="details-grid">
      <!-- Flight Info Card -->
      <div class="detail-card">
        <h3>Flight Information</h3>
        <div class="info-grid">
          <div class="info-item">
            <span class="label">Date</span>
            <span>{{ flight.date }}</span>
          </div>
          <div class="info-item">
            <span class="label">Aircraft</span>
            <span>{{ flight.aircraft }}</span>
          </div>
          <div class="info-item">
            <span class="label">Duration</span>
            <span>{{ flight.duration }}</span>
          </div>
          <div class="info-item">
            <span class="label">Status</span>
            <span :class="['status-badge', flight.status]">
              {{ flight.status }}
            </span>
          </div>
        </div>
      </div>

      <!-- Route Details -->
      <div class="detail-card">
        <h3>Route Details</h3>
        <div class="route-details">
          <div class="waypoint" v-for="(waypoint, index) in flight.route" :key="index">
            <span class="waypoint-name">{{ waypoint.name }}</span>
            <span class="waypoint-info">{{ waypoint.altitude }}ft</span>
          </div>
        </div>
      </div>

      <!-- Weather Summary -->
      <div class="detail-card">
        <h3>Weather Summary</h3>
        <div class="weather-info">
          <!-- Weather details -->
        </div>
      </div>

      <!-- Fuel Planning -->
      <div class="detail-card">
        <h3>Fuel Planning</h3>
        <div class="fuel-info">
          <!-- Fuel details -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const flight = ref({
  id: route.params.id,
  callsign: 'SKC1234',
  departure: 'KJFK',
  arrival: 'KLAX',
  date: '2024-01-24',
  aircraft: 'N12345 - B738',
  duration: '5h 30m',
  status: 'completed',
  route: [
    { name: 'KJFK', altitude: '0' },
    { name: 'MERIT', altitude: '33000' },
    { name: 'KLAX', altitude: '0' }
  ]
})

onMounted(async () => {
  // TODO: Fetch flight details
})
</script>

<style scoped>
.flight-details {
  padding: 24px;
}

.details-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
}

.route-display {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 8px;
  font-size: 18px;
}

.airport {
  font-weight: 500;
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

.route-details {
  margin-top: 16px;
}

.waypoint {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--border-color);
}

.waypoint:last-child {
  border-bottom: none;
}

.waypoint-info {
  color: var(--text-secondary);
}

.status-badge {
  padding: 4px 8px;
  border-radius: 100px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background: #dcfce7;
  color: #166534;
}
</style> 