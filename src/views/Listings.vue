<template>
    <div class="listings">
      <div class="listings-container">
        <!-- Header with Credits -->
        <div class="listings-header glass">
          <div class="header-content">
            <h1>Flight Sim Licenses</h1>
            <div class="user-credits" v-if="auth.isAuthenticated()">
              <i class="fas fa-coins"></i>
              {{ marketplace.credits }} Credits
            </div>
          </div>
          <router-link to="/listings/new" class="new-listing-btn" v-if="auth.isAuthenticated()">
            <i class="fas fa-plus"></i> List License
          </router-link>
        </div>
  
        <!-- Filters -->
        <div class="filters glass">
          <div class="search-bar">
            <i class="fas fa-search"></i>
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search titles, developers..."
            >
          </div>
  
          <div class="filter-options">
            <select v-model="simulatorFilter">
              <option value="">All Simulators</option>
              <option value="msfs">Microsoft Flight Simulator</option>
              <option value="xplane">X-Plane</option>
              <option value="p3d">Prepar3D</option>
              <option value="fsx">FSX</option>
            </select>
  
            <select v-model="typeFilter">
              <option value="">All Types</option>
              <option value="airliner">Airliners</option>
              <option value="ga">General Aviation</option>
              <option value="military">Military</option>
              <option value="helicopter">Helicopters</option>
            </select>
  
            <select v-model="sortBy">
              <option value="newest">Newest First</option>
              <option value="price-high">Price: High to Low</option>
              <option value="price-low">Price: Low to High</option>
              <option value="popular">Most Popular</option>
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
                :src="listing.images?.[0] || `/simulators/${listing.simulator}.jpg`" 
                :alt="listing.title"
              >
              <span class="price">
                <i class="fas fa-coins"></i> {{ listing.price_credits }}
              </span>
            </div>
  
            <div class="listing-content">
              <h3>{{ listing.title }}</h3>
              <div class="listing-details">
                <span class="simulator">
                  <i :class="getSimulatorIcon(listing.simulator)"></i>
                  {{ getSimulatorName(listing.simulator) }}
                </span>
                <span class="developer">
                  <i class="fas fa-code"></i>
                  {{ listing.developer }}
                </span>
                <span class="type">
                  <i class="fas fa-plane"></i>
                  {{ formatType(listing.aircraft_type) }}
                </span>
              </div>
              
              <div class="listing-footer">
                <span class="seller">
                  <i class="fas fa-user"></i>
                  {{ listing.seller_name }}
                </span>
                <div class="stats">
                  <span class="views">
                    <i class="fas fa-eye"></i> {{ listing.views }}
                  </span>
                  <span 
                    class="favorites"
                    @click.stop="toggleFavorite(listing.id)"
                  >
                    <i 
                      :class="['fas', isFavorited(listing.id) ? 'fa-heart' : 'fa-heart-o']"
                      :style="{ color: isFavorited(listing.id) ? 'var(--primary-color)' : '' }"
                    ></i>
                    {{ listing.favorites }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        <!-- Loading State -->
        <div v-else-if="isLoading" class="loading-state glass">
          <i class="fas fa-spinner fa-spin"></i>
          <p>Loading licenses...</p>
        </div>
  
        <!-- Empty State -->
        <div v-else class="empty-state glass">
          <i class="fas fa-plane"></i>
          <h2>No Licenses Found</h2>
          <p>{{ 
            searchQuery 
              ? 'Try adjusting your search or filters' 
              : 'Be the first to list a license' 
          }}</p>
          <router-link 
            v-if="auth.isAuthenticated()" 
            to="/listings/new" 
            class="new-listing-btn"
          >
            List License
          </router-link>
          <router-link 
            v-else 
            to="/login" 
            class="login-btn"
          >
            Login to List License
          </router-link>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { useMarketplaceStore } from '../stores/marketplace'
  
  const router = useRouter()
  const auth = useAuthStore()
  const marketplace = useMarketplaceStore()
  
  const listings = ref([])
  const isLoading = ref(true)
  const searchQuery = ref('')
  const simulatorFilter = ref('')
  const typeFilter = ref('')
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
        listing.developer.toLowerCase().includes(query) ||
        listing.description?.toLowerCase().includes(query)
      )
    }
  
    // Apply simulator filter
    if (simulatorFilter.value) {
      filtered = filtered.filter(listing => 
        listing.simulator === simulatorFilter.value
      )
    }
  
    // Apply type filter
    if (typeFilter.value) {
      filtered = filtered.filter(listing => 
        listing.aircraft_type === typeFilter.value
      )
    }
  
    // Apply sorting
    switch (sortBy.value) {
      case 'price-high':
        filtered.sort((a, b) => b.price_credits - a.price_credits)
        break
      case 'price-low':
        filtered.sort((a, b) => a.price_credits - b.price_credits)
        break
      case 'popular':
        filtered.sort((a, b) => b.views - a.views)
        break
      default: // newest
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    }
  
    return filtered
  })
  
  // Helper functions
  function getSimulatorIcon(simulator) {
    const icons = {
      msfs: 'fas fa-plane',
      xplane: 'fas fa-times',
      p3d: 'fas fa-fighter-jet',
      fsx: 'fas fa-plane-departure'
    }
    return icons[simulator] || 'fas fa-plane'
  }
  
  function getSimulatorName(simulator) {
    const names = {
      msfs: 'Microsoft Flight Simulator',
      xplane: 'X-Plane',
      p3d: 'Prepar3D',
      fsx: 'FSX'
    }
    return names[simulator] || simulator
  }
  
  function formatType(type) {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }
  
  function isFavorited(listingId) {
    return marketplace.favorites.some(f => f.listing_id === listingId)
  }
  
  // Actions
  function viewListing(id) {
    router.push(`/listings/${id}`)
  }
  
  async function toggleFavorite(id) {
    if (!auth.isAuthenticated()) {
      router.push('/login')
      return
    }
    await marketplace.toggleFavorite(id)
  }
  
  onMounted(async () => {
    fetchListings()
    if (auth.isAuthenticated()) {
      await marketplace.fetchCredits()
      await marketplace.fetchFavorites()
    }
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
  
  /* Header */
  .listings-header {
    padding: 2rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-content {
    display: flex;
    align-items: center;
    gap: 2rem;
  }
  
  .header-content h1 {
    margin: 0;
    color: var(--text-color);
  }
  
  .user-credits {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--primary-color);
    font-size: 1.25rem;
    font-weight: 500;
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
    transition: transform 0.2s;
  }
  
  .new-listing-btn:hover {
    transform: translateY(-2px);
  }
  
  /* Filters */
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
    cursor: pointer;
  }
  
  /* Listings Grid */
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
    border-radius: 0.5rem 0.5rem 0 0;
  }
  
  .listing-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .listing-image .price {
    position: absolute;
    bottom: 0.5rem;
    right: 0.5rem;
    background: rgba(0, 0, 0, 0.75);
    color: white;
    padding: 0.5rem 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 0.25rem;
  }
  
  .listing-content {
    padding: 1rem;
  }
  
  .listing-content h3 {
    margin: 0 0 0.75rem;
    color: var(--text-color);
    font-size: 1.125rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .listing-details {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
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
    padding-top: 0.75rem;
    border-top: 1px solid var(--border-color);
  }
  
  .seller {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-light);
    font-size: 0.875rem;
  }
  
  .stats {
    display: flex;
    gap: 1rem;
  }
  
  .stats span {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: var(--text-light);
    font-size: 0.875rem;
  }
  
  .stats .favorites {
    cursor: pointer;
  }
  
  /* Loading & Empty States */
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
  
  /* Responsive Design */
  @media (max-width: 768px) {
    .listings {
      padding: 1rem;
    }
  
    .listings-header {
      flex-direction: column;
      gap: 1rem;
      text-align: center;
    }
  
    .header-content {
      flex-direction: column;
      gap: 1rem;
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