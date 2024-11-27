<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="stars-container">
        <div class="stars"></div>
        <div class="stars2"></div>
        <div class="stars3"></div>
      </div>
      
      <div class="hero-content glass">
        <h1 class="animated-title">
          <span class="gradient-text">Next Generation</span>
          <span>Aviation Platform</span>
        </h1>
        <p class="hero-subtitle">
          Plan flights, track weather, and connect with pilots worldwide
        </p>
        <div class="hero-cta">
          <button @click="$emit('showRegister')" class="cta-primary">
            <span>Get Started</span>
            <i class="fas fa-arrow-right"></i>
          </button>
          <button class="cta-secondary" @click="scrollToFeatures">
            <span>Learn More</span>
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>
        
        <div class="hero-stats">
          <div class="stat-item" v-for="stat in stats" :key="stat.label">
            <div class="stat-value">
              <span class="counter">{{ stat.value }}</span>{{ stat.suffix }}
            </div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>

      <div class="hero-plane">
        <model-viewer
          src="/models/airplane.glb"
          camera-controls
          auto-rotate
          rotation-per-second="30deg"
          interaction-prompt="none"
          shadow-intensity="1"
        ></model-viewer>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features" ref="featuresSection">
      <h2 class="section-title">Why Choose Skycars?</h2>
      
      <div class="features-grid">
        <div 
          v-for="feature in features" 
          :key="feature.title"
          class="feature-card glass"
          :class="{ 'active': feature.active }"
          @mouseenter="feature.active = true"
          @mouseleave="feature.active = false"
        >
          <div class="feature-icon">
            <i :class="feature.icon"></i>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
          <router-link :to="feature.link" class="feature-link">
            Learn More
            <i class="fas fa-arrow-right"></i>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Live Data Section -->
    <section class="live-data glass">
      <div class="data-content">
        <h2>Live Aviation Data</h2>
        <div class="data-grid">
          <div class="data-card" v-for="data in liveData" :key="data.label">
            <div class="data-icon">
              <i :class="data.icon"></i>
            </div>
            <div class="data-info">
              <div class="data-value">{{ data.value }}</div>
              <div class="data-label">{{ data.label }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="live-map">
        <!-- Placeholder for map component -->
        <div class="map-container glass">
          <div class="map-overlay">
            <span>Live Flight Data</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="cta-section glass">
      <div class="cta-content">
        <h2>Ready to Take Flight?</h2>
        <p>Join thousands of pilots using Skycars for their aviation needs</p>
        <button @click="$emit('showRegister')" class="cta-button">
          Start Your Journey
          <i class="fas fa-plane-departure"></i>
        </button>
      </div>
      
      <div class="cta-background">
        <div class="gradient-sphere"></div>
        <div class="gradient-sphere"></div>
        <div class="gradient-sphere"></div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section brand">
          <h3>Skycars</h3>
          <p>Your Ultimate Aviation Platform</p>
          <div class="social-links">
            <a href="#" class="social-link">
              <i class="fab fa-twitter"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-linkedin"></i>
            </a>
            <a href="#" class="social-link">
              <i class="fab fa-github"></i>
            </a>
          </div>
        </div>

        <div class="footer-section links">
          <h4>Quick Links</h4>
          <ul>
            <li><router-link to="/about">About</router-link></li>
            <li><router-link to="/features">Features</router-link></li>
            <li><router-link to="/pricing">Pricing</router-link></li>
            <li><router-link to="/contact">Contact</router-link></li>
          </ul>
        </div>

        <div class="footer-section contact">
          <h4>Contact Us</h4>
          <p>
            <i class="fas fa-envelope"></i>
            info@skycars.com
          </p>
          <p>
            <i class="fas fa-phone"></i>
            +1 (555) 123-4567
          </p>
        </div>

        <div class="footer-section newsletter">
          <h4>Stay Updated</h4>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email">
            <button>
              <i class="fas fa-paper-plane"></i>
            </button>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2024 Skycars. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

// Stats data
const stats = ref([
  { value: '50K+', suffix: '', label: 'Active Users' },
  { value: '120+', suffix: '', label: 'Countries' },
  { value: '1M+', suffix: '', label: 'Flights Tracked' },
  { value: '24/7', suffix: '', label: 'Support' }
])

// Features data
const features = ref([
  {
    title: 'Flight Planning',
    description: 'Advanced tools for route optimization and flight planning',
    icon: 'fas fa-route',
    link: '/features/planning',
    active: false
  },
  {
    title: 'Weather Radar',
    description: 'Real-time weather updates and forecasting',
    icon: 'fas fa-cloud-sun',
    link: '/features/weather',
    active: false
  },
  {
    title: 'Live Tracking',
    description: 'Track flights in real-time with precision',
    icon: 'fas fa-location-dot',
    link: '/features/tracking',
    active: false
  },
  {
    title: 'Community',
    description: 'Connect with pilots and aviation enthusiasts',
    icon: 'fas fa-users',
    link: '/features/community',
    active: false
  }
])

// Live data
const liveData = ref([
  { label: 'Active Flights', value: '1,234', icon: 'fas fa-plane' },
  { label: 'Weather Stations', value: '567', icon: 'fas fa-tower-broadcast' },
  { label: 'Online Users', value: '890', icon: 'fas fa-users' }
])

const featuresSection = ref(null)

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}

