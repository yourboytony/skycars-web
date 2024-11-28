<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-box glass">
        <h1>Login</h1>
        
        <!-- General Error Message -->
        <div v-if="errors.general" class="error-banner">
          {{ errors.general }}
        </div>

        <form @submit.prevent="handleSubmit">
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
              autocomplete="current-password"
              :class="{ error: errors.password }"
            >
            <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <span v-else>Login</span>
          </button>
        </form>

        <div class="auth-links">
          <router-link to="/register">Need an account? Register</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useMarketplaceStore } from '../stores/marketplace'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()
const marketplace = useMarketplaceStore()

const form = ref({
  email: '',
  password: ''
})

const errors = ref({})
const isLoading = ref(false)

async function handleSubmit() {
  errors.value = {}
  isLoading.value = true

  try {
    await auth.login(form.value)
    
    // Fetch initial marketplace data
    if (auth.isAuthenticated()) {
      await marketplace.fetchCredits()
    }
    
    // Redirect to intended destination or home
    const redirectPath = route.query.redirect || '/'
    await router.push(redirectPath)
  } catch (error) {
    console.error('Login error:', error)
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else if (error.response?.data?.message) {
      errors.value.general = error.response.data.message
    } else {
      errors.value.general = 'Login failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Previous styles... */

.error-banner {
  margin-bottom: 1.5rem;
  padding: 0.75rem;
  background: rgba(220, 38, 38, 0.1);
  color: var(--error-color);
  border-radius: 0.5rem;
  text-align: center;
}
</style> 