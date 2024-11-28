<template>
  <div class="listings">
    <div class="listings-container">
      <div class="listings-header glass">
        <h1>Aircraft Listings</h1>
        <router-link to="/listings/new" class="new-listing-btn" v-if="auth.isAuthenticated()">
          <i class="fas fa-plus"></i> List Aircraft
        </router-link>
      </div>

      <!-- Filters -->
      <div class="filters glass">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search by manufacturer, model..."
          >
        </div>

        <div class="filter-options">
          <select v-model="categoryFilter">
            <option value="">All Categories</option>
            <option value="single-engine">Single Engine</option>
            <option value="multi-engine">Multi Engine</option>
            <option value="turboprop">Turboprop</option>
            <option value="jet">Jet</option>
            <option value="helicopter">Helicopter</option>
          </select>

          <select v-model="sortBy">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="year-new">Year: Newest First</option>
            <option value="year-old">Year: Oldest First</option>
          </select>
        </div>
      </div>

      <!-- Listings Grid -->
      <div v-if="!isLoading && filteredListings.length" class="listings-grid">
        <div 
          v-for="listing in filteredListings" 
          :key="listing.id" 
          class="listing-card glass"
          @click="viewListing(listing.id)"
        >
          <div class="listing-image">
            <img 
              :src="listing.images?.[0] || '/placeholder-aircraft.jpg'" 
              :alt="listing.title"
            >
            <span class="price">${{ formatPrice(listing.price) }}</span>
          </div>

          <div class="listing-content">
            <h3>{{ listing.title }}</h3>
            <div class="listing-details">
              <span><i class="fas fa-plane"></i> {{ listing.manufacturer }}</span>
              <span><i class="fas fa-calendar"></i> {{ listing.year }}</span>
              <span><i class="fas fa-clock"></i> {{ listing.total_time }}hrs</span>
            </div>
            
            <div class="listing-footer">
              <span class="location">
                <i class="fas fa-map-marker-alt"></i> {{ listing.location }}
              </span>
              <span class="views">
                <i class="fas fa-eye"></i> {{ listing.views }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="loading-state glass">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading aircraft listings...</p>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state glass">
        <i class="fas fa-plane"></i>
        <h2>No Aircraft Found</h2>
        <p>{{ 
          searchQuery 
            ? 'Try adjusting your search or filters' 
            : 'Be the first to list an aircraft' 
        }}</p>
        <router-link 
          v-if="auth.isAuthenticated()" 
          to="/listings/new" 
          class="new-listing-btn"
        >
          List Aircraft
        </router-link>
        <router-link 
          v-else 
          to="/login" 
          class="login-btn"
        >
          Login to List Aircraft
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const listings = ref([])
const isLoading = ref(true)
const searchQuery = ref('')
const categoryFilter = ref('')
const sortBy = ref('newest')

// Fetch listings
async function fetchListings() {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`)
    const data = await response.json()
    
    if (!response.ok) throw new Error(data.error)
    
    listings.value = data.listings
  } catch (error) {
    console.error('Failed to fetch listings:', error)
  } finally {
    isLoading.value = false
  }
}

// Filter and sort listings
const filteredListings = computed(() => {
  let filtered = [...listings.value]

  // Apply search
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(listing => 
      listing.title.toLowerCase().includes(query) ||
      listing.manufacturer.toLowerCase().includes(query) ||
      listing.model.toLowerCase().includes(query)
    )
  }

  // Apply category filter
  if (categoryFilter.value) {
    filtered = filtered.filter(listing => 
      listing.category === categoryFilter.value
    )
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'oldest':
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price)
      break
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price)
      break
    case 'year-new':
      filtered.sort((a, b) => b.year - a.year)
      break
    case 'year-old':
      filtered.sort((a, b) => a.year - b.year)
      break
    default: // newest
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  }

  return filtered
})

// Format price
function formatPrice(price) {
  return new Intl.NumberFormat('en-US').format(price)
}

// View listing
function viewListing(id) {
  router.push(`/listings/${id}`)
}

onMounted(() => {
  fetchListings()
})
</script>

<style scoped>
.listings {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.listings-container {
  max-width: 1200px;
  margin: 0 auto;
  padding-top: 60px;
}

.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.listings-header {
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.listings-header h1 {
  margin: 0;
  color: var(--text-color);
}

.new-listing-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: 0.5rem;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.filters {
  padding: 1.5rem;
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--background-secondary);
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.search-bar input {
  flex: 1;
  background: none;
  border: none;
  color: var(--text-color);
  font-size: 1rem;
}

.search-bar input:focus {
  outline: none;
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-options select {
  padding: 0.75rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  font-size: 0.875rem;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.listing-card {
  cursor: pointer;
  transition: transform 0.2s;
  overflow: hidden;
}

.listing-card:hover {
  transform: translateY(-4px);
}

.listing-image {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
}

.listing-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.price {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
}

.listing-content {
  padding: 1.5rem;
}

.listing-content h3 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.listing-details {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.listing-details span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-light);
  font-size: 0.875rem;
}

.listing-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-light);
  font-size: 0.875rem;
}

.loading-state,
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-light);
}

.loading-state i,
.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.empty-state h2 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

.empty-state p {
  margin: 0 0 1.5rem;
}

.login-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
  border-radius: 0.5rem;
  text-decoration: none;
}

@media (max-width: 768px) {
  .listings {
    padding: 1rem;
  }

  .listings-header {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .filters {
    flex-direction: column;
  }

  .filter-options {
    width: 100%;
  }

  .filter-options select {
    flex: 1;
  }

  .listings-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style> 