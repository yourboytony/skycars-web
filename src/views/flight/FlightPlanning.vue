<template>
  <div class="flight-planning">
    <!-- Header -->
    <div class="planning-header">
      <h1>Flight Planning</h1>
      <div class="header-actions">
        <button 
          class="btn-secondary" 
          @click="loadFromSimBrief"
          :disabled="!hasSimBriefCredentials"
        >
          <PlaceholderIcon 
            type="simbrief" 
            size="sm"
          />
          Import from SimBrief
        </button>
        <button class="btn-primary" @click="generateFlightPlan" :disabled="!isValid">
          <i class="fas fa-paper-plane"></i> Generate Flight Plan
        </button>
      </div>
    </div>

    <!-- Main Planning Form -->
    <div class="planning-grid">
      <!-- Route Section -->
      <div class="planning-card">
        <h2>Route Information</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Departure</label>
            <div class="airport-input">
              <input 
                type="text" 
                v-model="flightPlan.departure"
                placeholder="ICAO"
                @input="fetchDepartureData"
                maxlength="4"
              >
              <span class="airport-name">{{ departureAirport?.name || '' }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label>Arrival</label>
            <div class="airport-input">
              <input 
                type="text" 
                v-model="flightPlan.arrival"
                placeholder="ICAO"
                @input="fetchArrivalData"
                maxlength="4"
              >
              <span class="airport-name">{{ arrivalAirport?.name || '' }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Alternate</label>
            <div class="airport-input">
              <input 
                type="text" 
                v-model="flightPlan.alternate"
                placeholder="ICAO"
                @input="fetchAlternateData"
                maxlength="4"
              >
              <span class="airport-name">{{ alternateAirport?.name || '' }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>Route</label>
            <textarea 
              v-model="flightPlan.route"
              placeholder="Enter route or select from saved routes"
              rows="3"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- Aircraft Section -->
      <div class="planning-card">
        <h2>Aircraft Details</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Aircraft Type</label>
            <select v-model="flightPlan.aircraftType">
              <option value="">Select Aircraft</option>
              <option v-for="aircraft in aircraftTypes" :key="aircraft.id" :value="aircraft.id">
                {{ aircraft.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label>Registration</label>
            <input 
              type="text" 
              v-model="flightPlan.registration"
              placeholder="Aircraft registration"
            >
          </div>

          <div class="form-group">
            <label>Equipment Suffix</label>
            <input 
              type="text" 
              v-model="flightPlan.equipmentSuffix"
              placeholder="e.g., /L"
            >
          </div>
        </div>
      </div>

      <!-- Flight Details -->
      <div class="planning-card">
        <h2>Flight Details</h2>
        <div class="form-grid">
          <div class="form-group">
            <label>Flight Rules</label>
            <select v-model="flightPlan.flightRules">
              <option value="IFR">IFR</option>
              <option value="VFR">VFR</option>
            </select>
          </div>

          <div class="form-group">
            <label>Flight Number</label>
            <input 
              type="text" 
              v-model="flightPlan.flightNumber"
              placeholder="Optional flight number"
            >
          </div>

          <div class="form-group">
            <label>Cruise Level</label>
            <input 
              type="text" 
              v-model="flightPlan.cruiseLevel"
              placeholder="e.g., FL330"
            >
          </div>

          <div class="form-group">
            <label>Cruise Speed</label>
            <input 
              type="text" 
              v-model="flightPlan.cruiseSpeed"
              placeholder="e.g., N0450"
            >
          </div>
        </div>
      </div>

      <!-- Weather Summary -->
      <div class="planning-card">
        <h2>Weather Summary</h2>
        <div class="weather-grid">
          <div class="weather-item" v-if="departureWeather">
            <h3>Departure ({{ flightPlan.departure }})</h3>
            <div class="weather-data">
              <pre>{{ departureWeather.metar }}</pre>
              <pre>{{ departureWeather.taf }}</pre>
            </div>
          </div>

          <div class="weather-item" v-if="arrivalWeather">
            <h3>Arrival ({{ flightPlan.arrival }})</h3>
            <div class="weather-data">
              <pre>{{ arrivalWeather.metar }}</pre>
              <pre>{{ arrivalWeather.taf }}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useUserStore } from '@/stores/user'
import PlaceholderIcon from '@/components/PlaceholderIcon.vue'

const userStore = useUserStore()

const flightPlan = ref({
  departure: '',
  arrival: '',
  alternate: '',
  route: '',
  aircraftType: '',
  registration: '',
  equipmentSuffix: '',
  flightRules: 'IFR',
  flightNumber: '',
  cruiseLevel: '',
  cruiseSpeed: ''
})

const departureAirport = ref(null)
const arrivalAirport = ref(null)
const alternateAirport = ref(null)
const departureWeather = ref(null)
const arrivalWeather = ref(null)

const aircraftTypes = ref([
  { id: 'B738', name: 'Boeing 737-800' },
  { id: 'A320', name: 'Airbus A320' },
  // Add more aircraft types
])

const hasSimBriefCredentials = computed(() => {
  return userStore.integrations.simbrief.isConnected
})

const isValid = computed(() => {
  return flightPlan.value.departure && 
         flightPlan.value.arrival && 
         flightPlan.value.aircraftType
})

async function fetchDepartureData() {
  if (flightPlan.value.departure.length === 4) {
    // TODO: Fetch airport data and weather
  }
}

async function fetchArrivalData() {
  if (flightPlan.value.arrival.length === 4) {
    // TODO: Fetch airport data and weather
  }
}

async function fetchAlternateData() {
  if (flightPlan.value.alternate.length === 4) {
    // TODO: Fetch airport data
  }
}

async function loadFromSimBrief() {
  // TODO: Import from SimBrief
}

async function generateFlightPlan() {
  // TODO: Generate flight plan
}
</script>

<style scoped>
.flight-planning {
  padding: 24px;
}

.planning-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.planning-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.planning-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.form-grid {
  display: grid;
  gap: 20px;
  margin-top: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 500;
  color: var(--text-secondary);
}

.airport-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.airport-input input {
  text-transform: uppercase;
}

.airport-name {
  font-size: 12px;
  color: var(--text-secondary);
}

input, select, textarea {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

textarea {
  resize: vertical;
  min-height: 80px;
}

.weather-grid {
  display: grid;
  gap: 20px;
  margin-top: 16px;
}

.weather-item h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.weather-data {
  background: #f8fafc;
  padding: 12px;
  border-radius: 6px;
  font-family: monospace;
  font-size: 14px;
}

pre {
  margin: 0;
  white-space: pre-wrap;
}

@media (max-width: 768px) {
  .planning-grid {
    grid-template-columns: 1fr;
  }
}

.simbrief-import {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: white;
  cursor: pointer;
}

.simbrief-import:hover {
  background: #f8fafc;
}
</style> 