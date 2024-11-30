<template>
  <div class="home">
    <!-- Navigation -->
    <nav class="navigation">
      <div class="nav-left">
        <div class="logo">SKYCARS</div>
      </div>
      <div class="nav-right">
        <a href="#" class="nav-link">Aircraft</a>
        <a href="#" class="nav-link">Marketplace</a>
        <a href="#" class="nav-link">About</a>
        <button class="nav-button">Sign In</button>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Experience Next-Gen
          <span class="accent">Flight Simulation</span>
        </h1>
        <p class="hero-description">
          Discover ultra-realistic aircraft with unprecedented detail and accuracy.
        </p>
        <div class="hero-cta">
          <button class="primary-button">
            Explore Collection
            <span class="button-icon">→</span>
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div ref="modelContainer" class="model-container"></div>
        <div class="stats-overlay">
          <div class="stat">
            <span class="stat-number">100+</span>
            <span class="stat-label">Aircraft</span>
          </div>
          <div class="stat">
            <span class="stat-number">50K+</span>
            <span class="stat-label">Users</span>
          </div>
          <div class="stat">
            <span class="stat-number">4.9</span>
            <span class="stat-label">Rating</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Section -->
    <section class="featured">
      <div class="section-header">
        <h2>Featured Aircraft</h2>
        <p>Explore our latest high-fidelity aircraft</p>
      </div>
      <div class="aircraft-grid">
        <div v-for="aircraft in featuredAircraft" 
             :key="aircraft.id" 
             class="aircraft-card">
          <div class="card-image">
            <img :src="aircraft.image" :alt="aircraft.name">
            <div class="card-overlay">
              <span class="card-category">{{ aircraft.category }}</span>
            </div>
          </div>
          <div class="card-content">
            <h3>{{ aircraft.name }}</h3>
            <p>{{ aircraft.description }}</p>
            <div class="card-footer">
              <span class="price">{{ aircraft.price }}</span>
              <button class="card-button">Details</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Latest Updates -->
    <section class="updates">
      <div class="section-header">
        <h2>Latest Updates</h2>
        <p>Stay informed about our newest releases</p>
      </div>
      <div class="updates-grid">
        <div v-for="update in updates" 
             :key="update.id" 
             class="update-card">
          <span class="update-date">{{ update.date }}</span>
          <h3>{{ update.title }}</h3>
          <p>{{ update.description }}</p>
          <div class="update-tags">
            <span v-for="tag in update.tags" 
                  :key="tag" 
                  class="tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as THREE from 'three'

const modelContainer = ref(null)

const featuredAircraft = ref([
  {
    id: 1,
    name: 'F-35 Lightning II',
    category: 'Military',
    price: '$89.99',
    image: '/images/f35.jpg',
    description: 'Experience the pinnacle of modern air combat simulation.'
  },
  // Add more aircraft...
])

const updates = ref([
  {
    id: 1,
    date: 'March 15, 2024',
    title: 'Enhanced Flight Dynamics',
    description: 'Introducing our new aerodynamics system for ultra-realistic flight behavior.',
    tags: ['Update', 'Physics']
  },
  // Add more updates...
])

onMounted(() => {
  // Initialize 3D scene
})
</script>

<style scoped>
/* Modern Color System */
:root {
  --primary: #1a1a1a;
  --secondary: #333333;
  --accent: #d4af37;
  --text: #ffffff;
  --text-secondary: #999999;
  --background: #000000;
}

/* Base Styles */
.home {
  background: var(--background);
  color: var(--text);
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
}

/* Navigation */
.navigation {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 4rem;
  background: rgba(0, 0, 0, 0.9);
  backdrop-filter: blur(10px);
  z-index: 100;
}

.logo {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: 2px;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 3rem;
}

.nav-link {
  color: var(--text);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: var(--accent);
}

.nav-button {
  background: transparent;
  border: 1px solid var(--accent);
  color: var(--accent);
  padding: 0.75rem 2rem;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.nav-button:hover {
  background: var(--accent);
  color: var(--background);
}

/* Hero Section */
.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  padding: 8rem 4rem 4rem;
}

.hero-title {
  font-size: 4.5rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 2rem;
}

.accent {
  color: var(--accent);
}

.hero-description {
  font-size: 1.25rem;
  color: var(--text-secondary);
  margin-bottom: 3rem;
  line-height: 1.6;
}

.primary-button {
  background: var(--accent);
  color: var(--background);
  border: none;
  padding: 1rem 2.5rem;
  font-size: 1rem;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s ease;
}

.primary-button:hover {
  transform: translateY(-2px);
}

/* Aircraft Grid */
.aircraft-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.aircraft-card {
  background: var(--primary);
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.3s ease;
}

.aircraft-card:hover {
  transform: translateY(-10px);
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
  top: 1rem;
  left: 1rem;
  background: rgba(0, 0, 0, 0.8);
  padding: 0.5rem 1rem;
  border-radius: 4px;
}

.card-content {
  padding: 2rem;
}

/* Updates Section */
.updates-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
}

.update-card {
  background: var(--primary);
  padding: 2rem;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.update-card:hover {
  transform: translateY(-5px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 6rem 2rem 2rem;
  }

  .hero-title {
    font-size: 3rem;
  }

  .navigation {
    padding: 1rem 2rem;
  }

  .nav-right {
    display: none;
  }
}

@media (max-width: 768px) {
  .aircraft-grid,
  .updates-grid {
    grid-template-columns: 1fr;
  }
}
</style>