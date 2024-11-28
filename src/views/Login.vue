<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-box glass">
        <h1>Login</h1>
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

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

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
    const redirectPath = route.query.redirect || '/'
    router.push(redirectPath)
  } catch (error) {
    if (error.response?.data?.errors) {
      errors.value = error.response.data.errors
    } else {
      errors.value.general = 'Login failed. Please try again.'
    }
  } finally {
    isLoading.value = false
  }
}
</script> 