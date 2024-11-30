<template>
  <div class="listing-detail">
    <div class="listing-container">
      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state glass">
        <i class="fas fa-spinner fa-spin"></i>
        <p>Loading license details...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state glass">
        <i class="fas fa-exclamation-circle"></i>
        <h2>{{ error }}</h2>
        <router-link to="/listings" class="back-btn">
          Back to Listings
        </router-link>
      </div>

      <template v-else-if="listing">
        <!-- Header -->
        <div class="listing-header glass">
          <div class="header-content">
            <h1>{{ listing.title }}</h1>
            <div class="header-details">
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
          </div>
          
          <div class="price-section">
            <div class="price">
              <i class="fas fa-coins"></i>
              {{ listing.price_credits }} Credits
            </div>
            <div v-if="auth.isAuthenticated()" class="your-credits">
              Your Credits: {{ marketplace.credits }}
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="listing-content">
          <!-- Description -->
          <div class="description-section glass">
            <h2>Description</h2>
            <p class="description">{{ listing.description }}</p>
          </div>

          <!-- Images -->
          <div v-if="listing.images?.length" class="images-section glass">
            <h2>Images</h2>
            <div class="image-gallery">
              <img 
                v-for="(image, index) in listing.images"
                :key="index"
                :src="image"
                :alt="`${listing.title} - Image ${index + 1}`"
                @click="openImageViewer(index)"
              >
            </div>
          </div>

          <!-- Seller Info -->
          <div class="seller-section glass">
            <h2>Seller Information</h2>
            <div class="seller-info">
              <div class="seller-avatar">
                {{ getInitials(listing.seller.name) }}
              </div>
              <div class="seller-details">
                <h3>{{ listing.seller.name }}</h3>
                <p>Member since {{ formatDate(listing.seller.created_at) }}</p>
                <div class="seller-stats">
                  <span>
                    <i class="fas fa-star"></i>
                    {{ listing.seller.rating }} Rating
                  </span>
                  <span>
                    <i class="fas fa-shopping-cart"></i>
                    {{ listing.seller.sales }} Sales
                  </span>
                </div>
              </div>
            </div>

            <div class="seller-actions">
              <button 
                v-if="auth.isAuthenticated() && !isOwnListing"
                class="message-btn"
                @click="startChat"
              >
                <i class="fas fa-comment"></i>
                Message Seller
              </button>
              <button 
                v-if="isOwnListing"
                class="edit-btn"
                @click="editListing"
              >
                <i class="fas fa-edit"></i>
                Edit Listing
              </button>
            </div>
          </div>
        </div>

        <!-- Purchase Actions -->
        <div v-if="!isOwnListing" class="purchase-actions glass">
          <div class="action-buttons">
            <button 
              class="favorite-btn"
              :class="{ active: isFavorited }"
              @click="toggleFavorite"
            >
              <i class="fas fa-heart"></i>
              {{ isFavorited ? 'Saved' : 'Save' }}
            </button>
            <button 
              class="purchase-btn"
              @click="purchaseListing"
              :disabled="!canPurchase"
            >
              <i class="fas fa-shopping-cart"></i>
              Purchase License
            </button>
          </div>
          <p v-if="!auth.isAuthenticated()" class="login-prompt">
            Please <router-link to="/login">login</router-link> to purchase
          </p>
          <p v-else-if="!canPurchase" class="insufficient-credits">
            Insufficient credits. <router-link to="/profile">Buy more</router-link>
          </p>
        </div>
      </template>
    </div>

    <!-- Image Viewer Modal -->
    <div v-if="showImageViewer" class="image-viewer-modal" @click="closeImageViewer">
      <button class="close-btn" @click="closeImageViewer">
        <i class="fas fa-times"></i>
      </button>
      <div class="image-viewer-content">
        <button 
          class="nav-btn prev"
          @click.stop="previousImage"
          v-if="currentImageIndex > 0"
        >
          <i class="fas fa-chevron-left"></i>
        </button>
        <img 
          :src="listing.images[currentImageIndex]"
          :alt="`${listing.title} - Image ${currentImageIndex + 1}`"
        >
        <button 
          class="nav-btn next"
          @click.stop="nextImage"
          v-if="currentImageIndex < listing.images.length - 1"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMarketplaceStore } from '../stores/marketplace'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()
const marketplace = useMarketplaceStore()

const listing = ref(null)
const isLoading = ref(true)
const error = ref(null)
const isProcessing = ref(false)
const showMessageModal = ref(false)
const messageContent = ref('')

// Computed properties
const canPurchase = computed(() => 
  auth.isAuthenticated() && 
  listing.value?.user_id !== auth.user?.id &&
  listing.value?.status === 'active'
)

