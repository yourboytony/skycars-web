<template>
  <div class="settings-page">
    <h1>Settings</h1>

    <div class="settings-grid">
      <!-- Display Settings -->
      <div class="settings-card">
        <h2>Display Settings</h2>
        <div class="settings-content">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Dark Mode</h3>
              <p>Enable dark mode for the application</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="settings.darkMode">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Units</h3>
              <p>Choose your preferred unit system</p>
            </div>
            <div class="setting-control">
              <select v-model="settings.units">
                <option value="imperial">Imperial</option>
                <option value="metric">Metric</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Notification Settings -->
      <div class="settings-card">
        <h2>Notifications</h2>
        <div class="settings-content">
          <div class="setting-item">
            <div class="setting-info">
              <h3>Email Notifications</h3>
              <p>Receive flight updates via email</p>
            </div>
            <div class="setting-control">
              <label class="switch">
                <input type="checkbox" v-model="settings.emailNotifications">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- API Integrations -->
      <div class="settings-card">
        <h2>API Integrations</h2>
        <div class="settings-content">
          <div class="setting-item">
            <div class="setting-info">
              <h3>SimBrief</h3>
              <p>Connect your SimBrief account</p>
            </div>
            <div class="setting-control">
              <input 
                type="text" 
                v-model="settings.simbriefUsername"
                placeholder="SimBrief username"
              >
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <h3>Weather API</h3>
              <p>Configure weather data source</p>
            </div>
            <div class="setting-control">
              <input 
                type="password" 
                v-model="settings.weatherApiKey"
                placeholder="API Key"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Integration Section -->
      <div class="settings-card">
        <h2>Integrations</h2>
        <div class="integrations-grid">
          <!-- SimBrief Integration -->
          <div class="integration-item">
            <PlaceholderIcon 
              type="simbrief" 
              size="md"
            />
            <div class="integration-info">
              <h3>SimBrief</h3>
              <p>Connect your SimBrief account</p>
            </div>
            <button class="btn-secondary">Connect</button>
          </div>

          <!-- Navigraph Integration -->
          <div class="integration-item">
            <PlaceholderIcon 
              type="navigraph" 
              size="md"
            />
            <div class="integration-info">
              <h3>Navigraph</h3>
              <p>Access charts and navigation data</p>
            </div>
            <button class="btn-secondary">Connect</button>
          </div>

          <!-- Weather Service -->
          <div class="integration-item">
            <PlaceholderIcon 
              type="weatherCenter" 
              size="md"
            />
            <div class="integration-info">
              <h3>Weather Service</h3>
              <p>Configure weather data provider</p>
            </div>
            <button class="btn-secondary">Configure</button>
          </div>
        </div>
      </div>
    </div>

    <div class="settings-actions">
      <button class="btn-primary" @click="saveSettings" :disabled="isSaving">
        {{ isSaving ? 'Saving...' : 'Save Changes' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import PlaceholderIcon from '@/components/PlaceholderIcon.vue'

const userStore = useUserStore()
const isSaving = ref(false)

const settings = ref({
  darkMode: false,
  units: 'imperial',
  emailNotifications: true,
  simbriefUsername: '',
  weatherApiKey: ''
})

async function saveSettings() {
  try {
    isSaving.value = true
    await userStore.updatePreferences(settings.value)
    // TODO: Show success message
  } catch (error) {
    // TODO: Show error message
  } finally {
    isSaving.value = false
  }
}
</script>

<style scoped>
.settings-page {
  padding: 24px;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.settings-card {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: var(--shadow-sm);
}

.settings-content {
  margin-top: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-info h3 {
  margin-bottom: 4px;
}

.setting-info p {
  color: var(--text-secondary);
  font-size: 14px;
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

.settings-actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

select, input[type="text"], input[type="password"] {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  width: 200px;
}

.integrations-grid {
  display: grid;
  gap: 16px;
  margin-top: 16px;
}

.integration-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
}

.integration-info {
  flex: 1;
}

.integration-info h3 {
  margin-bottom: 4px;
}

.integration-info p {
  color: var(--text-secondary);
  font-size: 14px;
}
</style> 