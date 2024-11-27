<template>
  <div class="settings">
    <div class="settings-container">
      <div class="settings-header glass">
        <h1>Account Settings</h1>
      </div>

      <div class="settings-content">
        <!-- Account Settings -->
        <div class="settings-section glass">
          <h2>Account</h2>
          <div class="settings-form">
            <div class="form-group">
              <label>Email Notifications</label>
              <div class="toggle-group">
                <label class="toggle">
                  <input 
                    type="checkbox" 
                    v-model="settings.notifications.messages"
                  >
                  <span class="toggle-label">New Messages</span>
                </label>
                <label class="toggle">
                  <input 
                    type="checkbox" 
                    v-model="settings.notifications.listings"
                  >
                  <span class="toggle-label">Listing Updates</span>
                </label>
                <label class="toggle">
                  <input 
                    type="checkbox" 
                    v-model="settings.notifications.marketing"
                  >
                  <span class="toggle-label">Marketing Updates</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label>Privacy</label>
              <div class="toggle-group">
                <label class="toggle">
                  <input 
                    type="checkbox" 
                    v-model="settings.privacy.showEmail"
                  >
                  <span class="toggle-label">Show Email to Others</span>
                </label>
                <label class="toggle">
                  <input 
                    type="checkbox" 
                    v-model="settings.privacy.showPhone"
                  >
                  <span class="toggle-label">Show Phone Number</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div class="settings-section glass">
          <h2>Security</h2>
          <form @submit.prevent="changePassword" class="settings-form">
            <div class="form-group">
              <label for="currentPassword">Current Password</label>
              <input 
                type="password" 
                id="currentPassword" 
                v-model="passwordForm.current"
                :class="{ 'error': passwordErrors.current }"
              >
              <span class="error-message">{{ passwordErrors.current }}</span>
            </div>

            <div class="form-group">
              <label for="newPassword">New Password</label>
              <input 
                type="password" 
                id="newPassword" 
                v-model="passwordForm.new"
                :class="{ 'error': passwordErrors.new }"
              >
              <span class="error-message">{{ passwordErrors.new }}</span>
            </div>

            <div class="form-group">
              <label for="confirmPassword">Confirm New Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                v-model="passwordForm.confirm"
                :class="{ 'error': passwordErrors.confirm }"
              >
              <span class="error-message">{{ passwordErrors.confirm }}</span>
            </div>

            <button type="submit" class="submit-btn" :disabled="isLoading">
              {{ isLoading ? 'Updating...' : 'Update Password' }}
            </button>
          </form>
        </div>

        <!-- Danger Zone -->
        <div class="settings-section glass danger-zone">
          <h2>Danger Zone</h2>
          <div class="danger-actions">
            <button @click="showDeleteModal = true" class="delete-btn">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Modal -->
    <div v-if="showDeleteModal" class="modal-overlay">
      <div class="modal glass">
        <h2>Delete Account</h2>
        <p>This action cannot be undone. Please enter your password to confirm.</p>
        
        <div class="form-group">
          <input 
            type="password" 
            v-model="deletePassword"
            placeholder="Enter your password"
            :class="{ 'error': deleteError }"
          >
          <span class="error-message">{{ deleteError }}</span>
        </div>

        <div class="modal-actions">
          <button @click="showDeleteModal = false" class="cancel-btn">
            Cancel
          </button>
          <button 
            @click="deleteAccount" 
            class="confirm-delete-btn"
            :disabled="isLoading"
          >
            {{ isLoading ? 'Deleting...' : 'Delete Account' }}
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

const router = useRouter()
const auth = useAuthStore()
const isLoading = ref(false)
const showDeleteModal = ref(false)
const deletePassword = ref('')
const deleteError = ref('')

const settings = ref({
  notifications: {
    messages: true,
    listings: true,
    marketing: false
  },
  privacy: {
    showEmail: false,
    showPhone: false
  }
})

const passwordForm = ref({
  current: '',
  new: '',
  confirm: ''
})

const passwordErrors = ref({
  current: '',
  new: '',
  confirm: ''
})

