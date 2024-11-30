<template>
  <div class="not-found">
    <div class="error-content">
      <div class="error-icon">
        <i class="fas fa-plane-slash"></i>
      </div>
      
      <h1>404</h1>
      <h2>Page Not Found</h2>
      
      <p class="error-message">
        Oops! Looks like this flight path doesn't exist.
      </p>
      
      <div class="error-details">
        <p>The page you're looking for might have:</p>
        <ul>
          <li>Been moved to a different location</li>
          <li>Been deleted or renamed</li>
          <li>Never existed in the first place</li>
        </ul>
      </div>

      <div class="action-buttons">
        <button 
          class="btn-secondary"
          @click="goBack"
        >
          <i class="fas fa-arrow-left"></i>
          Go Back
        </button>
        
        <router-link 
          to="/" 
          class="btn-primary"
        >
          <i class="fas fa-home"></i>
          Return to Dashboard
        </router-link>
      </div>

      <div class="help-text">
        <p>
          Need help? 
          <a href="/support" class="support-link">Contact Support</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  background: var(--bg-main);
}

.error-content {
  text-align: center;
  max-width: 500px;
  padding: 40px;
  background: white;
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

.error-icon {
  font-size: 64px;
  color: var(--primary);
  margin-bottom: 24px;
}

.error-icon i {
  transform: rotate(-45deg);
}

h1 {
  font-size: 72px;
  font-weight: 700;
  color: var(--primary);
  margin: 0;
  line-height: 1;
}

h2 {
  font-size: 24px;
  color: var(--text-primary);
  margin: 8px 0 24px;
}

.error-message {
  font-size: 18px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.error-details {
  text-align: left;
  margin-bottom: 32px;
}

.error-details ul {
  list-style: none;
  padding: 0;
  margin: 12px 0 0;
}

.error-details li {
  padding: 8px 0;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-details li::before {
  content: "•";
  color: var(--primary);
}

.action-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-bottom: 24px;
}

.btn-secondary, .btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
}

.btn-secondary {
  background: #f1f5f9;
  color: var(--text-primary);
  border: none;
  cursor: pointer;
}

.btn-secondary:hover {
  background: #e2e8f0;
}

.btn-primary {
  background: var(--primary);
  color: white;
  border: none;
}

.btn-primary:hover {
  background: var(--primary-dark);
}

.help-text {
  color: var(--text-secondary);
  font-size: 14px;
}

.support-link {
  color: var(--primary);
  text-decoration: none;
  font-weight: 500;
}

.support-link:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .error-content {
    padding: 24px;
  }

  h1 {
    font-size: 56px;
  }

  h2 {
    font-size: 20px;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style> 