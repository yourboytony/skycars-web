<template>
  <div class="interactive-background">
    <canvas ref="noiseCanvas" class="noise-canvas"></canvas>
    <div class="grid-overlay"></div>
    <div class="glow-effects">
      <div v-for="n in 5" :key="n" class="glow-orb"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const noiseCanvas = ref(null)
let animationFrame

onMounted(() => {
  const canvas = noiseCanvas.value
  const ctx = canvas.getContext('2d')
  
  function resize() {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }
  
  function createNoise() {
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = Math.random() * 255
      
      data[i] = noise
      data[i + 1] = noise
      data[i + 2] = noise
      data[i + 3] = 15
    }
    
    ctx.putImageData(imageData, 0, 0)
  }
  
  function animate() {
    createNoise()
    animationFrame = requestAnimationFrame(animate)
  }
  
  window.addEventListener('resize', resize)
  resize()
  animate()
  
  onUnmounted(() => {
    window.removeEventListener('resize', resize)
    cancelAnimationFrame(animationFrame)
  })
})
</script>

<style scoped>
.interactive-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.noise-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.05;
  filter: contrast(400%);
}

.grid-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, rgba(0, 255, 157, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 255, 157, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 70%);
}

.glow-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.glow-orb {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: radial-gradient(circle at center, 
    rgba(0, 255, 157, 0.15) 0%,
    transparent 70%);
  animation: floatOrb 20s infinite;
  filter: blur(40px);
}

@keyframes floatOrb {
  0%, 100% { transform: translate(0, 0); }
  25% { transform: translate(100px, 100px); }
  50% { transform: translate(-100px, 200px); }
  75% { transform: translate(-200px, -100px); }
}
</style> 