<template>
  <div class="home">
    <!-- Animated Background -->
    <div class="animated-bg">
      <div class="grid-overlay"></div>
      <div class="particles" ref="particlesContainer"></div>
    </div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="glitch-title" data-text="SkyCars Collective">
          SkyCars Collective
        </h1>
        <p class="cyber-subtitle">
          Next Generation Flight Simulation Marketplace
        </p>
        <div class="hero-stats">
          <div class="stat" v-for="(stat, index) in stats" :key="index">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
        <div class="hero-cta">
          <button class="cyber-button primary">
            <span class="cyber-button__glitch"></span>
            <span class="cyber-button__label">Explore Aircraft</span>
          </button>
          <button class="cyber-button secondary">
            <span class="cyber-button__glitch"></span>
            <span class="cyber-button__label">Join Community</span>
          </button>
        </div>
      </div>
      <div class="hero-visual" ref="modelContainer"></div>
    </section>

    <!-- Featured Aircraft -->
    <section class="featured-section glass-panel">
      <h2 class="section-title">Featured Aircraft</h2>
      <div class="aircraft-grid">
        <div v-for="aircraft in featuredAircraft" 
             :key="aircraft.id" 
             class="aircraft-card"
             @mouseenter="onCardHover"
             @mouseleave="onCardLeave">
          <div class="card-image">
            <img :src="aircraft.image" :alt="aircraft.name">
            <div class="card-overlay"></div>
          </div>
          <div class="card-content">
            <h3>{{ aircraft.name }}</h3>
            <div class="card-specs">
              <span>{{ aircraft.simulator }}</span>
              <span>{{ aircraft.price }} Credits</span>
            </div>
            <p>{{ aircraft.description }}</p>
            <button class="neo-button">View Details</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Updates -->
    <section class="updates-section">
      <div class="updates-content glass-panel">
        <h2 class="section-title">Latest Updates</h2>
        <div class="updates-grid">
          <div v-for="update in latestUpdates" 
               :key="update.id" 
               class="update-card">
            <div class="update-date">{{ update.date }}</div>
            <h3>{{ update.title }}</h3>
            <p>{{ update.description }}</p>
            <div class="update-tags">
              <span v-for="tag in update.tags" 
                    :key="tag" 
                    class="tag">{{ tag }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Section -->
    <section class="community-section glass-panel">
      <h2 class="section-title">Join Our Community</h2>
      <div class="community-grid">
        <div class="community-stats">
          <div class="community-stat">
            <span class="stat-value">15K+</span>
            <span class="stat-label">Active Pilots</span>
          </div>
          <div class="community-stat">
            <span class="stat-value">500+</span>
            <span class="stat-label">Daily Events</span>
          </div>
        </div>
        <div class="community-cta">
          <button class="neo-button discord">
            Join Discord
          </button>
          <button class="neo-button forum">
            Visit Forum
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import * as THREE from 'three'

// State
const stats = ref([
  { value: '250+', label: 'Aircraft' },
  { value: '10K+', label: 'Users' },
  { value: '99.9%', label: 'Uptime' },
  { value: '24/7', label: 'Support' }
])

const featuredAircraft = ref([
  {
    id: 1,
    name: 'F-35 Lightning II',
    simulator: 'DCS World',
    price: '5000',
    image: 'https://images.unsplash.com/photo-1580824456266-c578f254e8af?w=800',
    description: 'Ultra-realistic 5th generation fighter with advanced systems.'
  },
  {
    id: 2,
    name: 'Boeing 737 MAX',
    simulator: 'MSFS 2020',
    price: '4500',
    image: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=800',
    description: 'Next-generation commercial airliner with custom systems.'
  },
  {
    id: 3,
    name: 'Cessna 172',
    simulator: 'X-Plane 12',
    price: '2500',
    image: 'https://images.unsplash.com/photo-1583362604313-a50a20d01d0c?w=800',
    description: 'Classic training aircraft with realistic flight dynamics.'
  }
])

const latestUpdates = ref([
  {
    id: 1,
    date: '2024-03-01',
    title: 'New F-16 Update',
    description: 'Major avionics update with enhanced radar simulation.',
    tags: ['Update', 'Military']
  },
  {
    id: 2,
    date: '2024-02-28',
    title: 'Weather System 2.0',
    description: 'Improved weather effects and turbulence simulation.',
    tags: ['Feature', 'Weather']
  }
])

// Three.js setup
const modelContainer = ref(null)
let scene, camera, renderer, model

const initThree = () => {
  scene = new THREE.Scene()
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / 2 / window.innerHeight, 0.1, 1000)
  
  renderer = new THREE.WebGLRenderer({ 
    antialias: true,
    alpha: true 
  })
  
  renderer.setSize(window.innerWidth / 2, window.innerHeight)
  modelContainer.value.appendChild(renderer.domElement)
  
  // Add lights
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
  scene.add(ambientLight)
  
  const directionalLight = new THREE.DirectionalLight(0x00ff9d, 1)
  directionalLight.position.set(5, 5, 5)
  scene.add(directionalLight)
  
  camera.position.z = 5
  
  animate()
}

