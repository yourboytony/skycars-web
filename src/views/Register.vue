<template>
  <div class="auth-page">
    <div class="auth-container glass">
      <h1>Create Account</h1>
      <p class="subtitle">Join the Skycars community</p>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group" :class="{ 'error': errors.name }">
          <label for="name">Full Name</label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input 
              type="text" 
              id="name"
              v-model="formData.name"
              required
              placeholder="Enter your full name"
            >
          </div>
          <span class="error-message">{{ errors.name }}</span>
        </div>

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
              placeholder="Create a password"
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

        <div class="form-group">
          <label class="terms">
            <input 
              type="checkbox" 
              v-model="formData.acceptTerms"
              required
            >
            <span>I agree to the <a href="/terms" target="_blank">Terms</a> and <a href="/privacy" target="_blank">Privacy Policy</a></span>
          </label>
        </div>

        <button 
          type="submit" 
          class="submit-button"
          :disabled="isLoading || !formData.acceptTerms"
        >
          <span>{{ isLoading ? 'Creating Account...' : 'Create Account' }}</span>
          <i class="fas fa-arrow-right"></i>
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

const router = useRouter()
const showPassword = ref(false)
const isLoading = ref(false)

const formData = reactive({
  name: '',
  email: '',
  password: '',
  acceptTerms: false
})

const errors = reactive({
  name: '',
  email: '',
  password: ''
})

const handleRegister = async () => {
  // Reset errors
  errors.name = ''
  errors.email = ''
  errors.password = ''

  // Validate password
  if (formData.password.length < 8) {
    errors.password = 'Password must be at least 8 characters'
    return
  }

  try {
    isLoading.value = true
    
    // Add your registration logic here
    // Example:
    // const response = await authService.register(formData)
    // localStorage.setItem('token', response.token)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Store token (replace with your actual token)
    localStorage.setItem('user-token', 'dummy-token')
    
    // Redirect to dashboard
    router.push('/dashboard')
  } catch (error) {
    console.error('Registration error:', error)
    errors.email = 'Email already in use'
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

/* Add these styles to App.vue */
.auth-form {
  margin-top: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
  text-align: left;
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.input-wrapper input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--background-primary);
  color: var(--text-color);
}

.toggle-password {
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
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
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
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
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.form-group.error input {
  border-color: #ef4444;
}
</style> 