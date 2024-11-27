<template>
  <div class="auth-page">
    <div class="auth-container glass">
      <h1>Create Account</h1>
      <p class="subtitle">Join the Skycars community</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group" :class="{ 'error': errors.name }">
          <label for="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            v-model="formData.name"
            required
            placeholder="Enter your full name"
          >
          <span class="error-message">{{ errors.name }}</span>
        </div>

        <div class="form-group" :class="{ 'error': errors.email }">
          <label for="email">Email</label>
          <input 
            type="email" 
            id="email"
            v-model="formData.email"
            required
            placeholder="Enter your email"
          >
          <span class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group" :class="{ 'error': errors.password }">
          <label for="password">Password</label>
          <input 
            :type="showPassword ? 'text' : 'password'" 
            id="password"
            v-model="formData.password"
            required
            placeholder="Create a password"
          >
          <button 
            type="button"
            class="toggle-password"
            @click="showPassword = !showPassword"
          >
            <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
          </button>
          <span class="error-message">{{ errors.password }}</span>
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading"
        >
          {{ isLoading ? 'Creating Account...' : 'Create Account' }}
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account?</p>
        <router-link to="/login">Log In</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()
const showPassword = ref(false)
const isLoading = ref(false)

const formData = reactive({
  name: '',
  email: '',
  password: ''
})

const errors = reactive({
  name: '',
  email: '',
  password: ''
})

const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.password = ''

  if (formData.name.length < 2) {
    errors.name = 'Name must be at least 2 characters'
    isValid = false
  }

  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  return isValid
}

const handleRegister = async () => {
  if (!validateForm()) return

  try {
    isLoading.value = true
    await auth.register(formData.name, formData.email, formData.password)
    router.push('/dashboard')
  } catch (error) {
    if (error.message.includes('already in use')) {
      errors.email = error.message
    } else {
      errors.email = error.message
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: var(--background-primary);
}

.auth-container {
  width: 100%;
  max-width: 400px;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
}

.auth-form {
  margin-top: 2rem;
  text-align: left;
}

.form-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-light);
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--background-secondary);
  color: var(--text-color);
}

.form-group.error input {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 2.5rem;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
}

.submit-button {
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 2rem;
  color: var(--text-light);
}

.auth-footer a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  margin-left: 0.5rem;
}
</style> 