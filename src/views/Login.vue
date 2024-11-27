<template>
  <div class="auth-page">
    <div class="auth-container glass">
      <h1>Welcome Back</h1>
      <p class="subtitle">Log in to your account</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group" :class="{ 'error': errors.email }">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input 
              type="email" 
              id="email"
              v-model="formData.email"
              required
              placeholder="Enter your email"
            >
          </div>
          <span class="error-message">{{ errors.email }}</span>
        </div>

        <div class="form-group" :class="{ 'error': errors.password }">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password"
              v-model="formData.password"
              required
              placeholder="Enter your password"
            >
            <button 
              type="button"
              class="toggle-password"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <span class="error-message">{{ errors.password }}</span>
        </div>

        <div class="form-options">
          <label class="remember-me">
            <input type="checkbox" v-model="formData.remember">
            <span>Remember me</span>
          </label>
          <router-link to="/forgot-password" class="forgot-password">
            Forgot Password?
          </router-link>
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading"
        >
          <span>{{ isLoading ? 'Logging in...' : 'Log In' }}</span>
          <i class="fas fa-arrow-right"></i>
        </button>
      </form>

      <div class="auth-footer">
        <p>Don't have an account?</p>
        <router-link to="/register">Create Account</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)

const formData = reactive({
  email: '',
  password: '',
  remember: false
})

const errors = reactive({
  email: '',
  password: ''
})

const handleLogin = async () => {
  // Reset errors
  errors.email = ''
  errors.password = ''

  try {
    isLoading.value = true
    
    // Add your authentication logic here
    // Example:
    // const response = await authService.login(formData)
    // localStorage.setItem('token', response.token)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store token (replace with your actual token)
    localStorage.setItem('user-token', 'dummy-token')
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Login error:', error)
    errors.email = 'Invalid email or password'
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

/* Rest of the styles from App.vue will apply */
</style> 