<template>
  <div class="aircraft-page">
    <!-- Header -->
    <div class="aircraft-header">
      <h1>Aircraft Library</h1>
      <div class="header-actions">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery"
            placeholder="Search aircraft..."
          >
        </div>
        <button class="btn-secondary">
          <i class="fas fa-filter"></i> Filter
        </button>
        <button class="btn-primary" @click="showAddAircraft = true">
          <i class="fas fa-plus"></i> Add Aircraft
        </button>
      </div>
    </div>

    <!-- Aircraft Grid -->
    <div class="aircraft-grid">
      <!-- Favorite Aircraft Section -->
      <div class="aircraft-section" v-if="favoriteAircraft.length">
        <h2>Favorite Aircraft</h2>
        <div class="aircraft-cards">
          <div 
            v-for="aircraft in favoriteAircraft" 
            :key="aircraft.id"
            class="aircraft-card"
          >
            <div class="aircraft-image">
              <img :src="aircraft.image" :alt="aircraft.type">
              <button 
                class="favorite-btn active"
                @click="toggleFavorite(aircraft)"
              >
                <i class="fas fa-star"></i>
              </button>
            </div>
            <div class="aircraft-info">
              <h3>{{ aircraft.type }}</h3>
              <p class="registration">{{ aircraft.registration }}</p>
              <div class="specs">
                <span><i class="fas fa-plane"></i> {{ aircraft.category }}</span>
                <span><i class="fas fa-tachometer-alt"></i> {{ aircraft.engine }}</span>
              </div>
            </div>
            <div class="card-actions">
              <router-link 
                :to="`/aircraft/${aircraft.id}`"
                class="btn-secondary"
              >
                Details
              </router-link>
              <button 
                class="btn-primary"
                @click="planFlight(aircraft)"
              >
                Plan Flight
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- All Aircraft -->
      <div class="aircraft-section">
        <h2>All Aircraft</h2>
        <div class="aircraft-cards">
          <div 
            v-for="aircraft in filteredAircraft" 
            :key="aircraft.id"
            class="aircraft-card"
          >
            <div class="aircraft-image">
              <img :src="aircraft.image" :alt="aircraft.type">
              <button 
                class="favorite-btn"
                :class="{ active: aircraft.isFavorite }"
                @click="toggleFavorite(aircraft)"
              >
                <i class="fas fa-star"></i>
              </button>
            </div>
            <div class="aircraft-info">
              <h3>{{ aircraft.type }}</h3>
              <p class="registration">{{ aircraft.registration }}</p>
              <div class="specs">
                <span><i class="fas fa-plane"></i> {{ aircraft.category }}</span>
                <span><i class="fas fa-tachometer-alt"></i> {{ aircraft.engine }}</span>
              </div>
            </div>
            <div class="card-actions">
              <router-link 
                :to="`/aircraft/${aircraft.id}`"
                class="btn-secondary"
              >
                Details
              </router-link>
              <button 
                class="btn-primary"
                @click="planFlight(aircraft)"
              >
                Plan Flight
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Aircraft Modal -->
    <div class="modal" v-if="showAddAircraft">
      <div class="modal-content">
        <div class="modal-header">
          <h2>Add New Aircraft</h2>
          <button @click="showAddAircraft = false" class="close-btn">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="addAircraft" class="aircraft-form">
            <div class="form-grid">
              <div class="form-group">
                <label>Aircraft Type</label>
                <input 
                  type="text" 
                  v-model="newAircraft.type"
                  required
                  placeholder="e.g., B738"
                >
              </div>
              <div class="form-group">
                <label>Registration</label>
                <input 
                  type="text" 
                  v-model="newAircraft.registration"
                  required
                  placeholder="e.g., N12345"
                >
              </div>
              <div class="form-group">
                <label>Category</label>
                <select v-model="newAircraft.category" required>
                  <option value="Commercial">Commercial</option>
                  <option value="General Aviation">General Aviation</option>
                  <option value="Military">Military</option>
                </select>
              </div>
              <div class="form-group">
                <label>Engine Type</label>
                <select v-model="newAircraft.engine" required>
                  <option value="Jet">Jet</option>
                  <option value="Turboprop">Turboprop</option>
                  <option value="Piston">Piston</option>
                </select>
              </div>
            </div>
            <div class="form-actions">
              <button 
                type="button" 
                class="btn-secondary"
                @click="showAddAircraft = false"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                class="btn-primary"
                :disabled="isLoading"
              >
                {{ isLoading ? 'Adding...' : 'Add Aircraft' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = useRouter()
const userStore = useUserStore()

const searchQuery = ref('')
const showAddAircraft = ref(false)
const isLoading = ref(false)

const newAircraft = ref({
  type: '',
  registration: '',
  category: '',
  engine: ''
})

// Mock data
const aircraft = ref([
  {
    id: 1,
    type: 'Boeing 737-800',
    registration: 'N12345',
    category: 'Commercial',
    engine: 'Jet',
    image: '/aircraft/b738.jpg',
    isFavorite: true
  },
  {
    id: 2,
    type: 'Cessna 172',
    registration: 'N54321',
    category: 'General Aviation',
    engine: 'Piston',
    image: '/aircraft/c172.jpg',
    isFavorite: false
  }
])

const favoriteAircraft = computed(() => {
  return aircraft.value.filter(a => a.isFavorite)
})

const filteredAircraft = computed(() => {
  if (!searchQuery.value) return aircraft.value
  
  const query = searchQuery.value.toLowerCase()
  return aircraft.value.filter(a => 
    a.type.toLowerCase().includes(query) ||
    a.registration.toLowerCase().includes(query)
  )
})

function toggleFavorite(aircraft) {
  aircraft.isFavorite = !aircraft.isFavorite
  // TODO: Update in store/backend
}

function planFlight(aircraft) {
  router.push({
    name: 'FlightPlanning',
    query: { aircraft: aircraft.id }
  })
}

async function addAircraft() {
  try {
    isLoading.value = true
    // TODO: Add aircraft to backend
    showAddAircraft.value = false
  } catch (error) {
    console.error('Failed to add aircraft:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.aircraft-page {
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

.aircraft-section {
  margin-bottom: 32px;
}

.aircraft-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

.aircraft-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: var(--shadow-sm);
  transition: transform 0.2s;
}

.aircraft-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.aircraft-image {
  position: relative;
  height: 200px;
}

.aircraft-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.favorite-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: white;
  border: none;
  border-radius: 100%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
}

.favorite-btn i {
  color: #94a3b8;
}

.favorite-btn.active i {
  color: #eab308;
}

.aircraft-info {
  padding: 16px;
}

.registration {
  color: var(--text-secondary);
  margin: 4px 0 12px;
}

.specs {
  display: flex;
  gap: 16px;
  color: var(--text-secondary);
  font-size: 14px;
}

.specs i {
  margin-right: 4px;
}

.card-actions {
  padding: 16px;
  display: flex;
  gap: 12px;
  border-top: 1px solid var(--border-color);
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 20px;
}

.aircraft-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media (max-width: 768px) {
  .aircraft-cards {
    grid-template-columns: 1fr;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style> 