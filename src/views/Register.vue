<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-box glass">
        <h1>Register</h1>
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input 
              id="name"
              v-model="form.name"
              type="text"
              required
              autocomplete="name"
              :class="{ error: errors.name }"
            >
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input 
              id="email"
              v-model="form.email"
              type="email"
              required
              autocomplete="email"
              :class="{ error: errors.email }"
            >
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="form.password"
              type="password"
              required
              autocomplete="new-password"
              :class="{ error: errors.password }"
            >
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input 
              id="password_confirmation"
              v-model="form.password_confirmation"
              type="password"
              required
              autocomplete="new-password"
              :class="{ error: errors.password_confirmation }"
            >
            <span v-if="errors.password_confirmation" class="error-message">
              {{ errors.password_confirmation }}
            </span>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Register</span>
          </button>
        </form>

        <div class="auth-links">
          <router-link to="/login">Already have an account? Login</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const auth = useAuthStore()

const form = ref({
  name: '',
  email: '',
  password: '',
  password_confirmation: ''
})

const errors = ref({})
const isLoading = ref(false)

async function handleSubmit() {
  errors.value = {}
  isLoading.value = true

  try {
    await auth.register(form.value)
    router.push('/')
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value.general = 'Registration failed. Please try again.'
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