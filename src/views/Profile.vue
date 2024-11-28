<template>
    <div class="profile">
      <div class="profile-container">
        <!-- Header -->
        <div class="profile-header glass">
          <div class="user-info">
            <div class="avatar">{{ getInitials(auth.user.name) }}</div>
            <div class="user-details">
              <h1>{{ auth.user.name }}</h1>
              <p>Member since {{ formatDate(auth.user.created_at) }}</p>
            </div>
          </div>
          <div class="credit-info">
            <div class="credit-balance">
              <i class="fas fa-coins"></i>
              <span>{{ marketplace.credits }} Credits</span>
            </div>
            <button class="buy-credits-btn" @click="showBuyCredits = true">
              <i class="fas fa-plus"></i>
              Buy Credits
            </button>
          </div>
        </div>
  
        <!-- Navigation -->
        <div class="profile-nav glass">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            :class="['nav-btn', { active: currentTab === tab.id }]"
            @click="currentTab = tab.id"
          >
            <i :class="tab.icon"></i>
            {{ tab.name }}
            <span v-if="tab.count" class="count">{{ tab.count }}</span>
          </button>
        </div>
  
        <!-- Content -->
        <div class="profile-content">
          <!-- My Listings -->
          <div v-if="currentTab === 'listings'" class="listings-section">
            <div v-if="myListings.length" class="listings-grid">
              <div 
                v-for="listing in myListings" 
                :key="listing.id"
                class="listing-card glass"
              >
                <div class="listing-header">
                  <h3>{{ listing.title }}</h3>
                  <div class="listing-status" :class="listing.status">
                    {{ formatStatus(listing.status) }}
                  </div>
                </div>
                
                <div class="listing-stats">
                  <span>
                    <i class="fas fa-coins"></i>
                    {{ listing.price_credits }} Credits
                  </span>
                  <span>
                    <i class="fas fa-eye"></i>
                    {{ listing.views }} Views
                  </span>
                  <span>
                    <i class="fas fa-heart"></i>
                    {{ listing.favorites }} Saves
                  </span>
                </div>
  
                <div class="listing-actions">
                  <button 
                    v-if="listing.status === 'draft'"
                    class="publish-btn"
                    @click="publishListing(listing.id)"
                  >
                    Publish
                  </button>
                  <button 
                    class="edit-btn"
                    @click="editListing(listing.id)"
                  >
                    Edit
                  </button>
                  <button 
                    class="delete-btn"
                    @click="deleteListing(listing.id)"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state glass">
              <i class="fas fa-plane"></i>
              <h2>No Listings Yet</h2>
              <p>Start selling your flight sim licenses</p>
              <router-link to="/listings/new" class="new-listing-btn">
                Create Listing
              </router-link>
            </div>
          </div>
  
          <!-- Favorites -->
          <div v-if="currentTab === 'favorites'" class="favorites-section">
            <div v-if="marketplace.favorites.length" class="listings-grid">
              <div 
                v-for="favorite in marketplace.favorites" 
                :key="favorite.id"
                class="listing-card glass"
                @click="viewListing(favorite.listing_id)"
              >
                <!-- Similar to listing card in Listings.vue -->
              </div>
            </div>
            
            <div v-else class="empty-state glass">
              <i class="fas fa-heart"></i>
              <h2>No Favorites Yet</h2>
              <p>Save listings you're interested in</p>
              <router-link to="/listings" class="browse-btn">
                Browse Listings
              </router-link>
            </div>
          </div>
  
          <!-- Transactions -->
          <div v-if="currentTab === 'transactions'" class="transactions-section">
            <div v-if="transactions.length" class="transactions-list glass">
              <div 
                v-for="transaction in transactions" 
                :key="transaction.id"
                class="transaction-item"
              >
                <div class="transaction-icon">
                  <i :class="getTransactionIcon(transaction)"></i>
                </div>
                <div class="transaction-details">
                  <h3>{{ getTransactionTitle(transaction) }}</h3>
                  <p>{{ formatDate(transaction.created_at) }}</p>
                </div>
                <div class="transaction-amount" :class="getTransactionClass(transaction)">
                  {{ getTransactionAmount(transaction) }}
                </div>
              </div>
            </div>
            
            <div v-else class="empty-state glass">
              <i class="fas fa-exchange-alt"></i>
              <h2>No Transactions Yet</h2>
              <p>Your purchase and sale history will appear here</p>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Buy Credits Modal -->
      <div v-if="showBuyCredits" class="modal-overlay" @click="showBuyCredits = false">
        <div class="modal glass" @click.stop>
          <h2>Buy Credits</h2>
          <div class="credit-packages">
            <div 
              v-for="package in creditPackages"
              :key="package.credits"
              class="credit-package"
              :class="{ selected: selectedPackage === package }"
              @click="selectedPackage = package"
            >
              <div class="package-amount">
                <i class="fas fa-coins"></i>
                {{ package.credits }} Credits
              </div>
              <div class="package-price">
                ${{ package.price.toFixed(2) }}
              </div>
            </div>
          </div>
          <div class="modal-actions">
            <button 
              class="cancel-btn"
              @click="showBuyCredits = false"
            >
              Cancel
            </button>
            <button 
              class="buy-btn"
              :disabled="!selectedPackage"
              @click="purchaseCredits"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAuthStore } from '../stores/auth'
  import { useMarketplaceStore } from '../stores/marketplace'
  
  const router = useRouter()
  const auth = useAuthStore()
  const marketplace = useMarketplaceStore()
  
  const currentTab = ref('listings')
  const myListings = ref([])
  const transactions = ref([])
  const showBuyCredits = ref(false)
  const selectedPackage = ref(null)
  
  const tabs = [
    { id: 'listings', name: 'My Listings', icon: 'fas fa-list' },
    { id: 'favorites', name: 'Favorites', icon: 'fas fa-heart' },
    { id: 'transactions', name: 'Transactions', icon: 'fas fa-exchange-alt' }
  ]
  
  const creditPackages = [
    { credits: 1000, price: 9.99 },
    { credits: 2500, price: 19.99 },
    { credits: 5000, price: 39.99 },
    { credits: 10000, price: 69.99 }
  ]
  
  // Fetch user data
  async function fetchMyListings() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/listings`,
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        myListings.value = data.listings
      }
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    }
  }
  
  async function fetchTransactions() {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/users/transactions`,
        {
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      )
      const data = await response.json()
      if (response.ok) {
        transactions.value = data.transactions
      }
    } catch (error) {
      console.error('Failed to fetch transactions:', error)
    }
  }
  
  // Actions
  async function publishListing(id) {
    if (!confirm('Are you sure you want to publish this listing?')) return
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listings/${id}/publish`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      )
      if (response.ok) {
        await fetchMyListings()
      }
    } catch (error) {
      console.error('Failed to publish listing:', error)
    }
  }
  
  function editListing(id) {
    router.push(`/listings/${id}/edit`)
  }
  
  async function deleteListing(id) {
    if (!confirm('Are you sure you want to delete this listing?')) return
  
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/listings/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${auth.token}`
          }
        }
      )
      if (response.ok) {
        await fetchMyListings()
      }
    } catch (error) {
      console.error('Failed to delete listing:', error)
    }
  }
  
  async function purchaseCredits() {
    if (!selectedPackage.value) return
  
    try {
      // In a real app, this would integrate with a payment processor
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/credits/purchase`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            amount: selectedPackage.value.credits
          })
        }
      )
      const data = await response.json()
      if (response.ok) {
        marketplace.credits = data.credits
        showBuyCredits.value = false
        selectedPackage.value = null
        alert('Credits purchased successfully!')
      }
    } catch (error) {
      console.error('Failed to purchase credits:', error)
      alert('Failed to purchase credits. Please try again.')
    }
  }
  
  // Helper functions
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
  
  function formatStatus(status) {
    const formats = {
      draft: 'Draft',
      active: 'Active',
      sold: 'Sold',
      suspended: 'Suspended'
    }
    return formats[status] || status
  }
  
  function getTransactionIcon(transaction) {
    if (transaction.type === 'purchase') return 'fas fa-shopping-cart'
    if (transaction.type === 'sale') return 'fas fa-dollar-sign'
    return 'fas fa-exchange-alt'
  }
  
  function getTransactionTitle(transaction) {
    if (transaction.type === 'purchase') return `Purchased ${transaction.listing_title}`
    if (transaction.type === 'sale') return `Sold ${transaction.listing_title}`
    return transaction.description
  }
  
  function getTransactionAmount(transaction) {
    const amount = transaction.amount_credits
    if (transaction.type === 'purchase') return `-${amount}`
    return `+${amount}`
  }
  
  function getTransactionClass(transaction) {
    return transaction.type === 'purchase' ? 'negative' : 'positive'
  }
  
  onMounted(async () => {
    await Promise.all([
      fetchMyListings(),
      fetchTransactions(),
      marketplace.fetchFavorites()
    ])
  })
  </script>

  <style scoped>
  .profile {
    min-height: 100vh;
    padding: 2rem;
    background: var(--background-primary);
  }

  .profile-container {
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
  .profile-header {
    padding: 2rem;
    margin-bottom: 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .user-info {
    display: flex;
    align-items: center;
    gap: 1.5rem;
  }

  .avatar {
    width: 5rem;
    height: 5rem;
    background: var(--primary-color);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: 500;
  }

  .user-details h1 {
    margin: 0;
    color: var(--text-color);
  }

  .user-details p {
    margin: 0.25rem 0 0;
    color: var(--text-light);
  }

  .credit-info {
    text-align: right;
  }

  .credit-balance {
    font-size: 1.5rem;
    color: var(--primary-color);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }

  .buy-credits-btn {
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: transform 0.2s;
  }

  .buy-credits-btn:hover {
    transform: translateY(-2px);
  }

  /* Navigation */
  .profile-nav {
    display: flex;
    gap: 1rem;
    padding: 1rem;
    margin-bottom: 2rem;
  }

  .nav-btn {
    flex: 1;
    padding: 1rem;
    background: none;
    border: none;
    color: var(--text-light);
    font-size: 1rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 0.5rem;
    transition: all 0.2s;
  }

  .nav-btn:hover {
    background: rgba(255, 255, 255, 0.1);
  }

  .nav-btn.active {
    background: var(--primary-color);
    color: white;
  }

  .nav-btn .count {
    background: var(--background-secondary);
    color: var(--text-color);
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
  }

  /* Listings Section */
  .listings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 2rem;
  }

  .listing-card {
    padding: 1.5rem;
  }

  .listing-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
  }

  .listing-header h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 1.125rem;
  }

  .listing-status {
    padding: 0.25rem 0.5rem;
    border-radius: 1rem;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .listing-status.draft {
    background: var(--warning-color);
    color: var(--warning-text);
  }

  .listing-status.active {
    background: var(--success-color);
    color: var(--success-text);
  }

  .listing-status.sold {
    background: var(--primary-color);
    color: white;
  }

  .listing-stats {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
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

  .listing-actions button {
    flex: 1;
    padding: 0.5rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    cursor: pointer;
    border: none;
    transition: transform 0.2s;
  }

  .listing-actions button:hover {
    transform: translateY(-2px);
  }

  .publish-btn {
    background: var(--success-color);
    color: var(--success-text);
  }

  .edit-btn {
    background: var(--warning-color);
    color: var(--warning-text);
  }

  .delete-btn {
    background: var(--error-color);
    color: var(--error-text);
  }

  /* Transactions Section */
  .transactions-list {
    padding: 1rem;
  }

  .transaction-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .transaction-item:last-child {
    border-bottom: none;
  }

  .transaction-icon {
    width: 3rem;
    height: 3rem;
    background: var(--background-secondary);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--primary-color);
    font-size: 1.25rem;
  }

  .transaction-details {
    flex: 1;
  }

  .transaction-details h3 {
    margin: 0;
    color: var(--text-color);
    font-size: 1rem;
  }

  .transaction-details p {
    margin: 0.25rem 0 0;
    color: var(--text-light);
    font-size: 0.875rem;
  }

  .transaction-amount {
    font-weight: 500;
    font-size: 1.125rem;
  }

  .transaction-amount.positive {
    color: var(--success-color);
  }

  .transaction-amount.negative {
    color: var(--error-color);
  }

  /* Buy Credits Modal */
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
    margin: 0 0 1.5rem;
    color: var(--text-color);
    text-align: center;
  }

  .credit-packages {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .credit-package {
    padding: 1rem;
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.2s;
  }

  .credit-package:hover {
    border-color: var(--primary-color);
  }

  .credit-package.selected {
    border-color: var(--primary-color);
    background: rgba(var(--primary-rgb), 0.1);
  }

  .package-amount {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-color);
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
  }

  .package-price {
    color: var(--primary-color);
    font-weight: 500;
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

  .buy-btn {
    background: var(--primary-color);
    color: white;
    border: none;
  }

  .buy-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Empty States */
  .empty-state {
    padding: 4rem 2rem;
    text-align: center;
    color: var(--text-light);
  }

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
    margin: 0.25rem 0 0;
    color: var(--text-light);
  }

  .new-listing-btn,
  .browse-btn {
    display: inline-block;
    padding: 0.75rem 1.5rem;
    background: var(--primary-color);
    color: white;
    border-radius: 0.5rem;
    text-decoration: none;
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .profile {
      padding: 1rem;
    }

    .profile-header {
      flex-direction: column;
      text-align: center;
      gap: 1.5rem;
    }

    .user-info {
      flex-direction: column;
    }

    .credit-info {
      text-align: center;
    }

    .profile-nav {
      flex-direction: column;
    }

    .listings-grid {
      grid-template-columns: 1fr;
    }

    .credit-packages {
      grid-template-columns: 1fr;
    }
  }
  </style>