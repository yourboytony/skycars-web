<template>
  <div class="loading-screen" :class="{ 'fade-out': !isLoading }">
    <div class="loading-content">
      <div class="plane-container">
        <svg class="plane" viewBox="0 0 24 24">
          <path d="M22,16.5L12,23L2,16.5V7.5L12,1L22,7.5V16.5Z" />
        </svg>
      </div>
      <div class="loading-text">SKYCARS</div>
      <div class="loading-progress">
        <div class="progress-bar" :style="{ width: progress + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const isLoading = ref(true)
const progress = ref(0)

onMounted(() => {
  // Simulate loading progress
  const interval = setInterval(() => {
    progress.value += 2
    if (progress.value >= 100) {
      clearInterval(interval)
      setTimeout(() => {
        isLoading.value = false
      }, 500)
    }
  }, 20)
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  transition: opacity 0.5s ease-out;
}

.loading-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}

.loading-content {
  text-align: center;
}

.plane-container {
  margin-bottom: 2rem;
}

.plane {
  width: 80px;
  height: 80px;
  fill: white;
  animation: float 3s ease-in-out infinite;
}

.loading-text {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 0.5em;
  margin-right: -0.5em;
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
  animation: pulse 2s ease-in-out infinite;
}

.loading-progress {
  width: 200px;
  height: 4px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 2px;
  margin: 2rem auto 0;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  background: white;
  transition: width 0.2s ease-out;
  box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style> 