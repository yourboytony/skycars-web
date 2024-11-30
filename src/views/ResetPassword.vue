<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Reset Password</h1>
      <form @submit.prevent="handleReset" class="reset-form">
        <div class="form-group">
          <label>New Password</label>
          <input 
            type="password" 
            v-model="password"
            required
            placeholder="Enter new password"
          >
        </div>
        <div class="form-group">
          <label>Confirm Password</label>
          <input 
            type="password" 
            v-model="confirmPassword"
            required
            placeholder="Confirm new password"
          >
        </div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Resetting...' : 'Reset Password' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const token = route.params.token

const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)

async function handleReset() {
  if (password.value !== confirmPassword.value) {
    alert('Passwords do not match')
    return
  }
  // TODO: Implement password reset
}
</script>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg-main);
}

.auth-card {
  width: 100%;
  max-width: 400px;
  background: white;
  padding: 32px;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.reset-form {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style> 