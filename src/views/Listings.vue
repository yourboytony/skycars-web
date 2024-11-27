<template>
  <div class="listings">
    <div class="listings-container">
      <div class="listings-header glass">
        <h1>My Listings</h1>
        <router-link to="/listings/new" class="new-listing-btn">
          <i class="fas fa-plus"></i> New Listing
        </router-link>
      </div>

      <!-- Filters and Search -->
      <div class="filters glass">
        <div class="search-bar">
          <i class="fas fa-search"></i>
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search listings..."
          >
        </div>

        <div class="filter-options">
          <select v-model="statusFilter">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="draft">Draft</option>
          </select>

          <select v-model="sortBy">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="price-high">Price: High to Low</option>
            <option value="price-low">Price: Low to High</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      <!-- Listings Grid -->
      <div v-if="!isLoading && filteredListings.length" class="listings-grid">
        <div 
          v-for="listing in filteredListings" 
          :key="listing.id" 
          class="listing-card glass"
        >
          <div class="listing-image">
            <img :src="listing.images[0]" :alt="listing.title">
            <span :class="['status-badge', listing.status]">
              {{ listing.status }}
            </span>
          </div>

          <div class="listing-content">
            <h3>{{ listing.title }}</h3>
            <p class="price">${{ formatPrice(listing.price) }}</p>
            
            <div class="listing-stats">
              <span><i class="fas fa-eye"></i> {{ listing.views }}</span>
              <span><i class="fas fa-heart"></i> {{ listing.favorites }}</span>
              <span><i class="fas fa-comment"></i> {{ listing.messages }}</span>
            </div>

            <div class="listing-actions">
              <router-link 
                :to="`/listings/${listing.id}/edit`" 
                class="edit-btn"
              >
                <i class="fas fa-edit"></i> Edit
              </router-link>
              <button 
                @click="toggleListingStatus(listing)" 
                class="toggle-btn"
              >
                {{ listing.status === 'active' ? 'Deactivate' : 'Activate' }}
              </button>
              <button 
                @click="deleteListing(listing.id)" 
                class="delete-btn"
              >
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-else-if="isLoading" class="loading-state glass">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading listings...</p>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state glass">
        <i class="fas fa-car"></i>
        <h2>No Listings Found</h2>
        <p>{{ 
          searchQuery 
            ? 'Try adjusting your search or filters' 
            : 'Create your first listing to get started' 
        }}</p>
        <router-link to="/listings/new" class="new-listing-btn">
          Create Listing
        </router-link>
      </div>

      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="modal-overlay">
        <div class="modal glass">
          <h2>Delete Listing</h2>
          <p>Are you sure you want to delete this listing? This action cannot be undone.</p>
          
          <div class="modal-actions">
            <button @click="showDeleteModal = false" class="cancel-btn">
              Cancel
            </button>
            <button 
              @click="confirmDelete" 
              class="confirm-delete-btn"
              :disabled="isDeleting"
            >
              {{ isDeleting ? 'Deleting...' : 'Delete Listing' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const listings = ref([])
const isLoading = ref(true)
const isDeleting = ref(false)
const showDeleteModal = ref(false)
const listingToDelete = ref(null)
const searchQuery = ref('')
const statusFilter = ref('')
const sortBy = ref('newest')

// Format price with commas
const formatPrice = (price) => {
  return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

// Filtered and sorted listings
const filteredListings = computed(() => {
  let result = [...listings.value]

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(listing => 
      listing.title.toLowerCase().includes(query) ||
      listing.description.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter.value) {
    result = result.filter(listing => 
      listing.status === statusFilter.value
    )
  }

  // Apply sorting
  switch (sortBy.value) {
    case 'oldest':
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      break
    case 'price-high':
      result.sort((a, b) => b.price - a.price)
      break
    case 'price-low':
      result.sort((a, b) => a.price - b.price)
      break
    case 'views':
      result.sort((a, b) => b.views - a.views)
      break
    default: // newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }

  return result
})

// Fetch listings
const fetchListings = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      listings.value = data.listings
    }
  } catch (error) {
    console.error('Failed to fetch listings:', error)
  } finally {
    isLoading.value = false
  }
}

// Toggle listing status
const toggleListingStatus = async (listing) => {
  try {
    const newStatus = listing.status === 'active' ? 'inactive' : 'active'
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${listing.id}/status`, 
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth.token}`
        },
        body: JSON.stringify({ status: newStatus })
      }
    )

    if (response.ok) {
      listing.status = newStatus
    }
  } catch (error) {
    console.error('Failed to update listing status:', error)
  }
}

// Delete listing
const deleteListing = (id) => {
  listingToDelete.value = id
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  try {
    isDeleting.value = true
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${listingToDelete.value}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      }
    )

    if (response.ok) {
      listings.value = listings.value.filter(
        listing => listing.id !== listingToDelete.value
      )
      showDeleteModal.value = false
    }
  } catch (error) {
    console.error('Failed to delete listing:', error)
  } finally {
    isDeleting.value = false
    listingToDelete.value = null
  }
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
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: opacity 0.2s;
}

.new-listing-btn:hover {
  opacity: 0.9;
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
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
}

.search-bar input {
  flex: 1;
  border: none;
  background: none;
  color: var(--text-color);
  font-size: 1rem;
}

.search-bar i {
  color: var(--text-light);
}

.filter-options {
  display: flex;
  gap: 1rem;
}

.filter-options select {
  padding: 0.5rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
  cursor: pointer;
}

.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.listing-card {
  overflow: hidden;
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

.status-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-transform: capitalize;
}

.status-badge.active {
  background: #10b981;
  color: white;
}

.status-badge.pending {
  background: #f59e0b;
  color: white;
}

.status-badge.sold {
  background: #6366f1;
  color: white;
}

.status-badge.draft {
  background: var(--text-light);
  color: white;
}

.listing-content {
  padding: 1.5rem;
}

.listing-content h3 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

.price {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--primary-color);
  margin: 0 0 1rem;
}

.listing-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.listing-stats span {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-light);
  font-size: 0.875rem;
}

.listing-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.toggle-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.edit-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  text-decoration: none;
}

.toggle-btn {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.delete-btn {
  background: #ef4444;
  color: white;
  border: none;
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
}

.modal-overlay {
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

.modal {
  width: 90%;
  max-width: 400px;
  padding: 2rem;
}

.modal h2 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.modal p {
  margin: 0 0 1.5rem;
  color: var(--text-light);
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn,
.confirm-delete-btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.cancel-btn {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.confirm-delete-btn {
  background: #ef4444;
  color: white;
  border: none;
}

.confirm-delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .listings {
    padding: 1rem;
  }

  .filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-options {
    flex-direction: column;
  }

  .filter-options select {
    width: 100%;
  }

  .listing-actions {
    flex-wrap: wrap;
  }

  .edit-btn,
  .toggle-btn,
  .delete-btn {
    flex: 1;
    justify-content: center;
  }
}
</style> 