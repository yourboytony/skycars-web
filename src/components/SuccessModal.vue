<template>
  <div class="modal-overlay" @click="$emit('close')">
    <div class="modal-content" @click.stop>
      <div class="success-icon">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      
      <h2>Account Created!</h2>
      <p>Your account has been successfully created.</p>
      
      <button class="continue-btn" @click="handleContinue">
        Continue to Login
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleContinue = () => {
  router.push('/login')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  max-width: 400px;
  width: 90%;
  animation: modal-pop 0.3s ease-out;
}

@keyframes modal-pop {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.success-icon {
  width: 64px;
  height: 64px;
  margin: 0 auto 1.5rem;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.success-icon svg {
  width: 32px;
  height: 32px;
}

h2 {
  color: #111827;
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

p {
  color: #6b7280;
  margin-bottom: 1.5rem;
}

.continue-btn {
  background: #2563eb;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
}

.continue-btn:hover {
  background: #1d4ed8;
}
</style> 