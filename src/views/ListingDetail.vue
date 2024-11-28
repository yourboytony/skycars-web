<template>
  <div class="listing-detail">
    <div class="listing-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state glass">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading listing details...</p>
      </div>

      <template v-else-if="listing">
        <!-- Header -->
        <div class="listing-header glass">
          <h1>{{ listing.title }}</h1>
          <div class="header-details">
            <span class="price">${{ formatPrice(listing.price) }}</span>
            <span class="location">
              <i class="fas fa-map-marker-alt"></i> {{ listing.location }}
            </span>
            <span class="views">
              <i class="fas fa-eye"></i> {{ listing.views }} views
            </span>
          </div>
        </div>

        <!-- Main Content -->
        <div class="listing-content">
          <!-- Images -->
          <div class="listing-images glass">
            <img 
              :src="listing.images?.[0] || '/placeholder-aircraft.jpg'" 
              :alt="listing.title"
              class="main-image"
            >
            <div class="thumbnail-grid" v-if="listing.images?.length > 1">
              <img 
                v-for="(image, index) in listing.images.slice(1)" 
                :key="index"
                :src="image"
                :alt="`${listing.title} - Image ${index + 2}`"
                @click="setMainImage(index + 1)"
              >
            </div>
          </div>

          <!-- Details -->
          <div class="listing-info glass">
            <div class="info-section">
              <h2>Aircraft Details</h2>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">Manufacturer</span>
                  <span class="value">{{ listing.manufacturer }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Model</span>
                  <span class="value">{{ listing.model }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Year</span>
                  <span class="value">{{ listing.year }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Category</span>
                  <span class="value">{{ formatCategory(listing.category) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Registration</span>
                  <span class="value">{{ listing.registration || 'Not provided' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Condition</span>
                  <span class="value">{{ formatCondition(listing.condition) }}</span>
                </div>
                <div class="info-item">
                  <span class="label">Total Time</span>
                  <span class="value">{{ listing.total_time || 0 }} hours</span>
                </div>
                <div class="info-item">
                  <span class="label">Engine Hours</span>
                  <span class="value">{{ listing.engine_hours || 0 }} hours</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h2>Description</h2>
              <p class="description">{{ listing.description }}</p>
            </div>
          </div>

          <!-- Contact Section -->
          <div class="contact-section glass">
            <div class="seller-info">
              <div class="avatar">{{ getInitials(listing.owner_name) }}</div>
              <div class="seller-details">
                <h3>{{ listing.owner_name }}</h3>
                <p>Member since {{ formatDate(listing.owner_joined) }}</p>
              </div>
            </div>

            <div class="contact-actions">
              <button 
                class="contact-btn primary" 
                @click="contactSeller"
                :disabled="!auth.isAuthenticated()"
              >
                <i class="fas fa-envelope"></i>
                Contact Seller
              </button>
              <button 
                class="contact-btn secondary"
                @click="toggleFavorite"
                :disabled="!auth.isAuthenticated()"
              >
                <i :class="['fas', isFavorite ? 'fa-heart' : 'fa-heart-o']"></i>
                {{ isFavorite ? 'Saved' : 'Save' }}
              </button>
            </div>

            <p v-if="!auth.isAuthenticated()" class="login-prompt">
              Please <router-link to="/login">login</router-link> to contact the seller
            </p>
          </div>
        </div>

        <!-- Similar Listings -->
        <div class="similar-listings glass" v-if="similarListings.length">
          <h2>Similar Aircraft</h2>
          <div class="similar-grid">
            <div 
              v-for="similar in similarListings" 
              :key="similar.id"
              class="similar-card"
              @click="viewListing(similar.id)"
            >
              <img 
                :src="similar.images?.[0] || '/placeholder-aircraft.jpg'" 
                :alt="similar.title"
              >
              <div class="similar-info">
                <h3>{{ similar.title }}</h3>
                <p class="similar-price">${{ formatPrice(similar.price) }}</p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Error State -->
      <div v-else-if="error" class="error-state glass">
        <i class="fas fa-exclamation-circle"></i>
        <h2>{{ error }}</h2>
        <router-link to="/listings" class="back-btn">
          Back to Listings
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const listing = ref(null)
const isLoading = ref(true)
const error = ref(null)
const isFavorite = ref(false)
const similarListings = ref([])

// Fetch listing details
async function fetchListing() {
  try {
    isLoading.value = true
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${route.params.id}`
    )
    const data = await response.json()

    if (!response.ok) throw new Error(data.error)
    
    listing.value = data.listing
    fetchSimilarListings()
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Fetch similar listings
async function fetchSimilarListings() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings?category=${listing.value.category}&exclude=${listing.value.id}`
    )
    const data = await response.json()
    
    if (!response.ok) throw new Error(data.error)
    
    similarListings.value = data.listings.slice(0, 3)
  } catch (err) {
    console.error('Failed to fetch similar listings:', err)
  }
}

// Format helpers
function formatPrice(price) {
  return new Intl.NumberFormat('en-US').format(price)
}

function formatCategory(category) {
  return category
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatCondition(condition) {
  return condition.charAt(0).toUpperCase() + condition.slice(1)
}

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
}

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Actions
async function toggleFavorite() {
  if (!auth.isAuthenticated()) {
    router.push('/login')
    return
  }

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${listing.value.id}/favorite`,
      {
        method: isFavorite.value ? 'DELETE' : 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      }
    )

    if (!response.ok) throw new Error('Failed to update favorite')
    
    isFavorite.value = !isFavorite.value
  } catch (err) {
    console.error('Failed to toggle favorite:', err)
  }
}

function contactSeller() {
  if (!auth.isAuthenticated()) {
    router.push('/login')
    return
  }
  
  // We'll implement messaging in the next update
  alert('Messaging feature coming soon!')
}

function viewListing(id) {
  router.push(`/listings/${id}`)
}

onMounted(() => {
  fetchListing()
})
</script>

<style scoped>
.listing-detail {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.listing-container {
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

.listing-header {
  padding: 2rem;
  margin-bottom: 2rem;
}

.listing-header h1 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.header-details {
  display: flex;
  gap: 2rem;
  color: var(--text-light);
}

.price {
  font-size: 1.5rem;
  font-weight: 500;
  color: var(--primary-color);
}

.listing-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.listing-images {
  padding: 1rem;
}

.main-image {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.thumbnail-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

.thumbnail-grid img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: opacity 0.2s;
}

.thumbnail-grid img:hover {
  opacity: 0.8;
}

.listing-info {
  padding: 2rem;
}

.info-section {
  margin-bottom: 2rem;
}

.info-section h2 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.label {
  color: var(--text-light);
  font-size: 0.875rem;
}

.value {
  color: var(--text-color);
}

.description {
  color: var(--text-color);
  line-height: 1.6;
  white-space: pre-line;
}

.contact-section {
  padding: 2rem;
  grid-column: 2;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.avatar {
  width: 3rem;
  height: 3rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
}

.seller-details h3 {
  margin: 0;
  color: var(--text-color);
}

.seller-details p {
  margin: 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

.contact-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.contact-btn {
  width: 100%;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.contact-btn.primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.contact-btn.secondary {
  background: var(--background-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.contact-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-prompt {
  margin: 1rem 0 0;
  text-align: center;
  color: var(--text-light);
  font-size: 0.875rem;
}

.login-prompt a {
  color: var(--primary-color);
  text-decoration: none;
}

.similar-listings {
  padding: 2rem;
}

.similar-listings h2 {
  margin: 0 0 1.5rem;
  color: var(--text-color);
}

.similar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.similar-card {
  cursor: pointer;
  transition: transform 0.2s;
}

.similar-card:hover {
  transform: translateY(-4px);
}

.similar-card img {
  width: 100%;
  aspect-ratio: 16/9;
  object-fit: cover;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
}

.similar-info h3 {
  margin: 0 0 0.5rem;
  color: var(--text-color);
}

.similar-price {
  margin: 0;
  color: var(--primary-color);
  font-weight: 500;
}

@media (max-width: 1024px) {
  .listing-content {
    grid-template-columns: 1fr;
  }

  .contact-section {
    grid-column: 1;
  }

  .similar-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .listing-detail {
    padding: 1rem;
  }

  .header-details {
    flex-direction: column;
    gap: 1rem;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .similar-grid {
    grid-template-columns: 1fr;
  }
}
</style> 