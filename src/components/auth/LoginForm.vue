<template>
  <form @submit.prevent="handleSubmit" class="auth-form">
    <div class="form-header">
      <h2>Welcome Back</h2>
      <p>Sign in to continue to your dashboard</p>
    </div>

    <div class="form-group">
      <label for="email">Email</label>
      <input
        id="email"
        v-model="email"
        type="email"
        required
        placeholder="Enter your email"
        :disabled="loading"
      />
    </div>

    <div class="form-group">
      <label for="password">Password</label>
      <input
        id="password"
        v-model="password"
        type="password"
        required
        placeholder="Enter your password"
        :disabled="loading"
      />
    </div>

    <div v-if="error" class="error-message">
      {{ error }}
    </div>

    <button 
      type="submit" 
      class="btn-primary" 
      :disabled="loading"
    >
      <span v-if="loading">Signing in...</span>
      <span v-else>Sign In</span>
    </button>

    <div class="form-footer">
      <p>
        Don't have an account?
        <router-link to="/register">Sign up</router-link>
      </p>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

async function handleSubmit() {
  if (loading.value) return

  loading.value = true
  error.value = ''

  try {
    const success = await authStore.login(email.value, password.value)
    if (success) {
      const redirect = route.query.redirect as string || '/dashboard'
      router.push(redirect)
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  p {
    color: var(--text-secondary);
  }
}

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: var(--text-secondary);
  }

  input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--border-color);
    border-radius: var(--radius-md);
    background: var(--bg-secondary);
    color: var(--text-primary);
    transition: all var(--transition-fast);

    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 2px var(--primary-transparent);
    }

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
  }
}

.error-message {
  color: var(--error);
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: var(--error-bg);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);

  &:hover {
    background: var(--primary-dark);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  color: var(--text-secondary);

  a {
    color: var(--primary);
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style> 