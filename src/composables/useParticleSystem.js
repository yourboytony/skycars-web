import { onMounted, onUnmounted } from 'vue'

export function useParticleSystem() {
  let canvas, ctx, particles = []

  const init = (canvasEl) => {
    canvas = canvasEl
    ctx = canvas.getContext('2d')
    // Initialize particles...
  }

  const animate = () => {
    // Animation logic...
  }

  onMounted(() => {
    // Start animation
  })

  onUnmounted(() => {
    // Cleanup
  })

  return { init }
} 