<template>
  <div class="weights-panel">
    <!-- Aircraft Selection -->
    <div class="aircraft-selector">
      <h2>Weight & Balance Calculator</h2>
      <select v-model="selectedAircraft" @change="loadAircraftData">
        <option value="">Select Aircraft</option>
        <option 
          v-for="aircraft in aircraftTypes" 
          :key="aircraft.id" 
          :value="aircraft.id"
        >
          {{ aircraft.name }}
        </option>
      </select>
    </div>

    <div class="weight-calculator" v-if="selectedAircraft">
      <div class="calculator-grid">
        <!-- Payload Section -->
        <section class="weight-section payload-section">
          <h3>Payload</h3>
          
          <!-- Passengers -->
          <div class="weight-group">
            <h4>Passengers</h4>
            <div class="passenger-rows">
              <div 
                v-for="(row, index) in passengerRows" 
                :key="index"
                class="passenger-row"
              >
                <span class="row-label">Row {{ row.number }}</span>
                <input 
                  type="number" 
                  v-model="row.count"
                  min="0"
                  :max="row.maxSeats"
                  @input="calculateWeights"
                >
                <span class="weight-display">
                  {{ formatWeight(row.count * standardPassengerWeight) }}
                </span>
              </div>
            </div>
          </div>

          <!-- Cargo -->
          <div class="weight-group">
            <h4>Cargo</h4>
            <div class="cargo-compartments">
              <div 
                v-for="compartment in cargoCompartments"
                :key="compartment.id"
                class="cargo-input"
              >
                <label>{{ compartment.name }}</label>
                <input 
                  type="number"
                  v-model="compartment.weight"
                  min="0"
                  :max="compartment.maxWeight"
                  @input="calculateWeights"
                >
                <span class="weight-limit">
                  Max: {{ formatWeight(compartment.maxWeight) }}
                </span>
              </div>
            </div>
          </div>
        </section>

        <!-- Fuel Section -->
        <section class="weight-section fuel-section">
          <h3>Fuel</h3>
          
          <div class="fuel-calculator">
            <div class="fuel-input">
              <label>Block Fuel</label>
              <div class="input-group">
                <input 
                  type="number"
                  v-model="blockFuel"
                  @input="calculateFuel"
                >
                <select v-model="fuelUnit" @change="convertFuelUnits">
                  <option value="lbs">LBS</option>
                  <option value="kg">KG</option>
                  <option value="l">L</option>
                  <option value="gal">GAL</option>
                </select>
              </div>
            </div>

            <div class="fuel-breakdown">
              <div class="fuel-item">
                <span>Trip Fuel</span>
                <span>{{ formatWeight(tripFuel) }}</span>
              </div>
              <div class="fuel-item">
                <span>Contingency (5%)</span>
                <span>{{ formatWeight(contingencyFuel) }}</span>
              </div>
              <div class="fuel-item">
                <span>Alternate</span>
                <span>{{ formatWeight(alternateFuel) }}</span>
              </div>
              <div class="fuel-item">
                <span>Final Reserve</span>
                <span>{{ formatWeight(finalReserve) }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Weight Summary -->
        <section class="weight-section summary-section">
          <h3>Weight Summary</h3>
          
          <div class="weight-summary">
            <div class="summary-item">
              <span>Zero Fuel Weight</span>
              <span :class="{ 'weight-exceeded': isZfwExceeded }">
                {{ formatWeight(zfw) }}
              </span>
            </div>
            <div class="summary-item">
              <span>Take Off Weight</span>
              <span :class="{ 'weight-exceeded': isTowExceeded }">
                {{ formatWeight(tow) }}
              </span>
            </div>
            <div class="summary-item">
              <span>Landing Weight</span>
              <span :class="{ 'weight-exceeded': isLwExceeded }">
                {{ formatWeight(landingWeight) }}
              </span>
            </div>
          </div>

          <!-- Weight Limits -->
          <div class="weight-limits">
            <div class="limit-item">
              <span>Max ZFW:</span>
              <span>{{ formatWeight(maxZfw) }}</span>
            </div>
            <div class="limit-item">
              <span>Max TOW:</span>
              <span>{{ formatWeight(maxTow) }}</span>
            </div>
            <div class="limit-item">
              <span>Max LW:</span>
              <span>{{ formatWeight(maxLw) }}</span>
            </div>
          </div>
        </section>

        <!-- CG Graph -->
        <section class="weight-section cg-section">
          <h3>Center of Gravity</h3>
          
          <div class="cg-graph">
            <canvas ref="cgCanvas"></canvas>
          </div>

          <div class="cg-data">
            <div class="cg-item">
              <span>Current CG:</span>
              <span>{{ currentCg.toFixed(1) }}%</span>
            </div>
            <div class="cg-limits">
              <span>Fwd Limit: {{ cgLimits.forward }}%</span>
              <span>Aft Limit: {{ cgLimits.aft }}%</span>
            </div>
          </div>
        </section>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      <div class="loader"></div>
      <span>Loading aircraft data...</span>
    </div>

    <!-- No Aircraft Selected -->
    <div v-else class="no-selection">
      <i class="fas fa-plane"></i>
      <p>Select an aircraft to begin weight calculations</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, onUnmounted } from 'vue'

