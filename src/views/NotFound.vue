<template>
  <div class="not-found">
    <div class="content">
      <div class="error-code">404</div>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      
      <div class="actions">
        <router-link to="/" class="primary-btn">
          Return Home
        </router-link>
        <button @click="goBack" class="secondary-btn">
          Go Back
        </button>
      </div>
    </div>

    <!-- Background Elements -->
    <div class="bg-elements">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useToast } from '@/composables/useToast'

const router = useRouter()
const toast = useToast()

function goBack() {
  router.back()
}

function goToDashboard() {
  // Update to use the new dashboard path
  router.push('/dashboard')
}

function contactSupport() {
  toast.info('Support system coming soon!')
}
</script>

<style scoped>
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
  color: white;
  position: relative;
  overflow: hidden;
}

.content {
  text-align: center;
  z-index: 10;
  padding: 2rem;
  animation: fadeIn 0.5s ease-out;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  line-height: 1;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 1rem;
  animation: pulse 2s infinite;
}

h1 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

p {
  color: #9ca3af;
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.primary-btn, .secondary-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.primary-btn {
  background: #2563eb;
  color: white;
  text-decoration: none;
}

.primary-btn:hover {
  background: #1d4ed8;
  transform: translateY(-1px);
}

.secondary-btn {
  background: transparent;
  color: white;
  border: 2px solid #4b5563;
}

.secondary-btn:hover {
  border-color: #6b7280;
  transform: translateY(-1px);
}

/* Background Elements */
.bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
}

.circle {
  position: absolute;
  border-radius: 50%;
  opacity: 0.1;
}

.circle-1 {
  width: 300px;
  height: 300px;
  background: #3b82f6;
  top: -100px;
  right: -100px;
  animation: float 6s infinite;
}

.circle-2 {
  width: 200px;
  height: 200px;
  background: #2563eb;
  bottom: -50px;
  left: -50px;
  animation: float 8s infinite;
}

.circle-3 {
  width: 150px;
  height: 150px;
  background: #1d4ed8;
  top: 50%;
  right: 15%;
  animation: float 7s infinite;
}

/* Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
  100% {
    transform: scale(1);
  }
}

@keyframes float {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 640px) {
  .error-code {
    font-size: 6rem;
  }

  h1 {
    font-size: 2rem;
  }

  p {
    font-size: 1rem;
  }

  .actions {
    flex-direction: column;
  }

  .primary-btn, .secondary-btn {
    width: 100%;
  }
}
</style> 