<template>
  <div class="planning-view">
    <h1>Flight Planning</h1>
    
    <div class="planning-container">
      <div class="flight-form">
        <h2>Create Flight Plan</h2>
        <form @submit.prevent="createFlightPlan">
          <div class="form-group">
            <label>Departure ICAO</label>
            <input v-model="flightPlan.departure" type="text" placeholder="KJFK">
          </div>
          
          <div class="form-group">
            <label>Arrival ICAO</label>
            <input v-model="flightPlan.arrival" type="text" placeholder="KLAX">
          </div>
          
          <div class="form-group">
            <label>Aircraft Type</label>
            <input v-model="flightPlan.aircraft" type="text" placeholder="B738">
          </div>
          
          <div class="form-group">
            <label>Cruise Level</label>
            <input v-model="flightPlan.cruiseLevel" type="text" placeholder="FL350">
          </div>
          
          <button type="submit" class="btn-primary">Generate Flight Plan</button>
          <button type="button" class="btn-secondary" @click="exportToSimBrief">
            Export to SimBrief
          </button>
        </form>
      </div>
      
      <div class="route-display">
        <h2>Route Information</h2>
        <div v-if="route" class="route-info">
          <pre>{{ route }}</pre>
        </div>
        <div v-else class="placeholder">
          Route information will appear here
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Planning',
  data() {
    return {
      flightPlan: {
        departure: '',
        arrival: '',
        aircraft: '',
        cruiseLevel: ''
      },
      route: null
    }
  },
  methods: {
    createFlightPlan() {
      // Implement flight plan generation
    },
    exportToSimBrief() {
      // Implement SimBrief export
    }
  }
}
</script>

<style scoped>
.planning-view {
  padding: 2rem;
}

.planning-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 2rem;
}

.flight-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.route-display {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.route-info pre {
  white-space: pre-wrap;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 4px;
}

.placeholder {
  color: #6b7280;
  text-align: center;
  padding: 2rem;
}

.btn-primary, .btn-secondary {
  width: 100%;
  padding: 0.75rem;
  border-radius: 4px;
  margin-top: 1rem;
  cursor: pointer;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-secondary {
  background: white;
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
}
</style> 