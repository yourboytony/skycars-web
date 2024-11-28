<template>
  <div class="home">
    <InteractiveBackground />
    
    <!-- Particle Background -->
    <div id="particles-js" class="particle-container"></div>

    <!-- Hero Section with 3D Effect -->
    <section class="hero">
      <div class="hero-content" v-motion>
        <div class="hero-grid">
          <div class="hero-text" 
            v-motion
            :initial="{ opacity: 0, y: 100 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 200, duration: 800 } }">
            <h1 class="glitch" data-text="SkyCars Collective">SkyCars Collective</h1>
            <p class="cyber-text">Next Generation Flight Simulation Marketplace</p>
            <div class="hero-stats">
              <div class="stat-item" v-for="(stat, index) in heroStats" :key="index"
                v-motion
                :initial="{ opacity: 0, x: -50 }"
                :enter="{ opacity: 1, x: 0, transition: { delay: 300 + (index * 100) } }">
                <span class="stat-value">{{ stat.value }}</span>
                <span class="stat-label">{{ stat.label }}</span>
              </div>
            </div>
          </div>
          <div class="hero-model">
            <canvas id="aircraft-model"></canvas>
          </div>
        </div>
        
        <div class="hero-cta">
          <button class="cyber-button" @click="scrollToExplore">
            <span class="cyber-button__glitch"></span>
            <span class="cyber-button__tag">v2.4</span>
            Explore Aircraft
          </button>
          <button class="cyber-button secondary">
            <span class="cyber-button__glitch"></span>
            <span class="cyber-button__tag">New</span>
            Join Community
          </button>
        </div>
      </div>
      
      <div class="hero-scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <div class="scroll-arrows">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>

    <!-- Featured Aircraft Slider -->
    <section class="featured-section glass-morphism">
      <h2 class="section-title cyber-glitch" data-text="Featured Aircraft">
        Featured Aircraft
      </h2>
      
      <swiper-container class="featured-slider"
        :slides-per-view="'auto'"
        :space-between="30"
        :centered-slides="true"
        :pagination="true"
        :autoplay="{ delay: 3000 }">
        <swiper-slide v-for="aircraft in featuredAircraft" :key="aircraft.id">
          <div class="aircraft-card" 
            @mouseenter="playHoverAnimation"
            @mouseleave="resetHoverAnimation">
            <div class="card-image">
              <img :src="aircraft.image" :alt="aircraft.name">
              <div class="card-overlay"></div>
              <div class="card-specs">
                <span class="spec-item">
                  <i class="fas fa-tachometer-alt"></i>
                  {{ aircraft.speed }} KTAS
                </span>
                <span class="spec-item">
                  <i class="fas fa-arrows-alt-v"></i>
                  {{ aircraft.ceiling }} ft
                </span>
                <span class="spec-item">
                  <i class="fas fa-gas-pump"></i>
                  {{ aircraft.range }} nm
                </span>
              </div>
            </div>
            <div class="card-content">
              <h3>{{ aircraft.name }}</h3>
              <p>{{ aircraft.description }}</p>
              <div class="card-footer">
                <span class="price">{{ aircraft.price }} Credits</span>
                <button class="cyber-button small">
                  View Details
                </button>
              </div>
            </div>
          </div>
        </swiper-slide>
      </swiper-container>
    </section>

    <!-- Weather Integration -->
    <section class="weather-section glass-morphism">
      <div class="weather-grid">
        <div class="weather-title">
          <h2 class="cyber-glitch" data-text="Live Weather">Live Weather</h2>
          <p class="cyber-text">Real-time METAR data for your virtual flights</p>
        </div>
        
        <div class="weather-content">
          <Weather class="weather-widget" />
          
          <div class="weather-map">
            <div class="map-container glass-morphism">
              <!-- Weather radar animation here -->
              <div class="radar-sweep"></div>
              <div class="map-markers">
                <!-- Dynamic weather markers -->
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Statistics with 3D Parallax -->
    <section class="stats-section">
      <div class="stats-parallax" ref="statsParallax">
        <div class="stats-grid">
          <div v-for="(stat, index) in statistics" 
               :key="index" 
               class="stat-card glass-morphism"
               v-motion
               :initial="{ opacity: 0, scale: 0.8 }"
               :enter="{ opacity: 1, scale: 1, transition: { delay: index * 100 } }">
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-info">
              <h3 class="cyber-text">{{ stat.value }}</h3>
              <p>{{ stat.label }}</p>
            </div>
            <div class="stat-graph">
              <!-- Dynamic graph animation -->
              <canvas :ref="`graph${index}`"></canvas>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Releases -->
    <section class="releases-section glass-morphism">
      <h2 class="section-title cyber-glitch" data-text="Latest Releases">
        Latest Releases
      </h2>
      
      <div class="releases-grid">
        <div v-for="release in latestReleases" 
             :key="release.id" 
             class="release-card"
             @mouseenter="playCardAnimation">
          <div class="release-image">
            <img :src="release.image" :alt="release.title">
            <div class="release-overlay"></div>
            <div class="release-date cyber-text">{{ release.date }}</div>
          </div>
          <div class="release-content">
            <h3>{{ release.title }}</h3>
            <p>{{ release.description }}</p>
            <div class="release-meta">
              <span class="release-simulator">{{ release.simulator }}</span>
              <span class="release-rating">
                <i class="fas fa-star"></i>
                {{ release.rating }}
              </span>
            </div>
            <button class="cyber-button small">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Community Hub -->
    <section class="community-section">
      <div class="community-grid glass-morphism">
        <div class="community-content">
          <h2 class="cyber-glitch" data-text="Join The Squadron">
            Join The Squadron
          </h2>
          <p class="cyber-text">Connect with pilots worldwide</p>
          
          <div class="community-stats">
            <div class="community-stat">
              <span class="stat-number">15K+</span>
              <span class="stat-label">Active Pilots</span>
            </div>
            <div class="community-stat">
              <span class="stat-number">500+</span>
              <span class="stat-label">Daily Events</span>
            </div>
          </div>

          <div class="community-cta">
            <button class="cyber-button discord">
              <i class="fab fa-discord"></i>
              Join Discord
            </button>
            <button class="cyber-button forum">
              <i class="fas fa-comments"></i>
              Community Forum
            </button>
          </div>
        </div>

        <div class="community-feed">
          <div class="feed-header">
            <h3>Live Activity</h3>
          </div>
          <div class="feed-content">
            <div v-for="activity in communityFeed" 
                 :key="activity.id" 
                 class="feed-item glass-morphism">
              <div class="feed-avatar">
                <img :src="activity.avatar" :alt="activity.user">
              </div>
              <div class="feed-details">
                <span class="feed-user">{{ activity.user }}</span>
                <span class="feed-action">{{ activity.action }}</span>
                <span class="feed-time">{{ activity.time }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Enhanced 3D Model Interaction -->
    <div class="model-controls" v-if="modelLoaded">
      <button @click="rotateModel('left')" class="control-btn">
        <i class="fas fa-arrow-left"></i>
      </button>
      <button @click="rotateModel('right')" class="control-btn">
        <i class="fas fa-arrow-right"></i>
      </button>
      <button @click="zoomModel('in')" class="control-btn">
        <i class="fas fa-plus"></i>
      </button>
      <button @click="zoomModel('out')" class="control-btn">
        <i class="fas fa-minus"></i>
      </button>
    </div>

    <!-- Interactive Features Section -->
    <section class="features-section glass-morphism">
      <div class="features-grid">
        <div v-for="feature in features" 
             :key="feature.id" 
             class="feature-card"
             @mouseenter="activateFeature(feature.id)"
             @mouseleave="deactivateFeature(feature.id)">
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <div class="feature-details" v-show="feature.active">
            <!-- Additional feature content -->
          </div>
        </div>
      </div>
    </section>

    <!-- To be continued in next part... -->
  </div>
</template>

<script setup>
// Remove or comment out problematic imports temporarily
// import { gsap } from 'gsap'
import { ref, onMounted } from 'vue'
import InteractiveBackground from '../components/InteractiveBackground.vue'
import Weather from '../components/Weather.vue'

// Use basic animations first
const modelLoaded = ref(false)
const modelRotation = ref({ x: 0, y: 0 })
const modelZoom = ref(5)

// Simplified features data
const features = ref([
  {
    id: 1,
    title: 'Real-time Weather',
    icon: 'fas fa-cloud-sun',
    description: 'Live METAR data integration',
    active: false
  }
  // Add more features...
])

// Simplified rotation function without GSAP
function rotateModel(direction) {
  const rotation = direction === 'left' ? -0.1 : 0.1
  if (modelRotation.value) {
    modelRotation.value.y += rotation
  }
}

// Simplified zoom function without GSAP
function zoomModel(direction) {
  const newZoom = direction === 'in' ? 
    Math.max(2, modelZoom.value - 1) : 
    Math.min(8, modelZoom.value + 1)
  modelZoom.value = newZoom
}

// Simplified feature interaction
function activateFeature(id) {
  const feature = features.value.find(f => f.id === id)
  if (feature) {
    feature.active = true
  }
}

function deactivateFeature(id) {
  const feature = features.value.find(f => f.id === id)
  if (feature) {
    feature.active = false
  }
}

onMounted(() => {
  // Basic initialization
  console.log('Component mounted')
})
</script>

<style scoped>
/* Base Styles */
:root {
  --primary: #00ff9d;
  --secondary: #0066ff;
  --accent: #ff00ff;
  --background: #0a0a0a;
  --text: #ffffff;
  --glass: rgba(255, 255, 255, 0.1);
  --glass-border: rgba(255, 255, 255, 0.2);
}

.home {
  background: var(--background);
  min-height: 100vh;
  overflow-x: hidden;
}

/* Glassmorphism */
.glass-morphism {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid var(--glass-border);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}

/* Cyber Button */
.cyber-button {
  --cb-color: var(--primary);
  --cb-hover-color: var(--accent);
  position: relative;
  padding: 20px 40px;
  color: var(--cb-color);
  background: transparent;
  border: 2px solid var(--cb-color);
  border-radius: 8px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 2px;
  overflow: hidden;
  transition: 0.3s;
  cursor: pointer;
}

.cyber-button:hover {
  color: var(--background);
  background: var(--cb-hover-color);
  border-color: var(--cb-hover-color);
  box-shadow: 0 0 20px var(--cb-hover-color);
}

.cyber-button__glitch {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--cb-color);
  transform: translateX(-100%);
  transition: 0.3s;
}

