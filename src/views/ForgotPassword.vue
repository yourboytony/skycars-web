<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Forgot Password</h1>
      <p class="auth-description">
        Enter your email address and we'll send you a link to reset your password.
      </p>
      
      <form @submit.prevent="handleSubmit" class="forgot-form">
        <div class="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            v-model="email"
            required
            placeholder="Enter your email"
          >
        </div>
        <button type="submit" class="btn-primary" :disabled="isLoading">
          {{ isLoading ? 'Sending...' : 'Send Reset Link' }}
        </button>
      </form>

      <div class="auth-footer">
        <router-link to="/login" class="back-link">
          <i class="fas fa-arrow-left"></i> Back to Login
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const email = ref('')
const isLoading = ref(false)

async function handleSubmit() {
  // TODO: Implement forgot password logic
}
</script>

<style scoped>
.auth-description {
  color: var(--text-secondary);
  margin: 16px 0 24px;
}

.forgot-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.auth-footer {
  margin-top: 24px;
  text-align: center;
}

.back-link {
  color: var(--text-secondary);
  text-decoration: none;
}

.back-link:hover {
  color: var(--primary);
}
</style> 