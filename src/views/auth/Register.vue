<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <img src="@/assets/logo.svg" alt="Logo" class="auth-logo" />
        <h1>Create Account</h1>
        <p>Join us and start your journey</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label for="name">Full Name</label>
          <div class="input-wrapper">
            <i class="fas fa-user"></i>
            <input 
              id="name"
              v-model="name"
              type="text"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <div class="input-wrapper">
            <i class="fas fa-envelope"></i>
            <input 
              id="email"
              v-model="email"
              type="email"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div class="form-group">
          <label for="password">Password</label>
          <div class="input-wrapper">
            <i class="fas fa-lock"></i>
            <input 
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="Create a password"
              required
            />
            <button 
              type="button"
              @click="togglePassword"
              class="password-toggle"
            >
              <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
            </button>
          </div>
          <div class="password-strength" v-if="password">
            <div 
              class="strength-bar"
              :style="{ width: `${passwordStrength}%` }"
              :class="strengthClass"
            ></div>
            <span>{{ strengthText }}</span>
          </div>
        </div>

        <div class="form-group">
          <label class="terms-checkbox">
            <input type="checkbox" v-model="acceptTerms" required />
            <span>I agree to the <a href="#" @click.prevent="showTerms">Terms & Conditions</a></span>
          </label>
        </div>

        <button 
          type="submit" 
          class="btn-submit"
          :disabled="isLoading || !acceptTerms"
        >
          <span v-if="!isLoading">Create Account</span>
          <i v-else class="fas fa-spinner fa-spin"></i>
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account?</p>
        <router-link to="/login" class="btn-link">
          Sign In
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const authStore = useAuthStore()
const toast = useToast()

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const acceptTerms = ref(false)
const isLoading = ref(false)

// Password strength calculation
const passwordStrength = computed(() => {
  if (!password.value) return 0
  let strength = 0
  
  // Length check
  if (password.value.length >= 8) strength += 25
  // Contains number
  if (/\d/.test(password.value)) strength += 25
  // Contains lowercase
  if (/[a-z]/.test(password.value)) strength += 25
  // Contains uppercase
  if (/[A-Z]/.test(password.value)) strength += 25
  
  return strength
})

const strengthClass = computed(() => {
  if (passwordStrength.value <= 25) return 'weak'
  if (passwordStrength.value <= 50) return 'medium'
  if (passwordStrength.value <= 75) return 'good'
  return 'strong'
})

const strengthText = computed(() => {
  if (passwordStrength.value <= 25) return 'Weak'
  if (passwordStrength.value <= 50) return 'Medium'
  if (passwordStrength.value <= 75) return 'Good'
  return 'Strong'
})

async function handleRegister() {
  if (passwordStrength.value < 50) {
    toast.warning('Please choose a stronger password')
    return
  }

  isLoading.value = true
  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value
    })
    toast.success('Account created successfully!')
    router.push('/dashboard')
  } catch (error) {
    toast.error(error.message || 'Registration failed')
  } finally {
    isLoading.value = false
  }
}

function togglePassword() {
  showPassword.value = !showPassword.value
}

function showTerms() {
  // Implement terms modal
  toast.info('Terms & Conditions coming soon')
}
</script>

<style lang="scss" scoped>
// Inherits most styles from Login.vue
.password-strength {
  margin-top: 0.5rem;
  
  .strength-bar {
    height: 4px;
    background: var(--error);
    border-radius: var(--radius-sm);
    transition: all var(--transition-fast);
    margin-bottom: 0.25rem;
    
    &.weak { background: var(--error); }
    &.medium { background: var(--warning); }
    &.good { background: var(--accent); }
    &.strong { background: var(--success); }
  }
  
  span {
    font-size: 0.875rem;
    color: var(--text-secondary);
  }
}

.terms-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  input[type="checkbox"] {
    accent-color: var(--primary);
  }
  
  a {
    color: var(--primary);
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 