// Simplified intersection observer
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate')
      }
    })
  }, {
    threshold: 0.1
  })

  document.querySelectorAll('.feature-card, .stat-item, .data-card').forEach(el => {
    observer.observe(el)
  })
})
</script>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  min-height: calc(100vh - 70px);
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  margin-top: 70px;
}

.stars-container {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.stars, .stars2, .stars3 {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: transparent url(/images/stars.png) repeat;
  z-index: 0;
}

.stars { animation: move-stars 200s linear infinite; }
.stars2 { animation: move-stars 150s linear infinite; opacity: 0.5; }
.stars3 { animation: move-stars 100s linear infinite; opacity: 0.3; }

.hero-content {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  padding: 3rem;
  border-radius: 1rem;
}

.animated-title {
  font-size: 4rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-light);
  margin-bottom: 2rem;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.cta-primary, .cta-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.cta-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.cta-secondary {
  background: transparent;
  border: 2px solid var(--primary-color);
  color: var(--primary-color);
}

.cta-primary:hover, .cta-secondary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.2);
}

/* Features Section */
.features {
  padding: 6rem 2rem;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  padding: 2rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.feature-card.active {
  transform: translateY(-10px);
}

.feature-icon {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1.5rem;
}

.feature-card h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
  color: var(--primary-color);
  font-weight: 500;
}

/* Live Data Section */
.live-data {
  padding: 4rem 2rem;
  margin: 2rem;
  border-radius: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.data-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  border-radius: 0.5rem;
  background: rgba(var(--primary-rgb), 0.1);
}

.data-icon {
  font-size: 2rem;
  color: var(--primary-color);
}

.data-value {
  font-size: 1.5rem;
  font-weight: 600;
}

.map-container {
  aspect-ratio: 16/9;
  border-radius: 0.5rem;
  overflow: hidden;
  position: relative;
}

/* CTA Section */
.cta-section {
  position: relative;
  padding: 6rem 2rem;
  margin: 2rem;
  border-radius: 1rem;
  text-align: center;
  overflow: hidden;
}

.gradient-sphere {
  position: absolute;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  filter: blur(80px);
  opacity: 0.3;
}

.gradient-sphere:nth-child(1) { top: -100px; left: -100px; }
.gradient-sphere:nth-child(2) { bottom: -100px; right: -100px; }
.gradient-sphere:nth-child(3) { top: 50%; left: 50%; transform: translate(-50%, -50%); }

/* Footer */
.footer {
  background: var(--background-secondary);
  padding: 4rem 2rem 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-2px);
  background: var(--accent-color);
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.newsletter-form input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: var(--background-primary);
  color: var(--text-color);
}

.newsletter-form button {
  padding: 0.75rem;
  border-radius: 0.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
}

.footer-bottom {
  text-align: center;
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

@keyframes move-stars {
  from { background-position: 0 0; }
  to { background-position: 10000px 0; }
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

@media (max-width: 768px) {
  .hero {
    padding: 2rem 1rem;
  }

  .hero-content {
    padding: 2rem 1rem;
  }

  .animated-title {
    font-size: 2.5rem;
  }

  .features-grid,
  .data-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .live-data {
    margin: 1rem;
    padding: 2rem 1rem;
  }
}
</style> 