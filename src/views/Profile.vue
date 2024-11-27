<template>
  <div class="profile">
    <div class="profile-container">
      <div class="profile-header glass">
        <div class="profile-info">
          <div class="avatar">
            {{ initials }}
          </div>
          <div class="user-info">
            <h1>{{ auth.user?.name }}</h1>
            <p>{{ auth.user?.email }}</p>
          </div>
        </div>
        <button @click="isEditing = true" class="edit-btn" v-if="!isEditing">
          <i class="fas fa-edit"></i> Edit Profile
        </button>
      </div>

      <div class="profile-content glass">
        <form v-if="isEditing" @submit.prevent="handleSubmit" class="edit-form">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              type="text" 
              id="name" 
              v-model="formData.name" 
              required
              :class="{ 'error': errors.name }"
            >
            <span class="error-message">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              type="email" 
              id="email" 
              v-model="formData.email" 
              required
              :class="{ 'error': errors.email }"
            >
            <span class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="phone">Phone (optional)</label>
            <input 
              type="tel" 
              id="phone" 
              v-model="formData.phone"
              :class="{ 'error': errors.phone }"
            >
            <span class="error-message">{{ errors.phone }}</span>
          </div>

          <div class="form-group">
            <label for="location">Location (optional)</label>
            <input 
              type="text" 
              id="location" 
              v-model="formData.location"
              :class="{ 'error': errors.location }"
            >
            <span class="error-message">{{ errors.location }}</span>
          </div>

          <div class="form-group">
            <label for="bio">Bio (optional)</label>
            <textarea 
              id="bio" 
              v-model="formData.bio" 
              rows="4"
              :class="{ 'error': errors.bio }"
            ></textarea>
            <span class="error-message">{{ errors.bio }}</span>
          </div>

          <div class="form-actions">
            <button type="button" @click="cancelEdit" class="cancel-btn">
              Cancel
            </button>
            <button type="submit" class="save-btn" :disabled="isLoading">
              {{ isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>

        <div v-else class="profile-details">
          <div class="detail-group">
            <h3>Contact Information</h3>
            <p><i class="fas fa-envelope"></i> {{ auth.user?.email }}</p>
            <p v-if="profile.phone">
              <i class="fas fa-phone"></i> {{ profile.phone }}
            </p>
            <p v-if="profile.location">
              <i class="fas fa-map-marker-alt"></i> {{ profile.location }}
            </p>
          </div>

          <div class="detail-group" v-if="profile.bio">
            <h3>About</h3>
            <p>{{ profile.bio }}</p>
          </div>

          <div class="detail-group">
            <h3>Account Statistics</h3>
            <div class="stats-grid">
              <div class="stat-card">
                <span class="stat-value">{{ stats.totalListings }}</span>
                <span class="stat-label">Listings</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">{{ stats.totalViews }}</span>
                <span class="stat-label">Views</span>
              </div>
              <div class="stat-card">
                <span class="stat-value">{{ stats.memberSince }}</span>
                <span class="stat-label">Member Since</span>
              </div>
            </div>
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
const isEditing = ref(false)
const isLoading = ref(false)
const profile = ref({})
const stats = ref({
  totalListings: 0,
  totalViews: 0,
  memberSince: ''
})

const formData = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: ''
})

const errors = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  bio: ''
})

const initials = computed(() => {
  const name = auth.user?.name || ''
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
})

const fetchProfile = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      profile.value = data.profile
      stats.value = data.stats
      
      // Initialize form data
      formData.value = {
        name: auth.user?.name || '',
        email: auth.user?.email || '',
        phone: profile.value.phone || '',
        location: profile.value.location || '',
        bio: profile.value.bio || ''
      }
    }
  } catch (error) {
    console.error('Failed to fetch profile:', error)
  }
}

const handleSubmit = async () => {
  try {
    isLoading.value = true
    errors.value = {}

    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(formData.value)
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.errors) {
        errors.value = data.errors
      }
      throw new Error(data.error || 'Failed to update profile')
    }

    // Update auth store with new user data
    auth.updateUser(data.user)
    profile.value = data.profile
    isEditing.value = false
  } catch (error) {
    console.error('Failed to update profile:', error)
  } finally {
    isLoading.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  formData.value = {
    name: auth.user?.name || '',
    email: auth.user?.email || '',
    phone: profile.value.phone || '',
    location: profile.value.location || '',
    bio: profile.value.bio || ''
  }
  errors.value = {}
}

onMounted(() => {
  fetchProfile()
})
</script>

<style scoped>
.profile {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.profile-container {
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

.profile-header {
  padding: 2rem;
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.avatar {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: bold;
}

.user-info h1 {
  margin: 0;
  color: var(--text-color);
}

.user-info p {
  margin: 0.5rem 0 0;
  color: var(--text-light);
}

.edit-btn {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: opacity 0.2s;
}

.edit-btn:hover {
  opacity: 0.9;
}

.profile-content {
  padding: 2rem;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: var(--text-color);
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
}

.form-group input.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.cancel-btn,
.save-btn {
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

.save-btn {
  background: var(--primary-color);
  border: none;
  color: white;
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.profile-details {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-group h3 {
  margin: 0 0 1rem;
  color: var(--text-color);
}

.detail-group p {
  margin: 0.5rem 0;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.detail-group p i {
  color: var(--primary-color);
  width: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.stat-card {
  padding: 1rem;
  background: var(--background-secondary);
  border-radius: 0.5rem;
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--primary-color);
}

.stat-label {
  display: block;
  margin-top: 0.25rem;
  color: var(--text-light);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .profile {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
    gap: 1rem;
  }

  .profile-info {
    flex-direction: column;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style> 