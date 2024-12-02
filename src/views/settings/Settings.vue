<template>
  <div class="settings">
    <div class="settings-header">
      <h1>Settings</h1>
      <p>Manage your account preferences and system settings</p>
    </div>

    <div class="settings-grid">
      <!-- Account Settings -->
      <div class="settings-section">
        <h2>Account Settings</h2>
        <div class="settings-card">
          <div class="setting-group">
            <label>Email Notifications</label>
            <div class="notification-options">
              <label class="toggle-option" v-for="option in emailNotifications" :key="option.id">
                <input 
                  type="checkbox" 
                  v-model="option.enabled"
                  @change="updateNotifications"
                />
                <span class="toggle-label">{{ option.label }}</span>
              </label>
            </div>
          </div>

          <div class="setting-group">
            <label>Time Zone</label>
            <select v-model="timeZone" class="select-input" @change="updateTimeZone">
              <option v-for="tz in timeZones" :key="tz.value" :value="tz.value">
                {{ tz.label }}
              </option>
            </select>
          </div>

          <div class="setting-group">
            <label>Units</label>
            <div class="units-grid">
              <div class="unit-option" v-for="(unit, key) in units" :key="key">
                <span class="unit-label">{{ unit.label }}</span>
                <select v-model="unit.value" @change="updateUnits">
                  <option v-for="opt in unit.options" :key="opt.value" :value="opt.value">
                    {{ opt.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Display Settings -->
      <div class="settings-section">
        <h2>Display Settings</h2>
        <div class="settings-card">
          <div class="setting-group">
            <label>Theme</label>
            <div class="theme-options">
              <button 
                v-for="theme in themes"
                :key="theme.id"
                class="theme-btn"
                :class="{ active: currentTheme === theme.id }"
                @click="setTheme(theme.id)"
              >
                <div class="theme-preview" :style="theme.preview"></div>
                <span>{{ theme.label }}</span>
              </button>
            </div>
          </div>

          <div class="setting-group">
            <label>Map Display</label>
            <div class="map-options">
              <div class="option-row" v-for="option in mapOptions" :key="option.id">
                <span>{{ option.label }}</span>
                <label class="switch">
                  <input 
                    type="checkbox" 
                    v-model="option.enabled"
                    @change="updateMapSettings"
                  />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Privacy Settings -->
      <div class="settings-section">
        <h2>Privacy & Security</h2>
        <div class="settings-card">
          <div class="setting-group">
            <label>Two-Factor Authentication</label>
            <div class="two-factor-status">
              <template v-if="twoFactorEnabled">
                <div class="status enabled">
                  <i class="fas fa-shield-check"></i>
                  Enabled
                </div>
                <button @click="disableTwoFactor" class="btn-secondary">
                  Disable
                </button>
              </template>
              <template v-else>
                <div class="status disabled">
                  <i class="fas fa-shield-exclamation"></i>
                  Disabled
                </div>
                <button @click="enableTwoFactor" class="btn-primary">
                  Enable
                </button>
              </template>
            </div>
          </div>

          <div class="setting-group">
            <label>Session Management</label>
            <div class="sessions-list">
              <div 
                v-for="session in activeSessions"
                :key="session.id"
                class="session-item"
              >
                <div class="session-info">
                  <i :class="session.deviceIcon"></i>
                  <div class="session-details">
                    <span class="device-name">{{ session.deviceName }}</span>
                    <span class="last-active">Last active: {{ session.lastActive }}</span>
                  </div>
                </div>
                <button 
                  @click="terminateSession(session.id)"
                  class="btn-danger"
                  :disabled="session.current"
                >
                  {{ session.current ? 'Current Session' : 'Terminate' }}
                </button>
              </div>
            </div>
          </div>

          <div class="setting-group danger-zone">
            <label>Danger Zone</label>
            <div class="danger-actions">
              <button @click="showDeleteConfirm = true" class="btn-danger">
                <i class="fas fa-trash"></i>
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Account Confirmation Modal -->
    <modal v-if="showDeleteConfirm" @close="showDeleteConfirm = false">
      <template #header>
        <h3>Delete Account</h3>
      </template>
      <template #body>
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <div class="confirmation-input">
          <label>Please type "DELETE" to confirm:</label>
          <input 
            v-model="deleteConfirmation"
            type="text"
            placeholder="Type DELETE"
          />
        </div>
      </template>
      <template #footer>
        <button 
          @click="deleteAccount"
          class="btn-danger"
          :disabled="deleteConfirmation !== 'DELETE'"
        >
          Delete Account
        </button>
        <button @click="showDeleteConfirm = false" class="btn-secondary">
          Cancel
        </button>
      </template>
    </modal>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'
import Modal from '@/components/Modal.vue'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

// Email Notifications
const emailNotifications = ref([
  { id: 1, label: 'Flight Updates', enabled: true },
  { id: 2, label: 'Weather Alerts', enabled: true },
  { id: 3, label: 'System Notifications', enabled: true },
  { id: 4, label: 'Marketing', enabled: false }
])

// Time Zones
const timeZones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Denver', label: 'Mountain Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' }
]
const timeZone = ref('UTC')

// Units
const units = ref({
  distance: {
    label: 'Distance',
    value: 'nm',
    options: [
      { value: 'nm', label: 'Nautical Miles' },
      { value: 'km', label: 'Kilometers' },
      { value: 'mi', label: 'Miles' }
    ]
  },
  speed: {
    label: 'Speed',
    value: 'kts',
    options: [
      { value: 'kts', label: 'Knots' },
      { value: 'mph', label: 'Miles per Hour' },
      { value: 'kph', label: 'Kilometers per Hour' }
    ]
  },
  temperature: {
    label: 'Temperature',
    value: 'c',
    options: [
      { value: 'c', label: 'Celsius' },
      { value: 'f', label: 'Fahrenheit' }
    ]
  }
})

// Themes
const themes = [
  {
    id: 'light',
    label: 'Light',
    preview: {
      background: 'linear-gradient(to right, #f8fafc 50%, #ffffff 50%)'
    }
  },
  {
    id: 'dark',
    label: 'Dark',
    preview: {
      background: 'linear-gradient(to right, #1e293b 50%, #0f172a 50%)'
    }
  },
  {
    id: 'system',
    label: 'System',
    preview: {
      background: 'linear-gradient(to right, #f8fafc 50%, #1e293b 50%)'
    }
  }
]
const currentTheme = ref('light')

// Map Options
const mapOptions = ref([
  { id: 1, label: 'Show Airways', enabled: true },
  { id: 2, label: 'Show Waypoints', enabled: true },
  { id: 3, label: 'Show Weather', enabled: true },
  { id: 4, label: 'Night Mode', enabled: false }
])

// Two Factor Authentication
const twoFactorEnabled = ref(false)
const showDeleteConfirm = ref(false)
const deleteConfirmation = ref('')

// Active Sessions
const activeSessions = ref([
  {
    id: 1,
    deviceName: 'Chrome on MacBook Pro',
    deviceIcon: 'fas fa-laptop',
    lastActive: 'Now',
    current: true
  },
  {
    id: 2,
    deviceName: 'Safari on iPhone 12',
    deviceIcon: 'fas fa-mobile-alt',
    lastActive: '2 hours ago',
    current: false
  },
  {
    id: 3,
    deviceName: 'Firefox on Windows PC',
    deviceIcon: 'fas fa-desktop',
    lastActive: '1 day ago',
    current: false
  }
])

// Methods
function updateNotifications() {
  toast.success('Notification preferences updated')
}

function updateTimeZone() {
  toast.success('Time zone updated')
}

function updateUnits() {
  toast.success('Unit preferences updated')
}

function setTheme(themeId) {
  currentTheme.value = themeId
  toast.success('Theme updated')
}

function updateMapSettings() {
  toast.success('Map settings updated')
}

async function enableTwoFactor() {
  // Implement 2FA setup flow
  toast.info('Two-factor authentication setup coming soon')
}

async function disableTwoFactor() {
  twoFactorEnabled.value = false
  toast.success('Two-factor authentication disabled')
}

async function terminateSession(sessionId) {
  activeSessions.value = activeSessions.value.filter(s => s.id !== sessionId)
  toast.success('Session terminated')
}

async function deleteAccount() {
  try {
    await authStore.deleteAccount()
    toast.success('Account deleted successfully')
    router.push('/login')
  } catch (error) {
    toast.error('Failed to delete account')
  }
}
</script>

<style lang="scss" scoped>
.settings {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.settings-header {
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: var(--text-secondary);
  }
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.settings-section {
  h2 {
    font-size: 1.25rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }
}

.settings-card {
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-sm);
}

.setting-group {
  &:not(:last-child) {
    margin-bottom: 2rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
  }
  
  label {
    display: block;
    font-weight: 500;
    margin-bottom: 1rem;
  }
}

.notification-options {
  display: grid;
  gap: 1rem;
}

.toggle-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  
  input[type="checkbox"] {
    accent-color: var(--primary);
  }
}

