<template>
  <div class="profile-page">
    <!-- Header -->
    <div class="profile-header">
      <h1>Profile Settings</h1>
      <button @click="saveChanges" class="btn-primary" :disabled="isSaving">
        <i class="fas fa-save"></i>
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>

    <!-- Main Content -->
    <div class="profile-content">
      <!-- Personal Info -->
      <section class="profile-section">
        <h2>Personal Information</h2>
        <div class="profile-card">
          <div class="avatar-section">
            <div class="avatar-container">
              <img 
                :src="profile.avatar || '/default-avatar.png'" 
                alt="Profile" 
                class="avatar"
              />
              <div class="avatar-overlay">
                <input 
                  type="file" 
                  ref="fileInput" 
                  @change="handleAvatarChange" 
                  accept="image/*" 
                  class="file-input"
                />
                <i class="fas fa-camera"></i>
              </div>
            </div>
            <button 
              v-if="profile.avatar" 
              @click="removeAvatar" 
              class="btn-text"
            >
              <i class="fas fa-trash"></i> Remove Photo
            </button>
          </div>

          <div class="form-grid">
            <div class="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                v-model="profile.name" 
                placeholder="Your name"
              />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input 
                type="email" 
                v-model="profile.email" 
                placeholder="Your email"
              />
            </div>
            <div class="form-group">
              <label>Phone</label>
              <input 
                type="tel" 
                v-model="profile.phone" 
                placeholder="Your phone number"
              />
            </div>
            <div class="form-group">
              <label>Location</label>
              <input 
                type="text" 
                v-model="profile.location" 
                placeholder="Your location"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Flight Planning -->
      <section class="profile-section">
        <h2>Flight Planning</h2>
        <div class="profile-card">
          <div class="integration-item">
            <div class="integration-header">
              <img src="@/assets/simbrief-logo.png" alt="SimBrief" class="integration-logo" />
              <div class="integration-info">
                <h3>SimBrief Integration</h3>
                <p>Connect your SimBrief account for flight planning</p>
              </div>
              <div class="integration-status" :class="{ active: profile.simbrief }">
                {{ profile.simbrief ? 'Connected' : 'Not Connected' }}
              </div>
            </div>
            <div class="form-group">
              <label>SimBrief Username</label>
              <input 
                type="text" 
                v-model="profile.simbrief" 
                placeholder="Enter your SimBrief username"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- Preferences -->
      <section class="profile-section">
        <h2>Preferences</h2>
        <div class="profile-card">
          <div class="preferences-grid">
            <div class="preference-item">
              <span>Dark Mode</span>
              <label class="switch">
                <input type="checkbox" v-model="preferences.darkMode">
                <span class="slider"></span>
              </label>
            </div>
            <div class="preference-item">
              <span>Email Notifications</span>
              <label class="switch">
                <input type="checkbox" v-model="preferences.emailNotifications">
                <span class="slider"></span>
              </label>
            </div>
            <div class="preference-item">
              <span>Units</span>
              <select v-model="preferences.units" class="select-input">
                <option value="imperial">Imperial</option>
                <option value="metric">Metric</option>
              </select>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'
import { useToast } from '@/composables/useToast'

const userStore = useUserStore()
const toast = useToast()
const fileInput = ref(null)
const isSaving = ref(false)

const profile = ref({
  name: '',
  email: '',
  phone: '',
  location: '',
  avatar: null,
  simbrief: ''
})

const preferences = ref({
  darkMode: false,
  emailNotifications: true,
  units: 'imperial'
})

onMounted(async () => {
  try {
    const userData = await userStore.getUserProfile()
    if (userData) {
      profile.value = { ...userData }
      preferences.value = { ...userData.preferences }
    }
  } catch (error) {
    toast.error('Failed to load profile')
  }
})

async function saveChanges() {
  isSaving.value = true
  try {
    await userStore.updateProfile({
      ...profile.value,
      preferences: preferences.value
    })
    toast.success('Profile updated successfully')
  } catch (error) {
    toast.error('Failed to update profile')
  } finally {
    isSaving.value = false
  }
}

async function handleAvatarChange(event) {
  const file = event.target.files[0]
  if (!file) return

  try {
    const avatarUrl = await userStore.uploadAvatar(file)
    profile.value.avatar = avatarUrl
    toast.success('Avatar updated successfully')
  } catch (error) {
    toast.error('Failed to update avatar')
  }
}

async function removeAvatar() {
  try {
    await userStore.removeAvatar()
    profile.value.avatar = null
    toast.success('Avatar removed successfully')
  } catch (error) {
    toast.error('Failed to remove avatar')
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
  margin-bottom: 32px;
}

.profile-header h1 {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.profile-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.profile-section h2 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: var(--shadow-sm);
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 24px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--border-color);
}

.avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
  border-radius: 12px;
  overflow: hidden;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  cursor: pointer;
}

.avatar-overlay:hover {
  opacity: 1;
}

.avatar-overlay i {
  color: white;
  font-size: 24px;
}

.file-input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
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

.form-group input,
.select-input {
  padding: 10px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-group input:focus,
.select-input:focus {
  border-color: var(--primary);
  outline: none;
}

.integration-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.integration-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.integration-logo {
  width: 48px;
  height: 48px;
  border-radius: 8px;
}

.integration-info {
  flex: 1;
}

.integration-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 4px;
}

.integration-info p {
  font-size: 14px;
  color: var(--text-secondary);
}

.integration-status {
  padding: 6px 12px;
  border-radius: 100px;
  font-size: 14px;
  background: #fee2e2;
  color: #991b1b;
}

.integration-status.active {
  background: #dcfce7;
  color: #166534;
}

.preferences-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
}

.preference-item {
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
  inset: 0;
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

  .profile-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
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