// Constants
const standardPassengerWeight = 185 // lbs
const maxZfw = 145000 // lbs
const maxTow = 174000 // lbs
const maxLw = 164000 // lbs

// State
const selectedAircraft = ref('')
const loading = ref(false)
const passengerRows = ref([])
const cargoCompartments = ref([])
const blockFuel = ref(0)
const fuelUnit = ref('lbs')
const cgCanvas = ref(null)
const cgChart = ref(null)

// Computed weights
const zfw = ref(0)
const tow = ref(0)
const landingWeight = ref(0)
const currentCg = ref(25)
const cgLimits = ref({ forward: 15, aft: 35 })

// Fuel calculations
const tripFuel = ref(0)
const contingencyFuel = ref(0)
const alternateFuel = ref(0)
const finalReserve = ref(0)

// State for chart
const chartInstance = ref(null)
const chartCanvas = ref(null)

// Methods
function formatWeight(weight) {
  return `${Math.round(weight).toLocaleString()} ${fuelUnit.value.toUpperCase()}`
}

function loadAircraftData() {
  loading.value = true
  // Simulate API call
  setTimeout(() => {
    // Load aircraft specific data
    loading.value = false
  }, 1000)
}

function calculateWeights() {
  // Calculate all weights and CG
  updateCgGraph()
}

function calculateFuel() {
  // Calculate fuel breakdown
  calculateWeights()
}

function convertFuelUnits() {
  // Convert between fuel units
  calculateFuel()
}

function updateCgGraph() {
  if (!cgChart.value) return
  
  // Update CG graph data
  cgChart.value.update()
}

// Initialize chart conditionally
async function initializeChart() {
  try {
    const { Chart } = await import('chart.js/auto')
    if (chartInstance.value) {
      chartInstance.value.destroy()
    }
    
    if (!chartCanvas.value) return

    chartInstance.value = new Chart(chartCanvas.value, {
      type: 'scatter',
      data: {
        datasets: [{
          label: 'CG Position',
          data: calculateCGPoints(),
          borderColor: '#2563eb',
          backgroundColor: '#2563eb',
          borderWidth: 2,
          pointRadius: 5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Weight (lbs)'
            }
          },
          y: {
            title: {
              display: true,
              text: 'CG (%MAC)'
            }
          }
        }
      }
    })
  } catch (error) {
    console.warn('Chart.js not available:', error)
    // Provide fallback UI for CG visualization
    const fallbackElement = document.createElement('div')
    fallbackElement.className = 'fallback-cg-display'
    fallbackElement.textContent = 'CG Graph: Loading visualization library...'
    chartCanvas.value?.parentElement?.appendChild(fallbackElement)
  }
}

// Lifecycle hooks
onMounted(() => {
  initializeChart()
})

// Clean up on unmount
onUnmounted(() => {
  if (chartInstance.value) {
    chartInstance.value.destroy()
  }
})

// Watchers
watch(selectedAircraft, loadAircraftData)
</script>

<style scoped>
.weights-panel {
  height: 100%;
  padding: 1.5rem;
  background: white;
  overflow-y: auto;
}

.calculator-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.weight-section {
  background: #f8fafc;
  border-radius: 12px;
  padding: 1.5rem;
}

.weight-group {
  margin-top: 1rem;
}

.passenger-rows,
.cargo-compartments {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.passenger-row,
.cargo-input {
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: 1rem;
  align-items: center;
}

.fuel-calculator {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.fuel-breakdown {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.fuel-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: white;
  border-radius: 6px;
}

.weight-summary {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background: white;
  border-radius: 8px;
  font-weight: 500;
}

.weight-exceeded {
  color: #dc2626;
}

.cg-graph {
  height: 300px;
  margin: 1rem 0;
}

input[type="number"] {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  width: 100px;
}

select {
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  background: white;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 1rem;
}

.loader {
  border: 3px solid #f3f3f3;
  border-top: 3px solid #2563eb;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Add responsive styles as needed */

/* Add fallback styling */
.fallback-cg-display {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: 1px dashed #e2e8f0;
  border-radius: 8px;
  color: #64748b;
}
</style> 