const animate = () => {
  requestAnimationFrame(animate)
  if (model) {
    model.rotation.y += 0.005
  }
  renderer.render(scene, camera)
}

// Event handlers
const onCardHover = (event) => {
  event.currentTarget.style.transform = 'translateY(-10px)'
}

const onCardLeave = (event) => {
  event.currentTarget.style.transform = 'translateY(0)'
}

// Lifecycle hooks
onMounted(() => {
  initThree()
})

onUnmounted(() => {
  scene?.dispose()
  renderer?.dispose()
})
</script>

<style scoped>
/* Base Styles */
.home {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
  color: #ffffff;
  overflow-x: hidden;
}

/* Animated Background */
.animated-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.grid-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background-image: 
    linear-gradient(to right, rgba(0, 255, 157, 0.1) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0, 255, 157, 0.1) 1px, transparent 1px);
  background-size: 50px 50px;
  mask-image: radial-gradient(circle at 50% 50%, black 0%, transparent 70%);
}

/* Glass Panel Effect */
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  margin: 2rem;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 2rem;
  position: relative;
}

.glitch-title {
  font-size: 4rem;
  font-weight: bold;
  text-transform: uppercase;
  position: relative;
  text-shadow: 
    0.05em 0 0 rgba(255, 0, 0, 0.75),
    -0.025em -0.05em 0 rgba(0, 255, 0, 0.75),
    0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  animation: glitch 1s infinite;
}

/* Cyber Button */
.cyber-button {
  --primary: #00ff9d;
  --shadow-primary: #00cc7d;
  
  padding: 1rem 3rem;
  color: var(--primary);
  background: transparent;
  border: 2px solid var(--primary);
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: 0.3s;
  cursor: pointer;
}

.cyber-button:hover {
  background: var(--primary);
  color: #000;
  box-shadow: 0 0 30px var(--shadow-primary);
}

/* Aircraft Cards */
.aircraft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}

.aircraft-card {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.card-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.aircraft-card:hover .card-image img {
  transform: scale(1.1);
}

/* Neo Button */
.neo-button {
  padding: 0.8rem 1.5rem;
  background: linear-gradient(145deg, #1e1e1e, #0a0a0a);
  border: none;
  border-radius: 10px;
  color: #00ff9d;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
}

.neo-button:hover {
  background: linear-gradient(145deg, #0a0a0a, #1e1e1e);
  box-shadow: 0 0 15px rgba(0, 255, 157, 0.3);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
  }

  .glitch-title {
    font-size: 2.5rem;
  }

  .aircraft-grid {
    grid-template-columns: 1fr;
  }
}

/* Animations */
@keyframes glitch {
  0% {
    text-shadow: 
      0.05em 0 0 rgba(255, 0, 0, 0.75),
      -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
      -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  14% {
    text-shadow: 
      0.05em 0 0 rgba(255, 0, 0, 0.75),
      -0.05em -0.025em 0 rgba(0, 255, 0, 0.75),
      -0.025em 0.05em 0 rgba(0, 0, 255, 0.75);
  }
  15% {
    text-shadow: 
      -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  49% {
    text-shadow: 
      -0.05em -0.025em 0 rgba(255, 0, 0, 0.75),
      0.025em 0.025em 0 rgba(0, 255, 0, 0.75),
      -0.05em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  50% {
    text-shadow: 
      0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  99% {
    text-shadow: 
      0.025em 0.05em 0 rgba(255, 0, 0, 0.75),
      0.05em 0 0 rgba(0, 255, 0, 0.75),
      0 -0.05em 0 rgba(0, 0, 255, 0.75);
  }
  100% {
    text-shadow: 
      -0.025em 0 0 rgba(255, 0, 0, 0.75),
      -0.025em -0.025em 0 rgba(0, 255, 0, 0.75),
      -0.025em -0.05em 0 rgba(0, 0, 255, 0.75);
  }
}
</style>