.cyber-button:hover .cyber-button__glitch {
  transform: translateX(100%);
}

/* Glitch Text Effect */
.cyber-glitch {
  position: relative;
  color: var(--text);
  font-size: 4rem;
  font-weight: bold;
  text-transform: uppercase;
  text-shadow: 0.05em 0 0 var(--accent),
              -0.025em -0.05em 0 var(--primary),
              0.025em 0.05em 0 var(--secondary);
  animation: glitch 1s infinite;
}

@keyframes glitch {
  0% {
    text-shadow: 0.05em 0 0 var(--accent),
                -0.025em -0.05em 0 var(--primary),
                0.025em 0.05em 0 var(--secondary);
  }
  14% {
    text-shadow: 0.05em 0 0 var(--accent),
                -0.025em -0.05em 0 var(--primary),
                0.025em 0.05em 0 var(--secondary);
  }
  15% {
    text-shadow: -0.05em -0.025em 0 var(--accent),
                0.025em 0.025em 0 var(--primary),
                -0.05em -0.05em 0 var(--secondary);
  }
  49% {
    text-shadow: -0.05em -0.025em 0 var(--accent),
                0.025em 0.025em 0 var(--primary),
                -0.05em -0.05em 0 var(--secondary);
  }
  50% {
    text-shadow: 0.025em 0.05em 0 var(--accent),
                0.05em 0 0 var(--primary),
                0 -0.05em 0 var(--secondary);
  }
  99% {
    text-shadow: 0.025em 0.05em 0 var(--accent),
                0.05em 0 0 var(--primary),
                0 -0.05em 0 var(--secondary);
  }
  100% {
    text-shadow: -0.025em 0 0 var(--accent),
                -0.025em -0.025em 0 var(--primary),
                -0.025em -0.05em 0 var(--secondary);
  }
}

