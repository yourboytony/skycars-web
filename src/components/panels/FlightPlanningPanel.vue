<template>
  <!-- Add SimBrief credentials section -->
  <div v-if="!hasSimBriefCredentials" class="simbrief-setup">
    <div class="setup-card">
      <h3>SimBrief Integration</h3>
      <p>Enter your SimBrief username or pilot ID to enable flight plan generation.</p>
      
      <form @submit.prevent="saveSimBriefCredentials" class="credentials-form">
        <div class="form-group">
          <label>SimBrief Username or Pilot ID</label>
          <input 
            v-model="simBriefUsername"
            type="text"
            placeholder="Enter username or pilot ID"
            required
          >
        </div>
        <button type="submit" class="btn-primary">Save Credentials</button>
      </form>
    </div>
  </div>

  <!-- Rest of flight planning content -->
  <div v-else class="flight-planning-content">
    <!-- Existing content -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const simBriefUsername = ref('')
const hasSimBriefCredentials = ref(false)

onMounted(async () => {
  const credentials = await userStore.getSimBriefCredentials()
  if (credentials) {
    hasSimBriefCredentials.value = true
    simBriefUsername.value = credentials.username
  }
})

async function saveSimBriefCredentials() {
  await userStore.saveSimBriefCredentials({
    username: simBriefUsername.value
  })
  hasSimBriefCredentials.value = true
}
</script>

<style scoped>
/* Remove playful styles, use professional ones */
.simbrief-setup {
  max-width: 500px;
  margin: 2rem auto;
}

.setup-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 1.5rem;
}

.credentials-form {
  margin-top: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #374151;
}

input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 4px;
}

.btn-primary {
  background: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  border: none;
  font-weight: 500;
}

.btn-primary:hover {
  background: #1d4ed8;
}
</style> 