.select-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  
  &:focus {
    border-color: var(--primary);
    box-shadow: 0 0 0 2px var(--primary-light);
  }
}

.units-grid {
  display: grid;
  gap: 1rem;
}

.unit-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  select {
    width: 200px;
  }
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.theme-btn {
  border: none;
  background: none;
  padding: 0;
  cursor: pointer;
  text-align: center;
  
  .theme-preview {
    width: 100%;
    height: 80px;
    border-radius: var(--radius-md);
    margin-bottom: 0.5rem;
    border: 2px solid transparent;
    transition: all var(--transition-fast);
  }
  
  span {
    color: var(--text-secondary);
  }
  
  &.active {
    .theme-preview {
      border-color: var(--primary);
    }
    
    span {
      color: var(--primary);
      font-weight: 500;
    }
  }
}

.map-options {
  display: grid;
  gap: 1rem;
}

.option-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.switch {
  position: relative;
  display: inline-block;
  width: 48px;
  height: 24px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
    
    &:checked + .slider {
      background: var(--primary);
      
      &:before {
        transform: translateX(24px);
      }
    }
  }
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--border-color);
  border-radius: 24px;
  transition: all var(--transition-fast);
  
  &:before {
    content: '';
    position: absolute;
    height: 20px;
    width: 20px;
    left: 2px;
    bottom: 2px;
    background: white;
    border-radius: 50%;
    transition: all var(--transition-fast);
  }
}

