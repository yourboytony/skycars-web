<template>
  <div class="settings-page">
    <div class="settings-container">
      <h1>Settings</h1>

      <!-- Account Settings -->
      <section class="settings-section">
        <h2>Account Settings</h2>
        <div class="settings-group">
          <div class="setting-item">
            <label>Email Notifications</label>
            <div class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.emailNotifications"
                @change="saveSettings"
              >
              <span class="toggle-slider"></span>
            </div>
          </div>

          <div class="setting-item">
            <label>Dark Mode</label>
            <div class="toggle-switch">
              <input 
                type="checkbox" 
                v-model="settings.darkMode"
                @change="saveSettings"
              >
              <span class="toggle-slider"></span>
            </div>
          </div>
        </div>
      </section>

      <!-- Weather Preferences -->
      <section class="settings-section">
        <h2>Weather Preferences</h2>
        <div class="settings-group">
          <div class="setting-item">
            <label>Temperature Unit</label>
            <select 
              v-model="settings.tempUnit"
              @change="saveSettings"
            >
              <option value="celsius">Celsius</option>
              <option value="fahrenheit">Fahrenheit</option>
            </select>
          </div>

          <div class="setting-item">
            <label>Wind Speed Unit</label>
            <select 
              v-model="settings.windUnit"
              @change="saveSettings"
            >
              <option value="kts">Knots</option>
              <option value="mph">MPH</option>
              <option value="kph">KPH</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Display Preferences -->
      <section class="settings-section">
        <h2>Display Preferences</h2>
        <div class="settings-group">
          <div class="setting-item">
            <label>Language</label>
            <select 
              v-model="settings.language"
              @change="saveSettings"
            >
              <option value="en">English</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div class="setting-item">
            <label>Time Format</label>
            <select 
              v-model="settings.timeFormat"
              @change="saveSettings"
            >
              <option value="12">12-hour</option>
              <option value="24">24-hour</option>
            </select>
          </div>
        </div>
      </section>

      <!-- Save Button -->
      <div class="settings-actions">
        <button 
          class="save-btn" 
          @click="saveSettings"
          :disabled="!hasChanges"
        >
          {{ saving ? 'Saving...' : 'Save Changes' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const saving = ref(false)
const originalSettings = ref(null)

const settings = ref({
  emailNotifications: true,
  darkMode: false,
  tempUnit: 'celsius',
  windUnit: 'kts',
  language: 'en',
  timeFormat: '24'
})

const hasChanges = computed(() => {
  if (!originalSettings.value) return false
  return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value)
})

const loadSettings = async () => {
  try {
    // Placeholder for API call
    // const response = await fetch('...')
    // settings.value = await response.json()
    originalSettings.value = { ...settings.value }
  } catch (error) {
    console.error('Failed to load settings:', error)
  }
}

const saveSettings = async () => {
  if (!hasChanges.value) return

  saving.value = true
  try {
    // Placeholder for API call
    // await fetch('...', {
    //   method: 'PUT',
    //   headers: {
    //     'Authorization': `Bearer ${auth.token}`,
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(settings.value)
    // })
    
    await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
    originalSettings.value = { ...settings.value }
  } catch (error) {
    console.error('Failed to save settings:', error)
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.settings-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.settings-container {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
}

h1 {
  color: #FF2E63;
  margin-bottom: 2rem;
  font-size: 2rem;
}

.settings-section {
  margin-bottom: 2rem;
}

h2 {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 1rem;
  font-size: 1.25rem;
}

.settings-group {
  display: grid;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 1.5rem;
  border-radius: 8px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.setting-item label {
  color: rgba(255, 255, 255, 0.8);
}

select {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  min-width: 120px;
}

select:focus {
  outline: none;
  border-color: #FF2E63;
}

.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.2);
  transition: .4s;
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #FF2E63;
}

input:checked + .toggle-slider:before {
  transform: translateX(26px);
}

.settings-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

.save-btn {
  background: #FF2E63;
  color: white;
  border: none;
  padding: 0.75rem 2rem;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;
}

.save-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(255, 46, 99, 0.3);
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .settings-page {
    padding: 1rem;
  }

  .settings-container {
    padding: 1.5rem;
  }

  .setting-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
}
</style> 