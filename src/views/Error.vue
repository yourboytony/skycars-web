<template>
  <div class="error-page">
    <div class="error-content">
      <div class="error-icon">
        <i class="fas fa-exclamation-triangle"></i>
      </div>
      <h1>Something went wrong</h1>
      <p>{{ message || 'Please try refreshing the page' }}</p>
      <div class="action-buttons">
        <button @click="refresh" class="btn-primary">
          <i class="fas fa-sync"></i>
          Refresh Page
        </button>
        <button @click="goHome" class="btn-secondary">
          <i class="fas fa-home"></i>
          Go to Dashboard
        </button>
      </div>
      <div class="support-link">
        Need help? <a @click="contactSupport">Contact Support</a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const props = defineProps({
  message: {
    type: String,
    default: ''
  }
})

const router = useRouter()
const toast = useToast()

function refresh() {
  window.location.reload()
}

function goHome() {
  router.push('/dashboard')
}

function contactSupport() {
  toast.info('Support system coming soon!')
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--bg-secondary);
}

.error-content {
  max-width: 500px;
  text-align: center;
  background: white;
  padding: 48px;
  border-radius: 16px;
  box-shadow: var(--shadow-lg);
}

.error-icon {
  font-size: 64px;
  color: var(--warning);
  margin-bottom: 24px;
}

h1 {
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 16px;
}

p {
  color: var(--text-secondary);
  margin-bottom: 32px;
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 32px;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
}

.btn-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  border: 1px solid var(--border-color);
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
}

.support-link {
  font-size: 14px;
  color: var(--text-secondary);
}

.support-link a {
  color: var(--primary);
  text-decoration: none;
  cursor: pointer;
}

.support-link a:hover {
  text-decoration: underline;
}

@media (max-width: 640px) {
  .error-content {
    padding: 32px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style> 