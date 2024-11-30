<template>
  <div class="profile-page">
    <!-- Profile Header -->
    <div class="profile-header">
      <h1>Profile Settings</h1>
      <button @click="saveChanges" class="btn-primary" :disabled="isSaving">
        <i class="fas fa-save"></i>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <!-- Personal Information -->
      <div class="profile-section">
        <h2>Personal Information</h2>
        <div class="profile-card">
          <div class="avatar-section">
            <img :src="user.avatar || '/default-avatar.png'" alt="Profile" class="avatar" />
            <div class="avatar-actions">
              <button class="btn-secondary">
                <i class="fas fa-camera"></i>
                Change Photo
              </button>
              <button class="btn-secondary" v-if="user.avatar">
                <i class="fas fa-trash"></i>
                Remove
              </button>
            </div>
          </div>
          
          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" v-model="profile.name" placeholder="Your full name" />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input type="email" v-model="profile.email" placeholder="Your email" />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input type="tel" v-model="profile.phone" placeholder="Your phone number" />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" v-model="profile.location" placeholder="Your location" />
            </div>
          </div>
        </div>
      </div>

      <!-- API Integrations -->
      <div class="profile-section">
        <h2>API Integrations</h2>
        <div class="profile-card">
          <!-- SimBrief -->
          <div class="integration-item">
            <div class="integration-header">
              <div class="integration-info">
                <img src="@/assets/simbrief-logo.png" alt="SimBrief" class="integration-logo" />
                <div>
                  <h3>SimBrief</h3>
                  <p>Connect your SimBrief account for flight planning</p>
                </div>
              </div>
              <div class="integration-status" :class="{ connected: hasSimBriefCredentials }">
                {{ hasSimBriefCredentials ? 'Connected' : 'Not Connected' }}
              </div>
            </div>
            
            <div class="integration-form">
              <div class="form-group">
                <label>SimBrief Username or Pilot ID</label>
                <input 
                  type="text" 
                  v-model="integrations.simbrief.username"
                  placeholder="Enter your SimBrief username"
                />
              </div>
            </div>
          </div>

          <!-- CheckWX -->
          <div class="integration-item">
            <div class="integration-header">
              <div class="integration-info">
                <img src="@/assets/checkwx-logo.png" alt="CheckWX" class="integration-logo" />
                <div>
                  <h3>CheckWX Weather</h3>
                  <p>API key for weather information</p>
                </div>
              </div>
              <div class="integration-status" :class="{ connected: hasWeatherApiKey }">
                {{ hasWeatherApiKey ? 'Connected' : 'Not Connected' }}
              </div>
            </div>
            
            <div class="integration-form">
              <div class="form-group">
                <label>API Key</label>
                <input 
                  type="password" 
                  v-model="integrations.checkwx.apiKey"
                  placeholder="Enter your CheckWX API key"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Preferences -->
      <div class="profile-section">
        <h2>Preferences</h2>
        <div class="profile-card">
          <div class="preferences-grid">
            <div class="preference-item">
              <label class="switch-label">
                <span>Dark Mode</span>
                <div class="switch">
                  <input type="checkbox" v-model="preferences.darkMode">
                  <span class="slider"></span>
                </div>
              </label>
            </div>
            <div class="preference-item">
              <label class="switch-label">
                <span>Email Notifications</span>
                <div class="switch">
                  <input type="checkbox" v-model="preferences.emailNotifications">
                  <span class="slider"></span>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isSaving = ref(false)

const profile = ref({
  name: '',
  email: '',
  phone: '',
  location: ''
})

const integrations = ref({
  simbrief: {
    username: ''
  },
  checkwx: {
    apiKey: ''
  }
})

const preferences = ref({
  darkMode: false,
  emailNotifications: true
})

const hasSimBriefCredentials = ref(false)
const hasWeatherApiKey = ref(false)

onMounted(async () => {
  // Load user data
  const userData = await userStore.getUserProfile()
  if (userData) {
    profile.value = { ...userData }
  }

  // Load integrations
  const simbriefCreds = await userStore.getSimBriefCredentials()
  if (simbriefCreds) {
    integrations.value.simbrief.username = simbriefCreds.username
    hasSimBriefCredentials.value = true
  }

  const weatherKey = await userStore.getWeatherApiKey()
  if (weatherKey) {
    integrations.value.checkwx.apiKey = weatherKey
    hasWeatherApiKey.value = true
  }
})

async function saveChanges() {
  isSaving.value = true
  try {
    await userStore.updateProfile(profile.value)
    await userStore.saveSimBriefCredentials(integrations.value.simbrief)
    await userStore.saveWeatherApiKey(integrations.value.checkwx.apiKey)
    // Show success message
  } catch (error) {
    // Show error message
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.profile-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.profile-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-section {
  margin-bottom: 32px;
}

.profile-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

.profile-card {
  background: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 24px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.avatar {
  width: 100px;
  height: 100px;
  border-radius: 12px;
  object-fit: cover;
}

.avatar-actions {
  display: flex;
  gap: 12px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
}

.form-group input {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
}

.integration-item {
  padding: 24px 0;
  border-bottom: 1px solid var(--border-color);
}

.integration-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.integration-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.integration-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.integration-logo {
  width: 40px;
  height: 40px;
  border-radius: 8px;
}

.integration-status {
  font-size: 14px;
  padding: 4px 12px;
  border-radius: 100px;
  background: #fee2e2;
  color: #991b1b;
}

.integration-status.connected {
  background: #dcfce7;
  color: #166534;
}

.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.switch-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e2e8f0;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: var(--primary);
}

input:checked + .slider:before {
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .profile-page {
    padding: 16px;
  }

  .avatar-section {
    flex-direction: column;
    align-items: flex-start;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>