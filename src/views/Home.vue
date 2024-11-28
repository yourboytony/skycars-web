<template>
  <div class="home">
    <!-- Hero Section with Video Background -->
    <section class="hero">
      <div class="video-overlay"></div>
      <video autoplay muted loop class="hero-video">
        <source src="https://player.vimeo.com/external/368484050.hd.mp4?s=e63e84fc0ffe8fb5c2e939f6b0fbb42798c137d4&profile_id=175" type="video/mp4">
      </video>
      <div class="hero-content">
        <h1 class="hero-title">SkyCars Collective</h1>
        <p class="hero-subtitle">Your Premier Flight Simulation Marketplace</p>
        <div class="hero-cta">
          <router-link to="/listings" class="cta-button primary">
            <i class="fas fa-plane"></i>
            Explore Aircraft
          </router-link>
          <router-link to="/register" class="cta-button secondary">
            <i class="fas fa-user-plus"></i>
            Join Community
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Listings Section -->
    <section class="featured glass">
      <h2 class="section-title">Featured Aircraft</h2>
      <div class="featured-grid">
        <div v-for="item in featuredListings" :key="item.id" class="featured-card">
          <div class="card-image" :style="{ backgroundImage: `url(${item.image})` }">
            <div class="card-overlay">
              <span class="card-simulator">{{ item.simulator }}</span>
              <span class="card-price">{{ item.price_credits }} Credits</span>
            </div>
          </div>
          <div class="card-content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.description }}</p>
            <router-link :to="`/listings/${item.id}`" class="card-button">
              View Details
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Weather Section -->
    <section class="weather-section">
      <Weather />
    </section>

    <!-- Statistics Section with Parallax -->
    <section class="statistics parallax">
      <div class="stats-grid">
        <div class="stat-card glass">
          <i class="fas fa-plane"></i>
          <h3>{{ stats.aircraft }}+</h3>
          <p>Aircraft Available</p>
        </div>
        <div class="stat-card glass">
          <i class="fas fa-users"></i>
          <h3>{{ stats.users }}+</h3>
          <p>Active Pilots</p>
        </div>
        <div class="stat-card glass">
          <i class="fas fa-download"></i>
          <h3>{{ stats.downloads }}+</h3>
          <p>Downloads</p>
        </div>
        <div class="stat-card glass">
          <i class="fas fa-star"></i>
          <h3>{{ stats.rating }}</h3>
          <p>Average Rating</p>
        </div>
      </div>
    </section>

    <!-- Latest News Section -->
    <section class="news glass">
      <h2 class="section-title">Latest Updates</h2>
      <div class="news-grid">
        <article v-for="post in latestNews" :key="post.id" class="news-card">
          <div class="news-image" :style="{ backgroundImage: `url(${post.image})` }"></div>
          <div class="news-content">
            <span class="news-date">{{ formatDate(post.date) }}</span>
            <h3>{{ post.title }}</h3>
            <p>{{ post.excerpt }}</p>
            <a href="#" class="news-link">Read More</a>
          </div>
        </article>
      </div>
    </section>

    <!-- Community Section -->
    <section class="community">
      <div class="community-content glass">
        <h2 class="section-title">Join Our Community</h2>
        <p class="community-text">
          Connect with fellow aviation enthusiasts, share experiences, and explore
          the world of flight simulation together.
        </p>
        <div class="community-links">
          <a href="#" class="social-link discord">
            <i class="fab fa-discord"></i>
            Join Discord
          </a>
          <a href="#" class="social-link youtube">
            <i class="fab fa-youtube"></i>
            Watch Tutorials
          </a>
          <a href="#" class="social-link forum">
            <i class="fas fa-comments"></i>
            Visit Forum
          </a>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Weather from '../components/Weather.vue'

