<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <h1>Welcome Back</h1>
          <p>Enter your credentials to continue</p>
        </div>

        <form @submit.prevent="handleLogin" class="auth-form">
          <div class="form-group">
            <input 
              type="email" 
              id="email"
              v-model="email"
              placeholder="Email"
              required
              :disabled="loading"
            >
          </div>

          <div class="form-group">
            <input 
              type="password" 
              id="password"
              v-model="password"
              placeholder="Password"
              required
              :disabled="loading"
            >
          </div>

          <div v-if="error" class="error-alert">
            {{ error }}
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading || !isValid"
          >
            <span v-if="loading" class="loading-spinner"></span>
            <span>{{ loading ? 'Signing In...' : 'Sign In' }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Don't have an account? 
            <router-link to="/register">Create one</router-link>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const API_URL = 'https://skycars-api.nigroan67.workers.dev'
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

const isValid = computed(() => {
  return email.value && password.value
})

async function handleLogin() {
  console.log('Login attempt started')
  
  if (!isValid.value) {
    console.log('Form validation failed')
    return
  }
  
  loading.value = true
  error.value = ''

  try {
    console.log('Sending login request...')

    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    console.log('Response status:', response.status)

    const data = await response.json()
    console.log('Response data:', data)

    if (!response.ok) {
      throw new Error(data.error || 'Login failed')
    }

    console.log('Login successful, setting auth data...')

    authStore.setAuth({
      token: data.token,
      user: data.user
    })

    console.log('Auth data set, redirecting...')

    email.value = ''
    password.value = ''

    router.push('/dashboard')

  } catch (err) {
    console.error('Login error:', err)
    error.value = err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
}

.auth-box {
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 2rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-header h1 {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #6b7280;
  font-size: 0.875rem;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  position: relative;
}

.form-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 0.875rem;
  transition: all 0.2s;
  background: #f9fafb;
}

.form-group input:focus {
  outline: none;
  border-color: #2563eb;
  background: #ffffff;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: background-color 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #1d4ed8;
}

.submit-btn:disabled {
  background: #93c5fd;
  cursor: not-allowed;
}

.loading-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid #ffffff;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-alert {
  padding: 0.75rem;
  background: #fee2e2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  color: #dc2626;
  font-size: 0.875rem;
}

.auth-footer {
  margin-top: 2rem;
  text-align: center;
  font-size: 0.875rem;
  color: #6b7280;
}

.auth-footer a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 500;
}

.auth-footer a:hover {
  text-decoration: underline;
}
</style> 