.two-factor-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  .status {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
    
    &.enabled {
      color: var(--success);
    }
    
    &.disabled {
      color: var(--warning);
    }
  }
}

.sessions-list {
  display: grid;
  gap: 1rem;
}

.session-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
}

.session-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  
  i {
    font-size: 1.25rem;
    color: var(--text-secondary);
  }
}

.session-details {
  display: flex;
  flex-direction: column;
  
  .device-name {
    font-weight: 500;
  }
  
  .last-active {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.danger-zone {
  label {
    color: var(--error);
  }
}

.danger-actions {
  display: flex;
  gap: 1rem;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1rem;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
  
  &:hover {
    background: var(--primary-dark);
  }
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
  
  &:hover {
    background: var(--bg-primary);
  }
}

.btn-danger {
  background: var(--error);
  color: white;
  border: none;
  
  &:hover {
    background: var(--error-dark);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

.confirmation-input {
  margin-top: 1rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }
  
  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    
    &:focus {
      border-color: var(--error);
      box-shadow: 0 0 0 2px var(--error-light);
    }
  }
}

@media (max-width: 768px) {
  .settings {
    padding: 1rem;
  }
  
  .settings-grid {
    grid-template-columns: 1fr;
  }
  
  .theme-options {
    grid-template-columns: repeat(3, 1fr);
  }
  
  .unit-option {
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    
    select {
      width: 100%;
    }
  }
}
</style> 