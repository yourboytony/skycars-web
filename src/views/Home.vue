<template>
  <div class="home">
    <!-- Subtle Gradient Background -->
    <div class="background-gradient"></div>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="main-title">
          SkyCars Collective
          <span class="title-accent"></span>
        </h1>
        <p class="hero-subtitle">Experience Next-Generation Flight Simulation</p>
        <div class="hero-stats">
          <div class="stat-item" v-for="(stat, index) in stats" :key="index">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
        <div class="hero-cta">
          <button class="primary-button">
            Explore Aircraft
            <span class="button-glow"></span>
          </button>
          <button class="secondary-button">
            View Marketplace
          </button>
        </div>
      </div>
      <div class="hero-visual" ref="modelContainer">
        <!-- 3D Model Container -->
      </div>
    </section>

    <!-- Featured Aircraft -->
    <section class="featured-section">
      <h2 class="section-title">Featured Aircraft</h2>
      <div class="aircraft-grid">
        <div v-for="aircraft in featuredAircraft" 
             :key="aircraft.id" 
             class="aircraft-card">
          <div class="card-image">
            <img :src="aircraft.image" :alt="aircraft.name">
            <div class="card-overlay">
              <span class="card-price">{{ aircraft.price }} Credits</span>
            </div>
          </div>
          <div class="card-content">
            <h3 class="card-title">{{ aircraft.name }}</h3>
            <p class="card-description">{{ aircraft.description }}</p>
            <div class="card-footer">
              <span class="simulator-tag">{{ aircraft.simulator }}</span>
              <button class="details-button">View Details</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Updates -->
    <section class="updates-section">
      <div class="updates-content">
        <h2 class="section-title">Latest Updates</h2>
        <div class="updates-grid">
          <div v-for="update in latestUpdates" 
               :key="update.id" 
               class="update-card">
            <div class="update-header">
              <span class="update-date">{{ update.date }}</span>
              <div class="update-tags">
                <span v-for="tag in update.tags" 
                      :key="tag" 
                      class="tag">{{ tag }}</span>
              </div>
            </div>
            <h3 class="update-title">{{ update.title }}</h3>
            <p class="update-description">{{ update.description }}</p>
          </div>
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
/* Modern, Clean Design System */
:root {
  --primary: #2D7FFA;
  --primary-dark: #1E63D4;
  --secondary: #34D399;
  --background: #0F172A;
  --surface: #1E293B;
  --text: #F8FAFC;
  --text-secondary: #94A3B8;
  --accent: #7C3AED;
}

/* Base Styles */
.home {
  min-height: 100vh;
  background-color: var(--background);
  color: var(--text);
  overflow-x: hidden;
}

.background-gradient {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(
    circle at top right,
    rgba(124, 58, 237, 0.1),
    rgba(45, 127, 250, 0.1),
    transparent 60%
  );
  z-index: 0;
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 4rem;
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
}

.main-title {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 1.5rem;
  position: relative;
  background: linear-gradient(to right, var(--text), var(--text-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
}

/* Modern Button Styles */
.primary-button {
  background: linear-gradient(135deg, var(--primary), var(--accent));
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  position: relative;
  overflow: hidden;
}

.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(45, 127, 250, 0.3);
}

.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transform: translateX(-100%);
}

.primary-button:hover .button-glow {
  animation: button-shine 1.5s infinite;
}

/* Aircraft Cards */
.aircraft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.aircraft-card {
  background: var(--surface);
  border-radius: 16px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.aircraft-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.card-image {
  position: relative;
  height: 240px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.aircraft-card:hover .card-image img {
  transform: scale(1.1);
}

.card-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
}

.card-content {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* Update Cards */
.updates-section {
  padding: 4rem 2rem;
  background: linear-gradient(to bottom, transparent, var(--surface));
}

.update-card {
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: transform 0.3s ease;
}

.update-card:hover {
  transform: translateY(-4px);
}

/* Tags */
.tag {
  background: rgba(124, 58, 237, 0.2);
  color: var(--accent);
  padding: 0.25rem 0.75rem;
  border-radius: 100px;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Animations */
@keyframes button-shine {
  100% {
    transform: translateX(100%);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    padding: 2rem;
  }

  .main-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .aircraft-grid {
    grid-template-columns: 1fr;
  }

  .hero-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