/* Particle Background */
.particle-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  padding: 2rem;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, 
    rgba(0, 255, 157, 0.1),
    rgba(0, 102, 255, 0.1));
  animation: gradientShift 10s ease infinite;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  max-width: 1400px;
  margin: 0 auto;
}

.hero-text {
  z-index: 1;
}

.hero-model {
  position: relative;
  height: 600px;
}

/* Aircraft Cards */
.aircraft-card {
  position: relative;
  width: 400px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.aircraft-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 20px 40px rgba(0, 255, 157, 0.2);
}

.card-image {
  position: relative;
  height: 250px;
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(10, 10, 10, 0.8)
  );
}

.card-specs {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  color: var(--text);
  z-index: 1;
}

/* Weather Section */
.weather-section {
  padding: 4rem 2rem;
  margin: 2rem;
}

.weather-grid {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
}

.radar-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 50%,
    rgba(0, 255, 157, 0.2) 100%
  );
  animation: radarSweep 4s linear infinite;
}

@keyframes radarSweep {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Stats Section */
.stats-section {
  position: relative;
  padding: 6rem 2rem;
  perspective: 1000px;
}

.stats-parallax {
  transform-style: preserve-3d;
}

.stat-card {
  position: relative;
  padding: 2rem;
  transition: transform 0.3s ease;
}

.stat-card:hover {
  transform: translateZ(20px);
}

/* Community Section */
.community-section {
  position: relative;
  padding: 4rem 2rem;
  background: linear-gradient(
    45deg,
    rgba(0, 255, 157, 0.1),
    rgba(0, 102, 255, 0.1)
  );
}

.feed-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.feed-item:hover {
  transform: scale(1.02);
}

/* Animations */
@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .hero-model {
    height: 400px;
  }
}

@media (max-width: 768px) {
  .cyber-glitch {
    font-size: 2.5rem;
  }

  .weather-grid,
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .aircraft-card {
    width: 100%;
  }
}
</style>
