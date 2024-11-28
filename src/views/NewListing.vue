<template>
  <div class="new-listing">
    <div class="new-listing-container">
      <div class="form-header glass">
        <h1>List Your Aircraft</h1>
      </div>

      <form @submit.prevent="handleSubmit" class="listing-form glass">
        <!-- Basic Info -->
        <div class="form-section">
          <h2>Basic Information</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="title">Title*</label>
              <input 
                type="text" 
                id="title" 
                v-model="form.title" 
                required
                placeholder="e.g., 2015 Cessna 172S Skyhawk"
              >
            </div>

            <div class="form-group">
              <label for="manufacturer">Manufacturer*</label>
              <input 
                type="text" 
                id="manufacturer" 
                v-model="form.manufacturer" 
                required
                placeholder="e.g., Cessna"
              >
            </div>

            <div class="form-group">
              <label for="model">Model*</label>
              <input 
                type="text" 
                id="model" 
                v-model="form.model" 
                required
                placeholder="e.g., 172S Skyhawk"
              >
            </div>

            <div class="form-group">
              <label for="year">Year*</label>
              <input 
                type="number" 
                id="year" 
                v-model="form.year" 
                required
                min="1903"
                :max="new Date().getFullYear()"
              >
            </div>

            <div class="form-group">
              <label for="category">Category*</label>
              <select id="category" v-model="form.category" required>
                <option value="">Select Category</option>
                <option value="single-engine">Single Engine</option>
                <option value="multi-engine">Multi Engine</option>
                <option value="turboprop">Turboprop</option>
                <option value="jet">Jet</option>
                <option value="helicopter">Helicopter</option>
              </select>
            </div>

            <div class="form-group">
              <label for="price">Price (USD)*</label>
              <input 
                type="number" 
                id="price" 
                v-model="form.price" 
                required
                min="0"
                step="1000"
              >
            </div>
          </div>
        </div>

        <!-- Technical Details -->
        <div class="form-section">
          <h2>Technical Details</h2>
          
          <div class="form-grid">
            <div class="form-group">
              <label for="registration">Registration Number</label>
              <input 
                type="text" 
                id="registration" 
                v-model="form.registration" 
                placeholder="e.g., N12345"
              >
            </div>

            <div class="form-group">
              <label for="total_time">Total Time (hours)</label>
              <input 
                type="number" 
                id="total_time" 
                v-model="form.total_time"
                min="0"
              >
            </div>

            <div class="form-group">
              <label for="engine_hours">Engine Hours</label>
              <input 
                type="number" 
                id="engine_hours" 
                v-model="form.engine_hours"
                min="0"
              >
            </div>

            <div class="form-group">
              <label for="condition">Condition*</label>
              <select id="condition" v-model="form.condition" required>
                <option value="">Select Condition</option>
                <option value="new">New</option>
                <option value="excellent">Excellent</option>
                <option value="good">Good</option>
                <option value="fair">Fair</option>
                <option value="poor">Poor</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Location -->
        <div class="form-section">
          <h2>Location</h2>
          
          <div class="form-group">
            <label for="location">Location*</label>
            <input 
              type="text" 
              id="location" 
              v-model="form.location" 
              required
              placeholder="e.g., Toronto, ON, Canada"
            >
          </div>
        </div>

        <!-- Description -->
        <div class="form-section">
          <h2>Description</h2>
          
          <div class="form-group">
            <label for="description">Description*</label>
            <textarea 
              id="description" 
              v-model="form.description" 
              required
              rows="6"
              placeholder="Provide detailed information about your aircraft..."
            ></textarea>
          </div>
        </div>

        <!-- Submit -->
        <div class="form-actions">
          <button 
            type="button" 
            class="cancel-btn" 
            @click="router.back()"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            class="submit-btn" 
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Create Listing</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const isLoading = ref(false)

const form = ref({
  title: '',
  manufacturer: '',
  model: '',
  year: new Date().getFullYear(),
  category: '',
  price: '',
  registration: '',
  total_time: '',
  engine_hours: '',
  condition: '',
  location: '',
  description: ''
})

async function handleSubmit() {
  if (!auth.isAuthenticated()) {
    router.push('/login')
    return
  }

  try {
    isLoading.value = true

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/listings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(form.value)
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error)
    }

    router.push(`/listings/${data.listing.id}`)
  } catch (error) {
    console.error('Failed to create listing:', error)
    alert(error.message)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.new-listing {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.new-listing-container {
  max-width: 800px;
  margin: 0 auto;
  padding-top: 60px;
}

.glass {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.form-header {
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
}

.form-header h1 {
  margin: 0;
  color: var(--text-color);
}

.listing-form {
  padding: 2rem;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h2 {
  margin: 0 0 1rem;
  color: var(--text-color);
  font-size: 1.25rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  font-size: 1rem;
}

.form-group textarea {
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.submit-btn {
  flex: 1;
  padding: 0.75rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.cancel-btn {
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
}

.submit-btn {
  background: var(--primary-color);
  border: none;
  color: white;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .new-listing {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .listing-form {
    padding: 1rem;
  }
}
</style> 