const hasEnoughCredits = computed(() => 
  marketplace.credits >= (listing.value?.price_credits || 0)
)

const isFavorited = computed(() => 
  marketplace.favorites.some(f => f.listing_id === parseInt(route.params.id))
)

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
  } catch (err) {
    error.value = err.message
  } finally {
    isLoading.value = false
  }
}

// Purchase license
async function purchaseLicense() {
  if (!confirm('Are you sure you want to purchase this license?')) return

  try {
    isProcessing.value = true
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/listings/${listing.value.id}/purchase`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`
        }
      }
    )
    const data = await response.json()

    if (!response.ok) throw new Error(data.error)
    
    await marketplace.fetchCredits()
    alert('Purchase successful! The seller will contact you with license details.')
    router.push('/profile/purchases')
  } catch (err) {
    alert(err.message)
  } finally {
    isProcessing.value = false
  }
}

// Message functions
function contactSeller() {
  showMessageModal.value = true
}

async function sendMessage() {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/api/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${auth.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          receiver_id: listing.value.user_id,
          listing_id: listing.value.id,
          content: messageContent.value
        })
      }
    )
    const data = await response.json()

    if (!response.ok) throw new Error(data.error)
    
    showMessageModal.value = false
    messageContent.value = ''
    alert('Message sent successfully!')
  } catch (err) {
    alert('Failed to send message: ' + err.message)
  }
}

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

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

function getInitials(name) {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
}

// Lifecycle
onMounted(async () => {
  fetchListing()
  if (auth.isAuthenticated()) {
    await marketplace.fetchCredits()
    await marketplace.fetchFavorites()
  }
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

/* Header Styles */
.listing-header {
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.header-content {
  flex: 1;
}

.header-content h1 {
  margin: 0 0 1rem;
  color: var(--text-color);
  font-size: 2rem;
}

.header-details {
  display: flex;
  gap: 1.5rem;
  color: var(--text-light);
}

.header-details span {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.price-section {
  text-align: right;
}

.price {
  font-size: 2rem;
  font-weight: 600;
  color: var(--primary-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.your-credits {
  margin-top: 0.5rem;
  color: var(--text-light);
  font-size: 0.875rem;
}

/* Content Layout */
.listing-content {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

/* Description Section */
.description-section {
  grid-column: 1;
  padding: 2rem;
}

.description-section h2 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.description {
  color: var(--text-light);
  line-height: 1.6;
  white-space: pre-line;
}

/* Stats Section */
.stats-section {
  grid-column: 1;
  padding: 1.5rem;
  display: flex;
  justify-content: space-around;
  text-align: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-light);
}

.stat i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

/* Seller Section */
.seller-section {
  grid-column: 2;
  grid-row: 1 / span 2;
  padding: 2rem;
}

.seller-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.avatar {
  width: 4rem;
  height: 4rem;
  background: var(--primary-color);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 500;
}

.seller-details h3 {
  margin: 0;
  color: var(--text-color);
}

.seller-details p {
  margin: 0.25rem 0 0;
  color: var(--text-light);
  font-size: 0.875rem;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.action-buttons button,
.action-buttons .login-btn {
  width: 100%;
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-buttons button:hover:not(:disabled),
.action-buttons .login-btn:hover {
  transform: translateY(-2px);
}

.purchase-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.purchase-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.message-btn {
  background: var(--background-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.favorite-btn {
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.login-btn {
  background: var(--background-secondary);
  color: var(--text-color);
  text-decoration: none;
  text-align: center;
}

/* Message Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  width: 90%;
  max-width: 500px;
  padding: 2rem;
}

.modal h2 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.modal textarea {
  width: 100%;
  padding: 1rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
}

.modal-actions button {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
}

.cancel-btn {
  background: var(--background-secondary);
  color: var(--text-color);
  border: 1px solid var(--border-color);
}

.send-btn {
  background: var(--primary-color);
  color: white;
  border: none;
}

.send-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading & Error States */
.loading-state,
.error-state {
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-light);
}

.loading-state i,
.error-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: var(--primary-color);
}

.error-state h2 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.back-btn {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
  text-decoration: none;
  border-radius: 0.5rem;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .listing-content {
    grid-template-columns: 1fr;
  }

  .seller-section {
    grid-column: 1;
    grid-row: auto;
  }
}

@media (max-width: 768px) {
  .listing-detail {
    padding: 1rem;
  }

  .listing-header {
    flex-direction: column;
    text-align: center;
  }

  .header-details {
    justify-content: center;
    flex-wrap: wrap;
  }

  .price-section {
    text-align: center;
  }

  .stats-section {
    flex-direction: column;
    gap: 1.5rem;
  }
}
</style> 