<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-box">
        <div class="auth-header">
          <h1>Create Account</h1>
          <p>Join us today and start your journey</p>
        </div>

        <form @submit.prevent="handleRegister" class="auth-form">
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
            <span>{{ loading ? 'Creating Account...' : 'Create Account' }}</span>
          </button>
        </form>

        <div class="auth-footer">
          <p>
            Already have an account? 
            <router-link to="/login">Sign in</router-link>
          </p>
        </div>
      </div>
    </div>
    
    <SuccessModal 
      v-if="showSuccess" 
      @close="handleSuccessClose"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import SuccessModal from '@/components/SuccessModal.vue'

const API_URL = 'https://skycars-api.nigroan67.workers.dev'
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const showSuccess = ref(false)

const isValid = computed(() => {
  return email.value && password.value && password.value.length >= 6
})

async function handleRegister() {
  if (!isValid.value) return
  
  loading.value = true
  error.value = ''

  try {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: email.value,
        password: password.value
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.error || 'Registration failed')
    }

    // Store auth data
    authStore.setAuth({
      token: data.token,
      user: data.user
    })

    // Show success modal
    showSuccess.value = true

  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

function handleSuccessClose() {
  showSuccess.value = false
  router.push('/login')
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