// Fetch settings
const fetchSettings = async () => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`
      }
    })

    if (response.ok) {
      const data = await response.json()
      settings.value = data.settings
    }
  } catch (error) {
    console.error('Failed to fetch settings:', error)
  }
}

// Save settings
const saveSettings = async () => {
  try {
    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify(settings.value)
    })

    if (!response.ok) {
      throw new Error('Failed to save settings')
    }
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    isLoading.value = false
  }
}

// Change password
const changePassword = async () => {
  try {
    passwordErrors.value = {}
    
    // Validate passwords
    if (!passwordForm.value.current) {
      passwordErrors.value.current = 'Current password is required'
      return
    }
    if (!passwordForm.value.new) {
      passwordErrors.value.new = 'New password is required'
      return
    }
    if (passwordForm.value.new.length < 6) {
      passwordErrors.value.new = 'Password must be at least 6 characters'
      return
    }
    if (passwordForm.value.new !== passwordForm.value.confirm) {
      passwordErrors.value.confirm = 'Passwords do not match'
      return
    }

    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        currentPassword: passwordForm.value.current,
        newPassword: passwordForm.value.new
      })
    })

    const data = await response.json()

    if (!response.ok) {
      if (data.errors) {
        passwordErrors.value = data.errors
      }
      throw new Error(data.error || 'Failed to update password')
    }

    // Clear form
    passwordForm.value = {
      current: '',
      new: '',
      confirm: ''
    }

    alert('Password updated successfully')
  } catch (error) {
    console.error('Failed to change password:', error)
  } finally {
    isLoading.value = false
  }
}

// Delete account
const deleteAccount = async () => {
  try {
    if (!deletePassword.value) {
      deleteError.value = 'Password is required'
      return
    }

    isLoading.value = true
    const response = await fetch(`${import.meta.env.VITE_API_URL}/api/settings/account`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth.token}`
      },
      body: JSON.stringify({
        password: deletePassword.value
      })
    })

    if (!response.ok) {
      const data = await response.json()
      deleteError.value = data.error || 'Failed to delete account'
      return
    }

    auth.logout()
    router.push('/')
  } catch (error) {
    console.error('Failed to delete account:', error)
    deleteError.value = 'Failed to delete account'
  } finally {
    isLoading.value = false
  }
}

// Watch for settings changes
watch(settings, async () => {
  await saveSettings()
}, { deep: true })

onMounted(() => {
  fetchSettings()
})
</script>

<style scoped>
.settings {
  min-height: 100vh;
  padding: 2rem;
  background: var(--background-primary);
}

.settings-container {
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

.settings-header {
  padding: 2rem;
  margin-bottom: 2rem;
}

.settings-header h1 {
  margin: 0;
  color: var(--text-color);
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.settings-section {
  padding: 2rem;
}

.settings-section h2 {
  margin: 0 0 1.5rem;
  color: var(--text-color);
}

.settings-form {
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

.form-group input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
}

.form-group input.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
}

.toggle-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
}

.toggle input[type="checkbox"] {
  appearance: none;
  width: 3rem;
  height: 1.5rem;
  background: var(--background-secondary);
  border-radius: 1rem;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toggle input[type="checkbox"]::before {
  content: '';
  position: absolute;
  width: 1.25rem;
  height: 1.25rem;
  border-radius: 50%;
  background: white;
  top: 0.125rem;
  left: 0.125rem;
  transition: transform 0.2s;
}

.toggle input[type="checkbox"]:checked {
  background: var(--primary-color);
}

.toggle input[type="checkbox"]:checked::before {
  transform: translateX(1.5rem);
}

.toggle-label {
  color: var(--text-color);
}

.submit-btn {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.danger-zone {
  border-color: rgba(239, 68, 68, 0.2);
}

.danger-zone h2 {
  color: #ef4444;
}

.danger-actions {
  display: flex;
  gap: 1rem;
}

.delete-btn {
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
  transition: opacity 0.2s;
}

.delete-btn:hover {
  opacity: 0.9;
}

/* Modal styles */
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
  margin-top: 1.5rem;
}

.cancel-btn {
  padding: 0.75rem 1.5rem;
  background: var(--background-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-color);
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.confirm-delete-btn {
  padding: 0.75rem 1.5rem;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 500;
}

.confirm-delete-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .settings {
    padding: 1rem;
  }

  .settings-section {
    padding: 1.5rem;
  }

  .toggle-group {
    gap: 1rem;
  }

  .modal {
    margin: 1rem;
  }
}
</style> 