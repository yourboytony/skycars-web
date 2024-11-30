<template>
  <div class="home">
    <!-- Background Effect -->
    <div ref="bgContainer" class="background-effect"></div>

    <!-- Main Content -->
    <section class="hero">
      <h1 class="hero-title">
        NEXT
        <span class="accent">LEVEL</span>
        FLIGHT
      </h1>
      <p class="hero-subtitle">Experience the future of aviation</p>
      <button class="hero-cta">Explore Fleet</button>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useBackgroundEffect } from '../composables/useBackgroundEffect'

const bgContainer = ref(null)
const { init, cleanup } = useBackgroundEffect()

onMounted(() => {
  if (bgContainer.value) {
    init(bgContainer.value)
  }
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.home {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.background-effect {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.hero {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 2rem;
}

.hero-title {
  font-size: clamp(3rem, 8vw, 5rem);
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
  letter-spacing: -1px;
}

.accent {
  color: var(--accent);
}

.hero-subtitle {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.hero-cta {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 1rem 3rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.hero-cta:hover {
  background: var(--accent);
  color: var(--black);
}
</style> 