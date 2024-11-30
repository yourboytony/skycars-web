<template>
  <div class="flight-history">
    <div class="history-header">
      <h1>Flight History</h1>
      <div class="header-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search flights..."
          >
        </div>
        <button class="btn-secondary">
          <i class="fas fa-filter"></i> Filter
        </button>
        <button class="btn-secondary">
          <i class="fas fa-download"></i> Export
        </button>
      </div>
    </div>

    <div class="flights-table">
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Route</th>
            <th>Aircraft</th>
            <th>Duration</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="flight in flights" :key="flight.id">
            <td>{{ flight.date }}</td>
            <td>{{ flight.departure }} → {{ flight.arrival }}</td>
            <td>{{ flight.aircraft }}</td>
            <td>{{ flight.duration }}</td>
            <td>
              <span :class="['status-badge', flight.status]">
                {{ flight.status }}
              </span>
            </td>
            <td>
              <router-link 
                :to="`/flight/${flight.id}`"
                class="action-link"
              >
                View Details
              </router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination">
      <!-- Pagination controls -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const searchQuery = ref('')
const flights = ref([
  {
    id: 1,
    date: '2024-01-24',
    departure: 'KJFK',
    arrival: 'KLAX',
    aircraft: 'N12345',
    duration: '5h 30m',
    status: 'completed'
  }
  // More flights...
])

onMounted(async () => {
  // TODO: Fetch flight history
})
</script>

<style scoped>
.flight-history {
  padding: 24px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 6px;
}

.search-box input {
  border: none;
  outline: none;
  width: 200px;
}

.flights-table {
  background: white;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
}

th {
  background: #f8fafc;
  font-weight: 500;
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

.action-link {
  color: var(--primary);
  text-decoration: none;
}

.action-link:hover {
  text-decoration: underline;
}
</style> 