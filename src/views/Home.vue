<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="stars"></div>
        <div class="twinkling"></div>
      </div>
      <div class="hero-content glass">
        <h1 class="animated-text">Welcome to Skycars</h1>
        <p class="subtitle">Your Ultimate Aviation Planning Platform</p>
        <div class="cta-buttons">
          <button @click="$emit('showRegister')" class="btn-primary">
            Get Started
            <i class="fas fa-arrow-right"></i>
          </button>
          <button @click="$emit('showLogin')" class="btn-secondary">
            Sign In
            <i class="fas fa-sign-in-alt"></i>
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features">
      <h2>Why Choose Skycars?</h2>
      <div class="feature-grid">
        <div class="feature-card">
          <i class="fas fa-plane"></i>
          <h3>Flight Planning</h3>
          <p>Advanced tools for route planning and optimization</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-cloud"></i>
          <h3>Weather Updates</h3>
          <p>Real-time weather data and forecasting</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-map-marked-alt"></i>
          <h3>Live Tracking</h3>
          <p>Track flights in real-time with precision</p>
        </div>
        <div class="feature-card">
          <i class="fas fa-users"></i>
          <h3>Community</h3>
          <p>Connect with other aviation enthusiasts</p>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about">
      <div class="about-content">
        <h2>About Skycars</h2>
        <p>
          Skycars is your comprehensive aviation platform, designed to make flight planning 
          and tracking easier than ever. Whether you're a professional pilot or an aviation 
          enthusiast, our tools help you stay informed and connected.
        </p>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats">
      <div class="stat-item">
        <h3>10K+</h3>
        <p>Active Users</p>
      </div>
      <div class="stat-item">
        <h3>50K+</h3>
        <p>Flights Tracked</p>
      </div>
      <div class="stat-item">
        <h3>100+</h3>
        <p>Countries</p>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <div class="footer-section">
          <h4>Skycars</h4>
          <p>Your Aviation Partner</p>
        </div>
        <div class="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        <div class="footer-section">
          <h4>Contact</h4>
          <p>Email: info@skycars.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; 2024 Skycars. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
.home {
  min-height: 100vh;
}

.hero {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
              url('/images/hero-bg.jpg') center/cover;
  height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
}

.hero-content {
  max-width: 800px;
  padding: 2rem;
}

.hero h1 {
  font-size: 3.5rem;
  margin-bottom: 1rem;
}

.subtitle {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.btn-primary,
.btn-secondary {
  padding: 1rem 2rem;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid white;
}

.features {
  padding: 4rem 2rem;
  text-align: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
}

.feature-card {
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.feature-card i {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
}

.about {
  background: #f8fafc;
  padding: 4rem 2rem;
}

.about-content {
  max-width: 800px;
  margin: 0 auto;
  text-align: center;
}

.stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  padding: 4rem 2rem;
  background: var(--primary-color);
  color: white;
  text-align: center;
}

.stat-item h3 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.footer {
  background: #1f2937;
  color: white;
  padding: 4rem 2rem 1rem;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section a {
  color: white;
  text-decoration: none;
}

.footer-bottom {
  text-align: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

@media (max-width: 768px) {
  .hero h1 {
    font-size: 2.5rem;
  }
  
  .subtitle {
    font-size: 1.25rem;
  }
  
  .cta-buttons {
    flex-direction: column;
  }
  
  .stats {
    grid-template-columns: 1fr;
  }
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.stars {
  background: #000 url(/images/stars.png) repeat;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
  animation: move-stars 200s linear infinite;
}

.twinkling {
  background: transparent url(/images/twinkling.png) repeat;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  animation: move-twinkle 200s linear infinite;
}

.hero-content {
  position: relative;
  z-index: 2;
  padding: 3rem;
  border-radius: 16px;
}

.animated-text {
  background: linear-gradient(45deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradient 8s ease infinite;
}

.btn-primary,
.btn-secondary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: transform 0.3s ease;
}

.btn-primary:hover,
.btn-secondary:hover {
  transform: translateY(-2px);
}

@keyframes move-stars {
  from { background-position: 0 0; }
  to { background-position: 10000px 0; }
}

@keyframes move-twinkle {
  from { background-position: 0 0; }
  to { background-position: 10000px 0; }
}

@keyframes gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}
</style> 