<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>Create Account</h2>
        <button class="close-btn" @click="$emit('close')">&times;</button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="username" 
            required
            :disabled="loading"
            @input="error = ''"
          >
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="email" 
            required
            :disabled="loading"
            @input="error = ''"
          >
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <input 
            type="password" 
            id="password" 
            v-model="password" 
            required
            :disabled="loading"
            @input="error = ''"
          >
        </div>

        <div v-if="error" class="error-message">
          {{ error }}
        </div>

        <button 
          type="submit" 
          class="submit-btn" 
          :disabled="loading || !isValid"
        >
          {{ loading ? 'Creating account...' : 'Register' }}
        </button>

        <p class="switch-form">
          Already have an account? 
          <a href="#" @click.prevent="$emit('switch', 'login')">Login</a>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '../stores/auth'

const authStore = useAuthStore()
const username = ref('')
const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const isValid = computed(() => {
  return username.value.length >= 3 && 
         email.value.includes('@') && 
         password.value.length >= 6
})

const handleSubmit = async () => {
  if (!isValid.value) return
  
  loading.value = true
  error.value = ''
  
  try {
    await authStore.register(email.value, password.value, username.value)
    username.value = ''
    email.value = ''
    password.value = ''
    loading.value = false
    $emit('close')
  } catch (err) {
    error.value = err.message || 'Registration failed'
    loading.value = false
  }
}
</script>

<style scoped>
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

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  position: relative;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group input {
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

.submit-btn {
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  color: #dc2626;
  font-size: 0.875rem;
}

.switch-form {
  text-align: center;
  margin-top: 1rem;
}

.switch-form a {
  color: var(--primary-color);
  text-decoration: none;
}
</style> 