// Sample data with online images
const featuredListings = ref([
  {
    id: 1,
    title: 'Boeing 737 MAX',
    simulator: 'MSFS',
    price_credits: 2500,
    image: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=800',
    description: 'Ultra-realistic Boeing 737 MAX with custom sounds and effects.'
  },
  {
    id: 2,
    title: 'Airbus A320neo',
    simulator: 'X-Plane 12',
    price_credits: 3000,
    image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
    description: 'Study-level A320neo with advanced systems simulation.'
  },
  {
    id: 3,
    title: 'Cessna 172',
    simulator: 'MSFS',
    price_credits: 1500,
    image: 'https://images.unsplash.com/photo-1583362604314-4f11a30b8669?w=800',
    description: 'Classic training aircraft with realistic flight dynamics.'
  }
])

const stats = ref({
  aircraft: 250,
  users: 10000,
  downloads: 25000,
  rating: 4.9
})

const latestNews = ref([
  {
    id: 1,
    title: 'New A320neo Release',
    date: '2024-03-15',
    image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?w=800',
    excerpt: 'Experience the next generation of aviation with our latest A320neo release.'
  },
  {
    id: 2,
    title: 'Weather System Update',
    date: '2024-03-10',
    image: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=800',
    excerpt: 'Enhanced weather system with real-time METAR integration now available.'
  },
  {
    id: 3,
    title: 'Community Event',
    date: '2024-03-05',
    image: 'https://images.unsplash.com/photo-1559627755-42213a258052?w=800',
    excerpt: 'Join our virtual airshow featuring the best aircraft from our marketplace.'
  }
])

function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Animation on scroll
onMounted(() => {
  // Intersection Observer for animations
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate')
        entry.target.classList.add('loaded')
      }
    })
  }, { threshold: 0.1 })

  // Observe all sections and cards
  document.querySelectorAll('section, .featured-card, .news-card').forEach(element => {
    observer.observe(element)
  })

  // Preload hero video
  const video = document.querySelector('.hero-video')
  if (video) {
    video.load()
  }
})

// Add image loading optimization
function handleImageLoad(event) {
  event.target.closest('.featured-card, .news-card')?.classList.add('loaded')
}
</script>

<style scoped>
/* Hero Section */
.hero {
  height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.hero-video {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -2;
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    rgba(0, 0, 0, 0.5),
    rgba(0, 0, 0, 0.3),
    rgba(0, 0, 0, 0.5)
  );
  z-index: -1;
}

.hero-content {
  text-align: center;
  max-width: 800px;
  padding: 2rem;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.hero-subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

/* Featured Section */
.featured {
  padding: 4rem 2rem;
  margin: 2rem;
  border-radius: 1rem;
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  color: var(--text-color);
  font-size: 2.5rem;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Statistics Section */
.statistics {
  padding: 6rem 2rem;
  background-attachment: fixed;
  background-image: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?w=1920');
  background-size: cover;
  background-position: center;
  color: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-card {
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
}

.stat-card i {
  font-size: 2.5rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.stat-card h3 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

/* News Section */
.news {
  padding: 4rem 2rem;
  margin: 2rem;
  border-radius: 1rem;
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Community Section */
.community {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  color: white;
}

.community-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
  padding: 2rem;
  border-radius: 1rem;
}

.community-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

section.animate {
  opacity: 1;
  transform: translateY(0);
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .community-links {
    flex-direction: column;
    gap: 1rem;
  }
}

/* Add loading states for images */
.card-image {
  position: relative;
  height: 200px;
  background-color: var(--background-secondary);
  background-size: cover;
  background-position: center;
  border-radius: 0.5rem 0.5rem 0 0;
  transition: all 0.3s ease;
}

.card-image::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.7) 100%
  );
  border-radius: 0.5rem 0.5rem 0 0;
}

/* Add lazy loading for images */
.featured-card, .news-card {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.featured-card.loaded, .news-card.loaded {
  opacity: 1;
  transform: translateY(0);
}
</style>
