<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-background">
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="gradient-sphere sphere-3"></div>
        <div class="particles-container">
          <div v-for="n in 50" :key="n" class="particle"></div>
        </div>
      </div>

      <div class="hero-content glass">
        <h1 class="hero-title">
          <span class="gradient-text">Next Generation</span>
          <span class="main-text">Aviation Platform</span>
        </h1>
        
        <p class="hero-subtitle">
          Experience the future of flight planning with real-time tracking, 
          weather updates, and a global aviation community
        </p>

        <div class="hero-cta">
          <button @click="$emit('showRegister')" class="cta-primary">
            <span>Start Your Journey</span>
            <i class="fas fa-arrow-right"></i>
            <div class="button-glow"></div>
          </button>
          <button class="cta-secondary" @click="scrollToFeatures">
            <span>Explore Features</span>
            <i class="fas fa-chevron-down"></i>
          </button>
        </div>

        <div class="hero-stats">
          <div v-for="stat in stats" 
               :key="stat.label" 
               class="stat-card glass"
               @mouseenter="startCount(stat)"
          >
            <div class="stat-value">
              <span class="counter">{{ stat.currentValue }}</span>
              <span class="suffix">{{ stat.suffix }}</span>
            </div>
            <div class="stat-label">{{ stat.label }}</div>
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="features-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="gradient-text">Powerful</span> Features
        </h2>
        <p class="section-subtitle">Everything you need for professional flight planning</p>
      </div>

      <div class="features-grid">
        <div v-for="feature in features" 
             :key="feature.title"
             class="feature-card glass"
             :class="{ 'active': feature.active }"
             @mouseenter="activateFeature(feature)"
             @mouseleave="deactivateFeature(feature)"
        >
          <div class="feature-icon-wrapper">
            <i :class="feature.icon"></i>
            <div class="icon-glow"></div>
          </div>
          <h3>{{ feature.title }}</h3>
          <p>{{ feature.description }}</p>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="gradient-text">Simple</span> Pricing
        </h2>
        <p class="section-subtitle">Choose the perfect plan for your needs</p>
        
        <div class="currency-selector">
          <label for="currency">Select Currency:</label>
          <select v-model="selectedCurrency" @change="updatePrices">
            <option v-for="curr in currencies" 
                    :key="curr.code" 
                    :value="curr.code"
            >
              {{ curr.code }} ({{ curr.symbol }})
            </option>
          </select>
        </div>
      </div>

      <div class="pricing-grid">
        <div v-for="plan in plans" 
             :key="plan.name" 
             class="pricing-card glass"
             :class="{ 'popular': plan.popular }"
        >
          <div class="pricing-header">
            <h3>{{ plan.name }}</h3>
            <div class="price">
              <span class="currency">{{ currencies[selectedCurrency].symbol }}</span>
              <span class="amount">{{ formatPrice(plan.basePrice) }}</span>
              <span class="period">/month</span>
            </div>
          </div>
          
          <ul class="pricing-features">
            <li v-for="feature in plan.features" 
                :key="feature.text"
                :class="{ 'included': feature.included }"
            >
              <i :class="feature.included ? 'fas fa-check' : 'fas fa-times'"></i>
              {{ feature.text }}
            </li>
          </ul>

          <button class="pricing-cta" 
                  :class="{ 'primary': plan.popular }"
                  @click="selectPlan(plan)"
          >
            Get Started
          </button>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="gradient-text">Common</span> Questions
        </h2>
        <p class="section-subtitle">Everything you need to know about Skycars</p>
      </div>

      <div class="faq-grid">
        <div v-for="faq in faqs" 
             :key="faq.question"
             class="faq-item glass"
             :class="{ 'active': faq.isOpen }"
        >
          <button class="faq-question" @click="toggleFaq(faq)">
            <span>{{ faq.question }}</span>
            <i :class="faq.isOpen ? 'fas fa-minus' : 'fas fa-plus'"></i>
          </button>
          <div class="faq-answer" v-show="faq.isOpen">
            {{ faq.answer }}
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-top">
        <div class="newsletter-section glass">
          <div class="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Get the latest aviation news and updates straight to your inbox</p>
          </div>
          
          <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
            <div class="input-group">
              <i class="fas fa-envelope"></i>
              <input 
                type="email" 
                v-model="newsletterEmail"
                placeholder="Enter your email"
                required
              >
            </div>
            <button type="submit" :disabled="isSubscribing">
              <span>{{ isSubscribing ? 'Subscribing...' : 'Subscribe' }}</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>

        <div class="footer-grid">
          <div class="footer-brand">
            <router-link to="/" class="footer-logo">
              <i class="fas fa-plane-departure"></i>
              <span>SKYCARS</span>
            </router-link>
            <p class="brand-description">
              Next generation aviation platform for flight planning and tracking
            </p>
            <div class="footer-social">
              <a v-for="social in socialLinks" 
                 :key="social.name"
                 :href="social.url"
                 class="social-icon"
              >
                <i :class="social.icon"></i>
              </a>
            </div>
          </div>

          <div v-for="menu in footerMenus" 
               :key="menu.title" 
               class="footer-menu"
          >
            <h3>{{ menu.title }}</h3>
            <ul>
              <li v-for="item in menu.items" :key="item.text">
                <router-link v-if="item.internal" :to="item.link">
                  {{ item.text }}
                </router-link>
                <a v-else :href="item.link">{{ item.text }}</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="footer-container">
          <p class="copyright">
            © {{ new Date().getFullYear() }} Skycars. All rights reserved.
          </p>
          <div class="legal-links">
            <router-link to="/privacy">Privacy Policy</router-link>
            <router-link to="/terms">Terms of Service</router-link>
            <router-link to="/cookies">Cookie Policy</router-link>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Hero Section Data
const stats = ref([
  {
    label: 'Active Users',
    value: '10K',
    suffix: '+',
    icon: 'fas fa-users',
    currentValue: 0,
    counting: false
  },
  {
    label: 'Flights Planned',
    value: '100K',
    suffix: '+',
    icon: 'fas fa-plane',
    currentValue: 0,
    counting: false
  },
  {
    label: 'Countries',
    value: '50',
    suffix: '+',
    icon: 'fas fa-globe',
    currentValue: 0,
    counting: false
  }
])

// Features Section Data
const features = ref([
  {
    title: 'Flight Planning',
    description: 'Advanced route optimization and planning tools',
    icon: 'fas fa-route',
    active: false
  },
  {
    title: 'Weather Integration',
    description: 'Real-time weather updates and forecasts',
    icon: 'fas fa-cloud-sun',
    active: false
  },
  {
    title: 'Live Tracking',
    description: 'Track flights in real-time with precision',
    icon: 'fas fa-location-dot',
    active: false
  },
  {
    title: 'Community',
    description: 'Connect with pilots worldwide',
    icon: 'fas fa-users',
    active: false
  }
])

// Pricing Section Data
const selectedCurrency = ref('CAD')
const basePrice = 1.99 // Base price in CAD

const currencies = {
  CAD: { code: 'CAD', symbol: '$', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 0.74 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.68 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.59 },
  AUD: { code: 'AUD', symbol: '$', rate: 1.13 }
}

const plans = ref([
  {
    name: 'Basic',
    basePrice: 1.99,
    description: 'Perfect for individual pilots',
    features: [
      { text: 'Basic Flight Planning', included: true },
      { text: 'Weather Reports', included: true },
      { text: 'Route Optimization', included: false },
      { text: 'Premium Support', included: false }
    ],
    popular: false
  },
  {
    name: 'Pro',
    basePrice: 4.99,
    description: 'For serious aviation enthusiasts',
    features: [
      { text: 'Advanced Flight Planning', included: true },
      { text: 'Real-time Weather', included: true },
      { text: 'Route Optimization', included: true },
      { text: 'Premium Support', included: true }
    ],
    popular: true
  }
])

// FAQ Section Data
const faqs = ref([
  {
    question: 'How accurate is the weather forecasting?',
    answer: 'Our weather forecasting system uses data from multiple reliable sources and updates every 5 minutes, providing accuracy rates of over 95% for short-term forecasts.',
    isOpen: false
  },
  {
    question: 'Can I use Skycars for commercial flights?',
    answer: 'Yes! We offer specialized commercial plans that include additional features like fleet management, crew scheduling, and advanced route optimization.',
    isOpen: false
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Yes, we have native apps for both iOS and Android with full feature parity to the web version.',
    isOpen: false
  }
])

// Footer Data
const newsletterEmail = ref('')
const isSubscribing = ref(false)

const footerMenus = [
  {
    title: 'Product',
    items: [
      { text: 'Features', link: '/features', internal: true },
      { text: 'Pricing', link: '/pricing', internal: true },
      { text: 'Updates', link: '/updates', internal: true }
    ]
  },
  {
    title: 'Company',
    items: [
      { text: 'About', link: '/about', internal: true },
      { text: 'Contact', link: '/contact', internal: true },
      { text: 'Careers', link: '/careers', internal: true }
    ]
  },
  {
    title: 'Support',
    items: [
      { text: 'Help Center', link: '/help', internal: true },
      { text: 'Documentation', link: '/docs', internal: true },
      { text: 'Status', link: '/status', internal: true }
    ]
  }
]

const socialLinks = [
  { name: 'Twitter', url: '#', icon: 'fab fa-twitter' },
  { name: 'LinkedIn', url: '#', icon: 'fab fa-linkedin' },
  { name: 'Facebook', url: '#', icon: 'fab fa-facebook' },
  { name: 'Instagram', url: '#', icon: 'fab fa-instagram' }
]

// Methods
const scrollToFeatures = () => {
  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}

const startCount = (stat) => {
  if (stat.counting) return
  
  stat.counting = true
  const duration = 2000
  const start = stat.currentValue
  const end = parseInt(stat.value)
  const range = end - start
  const startTime = performance.now()
  
  const updateCount = (currentTime) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)
    
    stat.currentValue = Math.floor(start + (range * progress))
    
    if (progress < 1) {
      requestAnimationFrame(updateCount)
    }
  }
  
  requestAnimationFrame(updateCount)
}

const activateFeature = (feature) => {
  feature.active = true
}

const deactivateFeature = (feature) => {
  feature.active = false
}

const formatPrice = (price) => {
  const rate = currencies[selectedCurrency.value].rate
  return (price * rate).toFixed(2)
}

const updatePrices = () => {
  // Prices are automatically updated through computed properties
}

const selectPlan = (plan) => {
  router.push('/register?plan=' + plan.name.toLowerCase())
}

const toggleFaq = (faq) => {
  faqs.value.forEach(f => {
    if (f !== faq) f.isOpen = false
  })
  faq.isOpen = !faq.isOpen
}

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value) return
  
  isSubscribing.value = true
  try {
    // Add newsletter subscription logic here
    await new Promise(resolve => setTimeout(resolve, 1000))
    alert('Successfully subscribed to newsletter!')
    newsletterEmail.value = ''
  } catch (error) {
    console.error('Failed to subscribe:', error)
    alert('Failed to subscribe. Please try again.')
  } finally {
    isSubscribing.value = false
  }
}

// Lifecycle hooks
onMounted(async () => {
  try {
    // Fetch real exchange rates
    const response = await fetch('https://api.exchangerate-api.com/v4/latest/CAD')
    const data = await response.json()
    Object.keys(currencies).forEach(code => {
      if (data.rates[code]) {
        currencies[code].rate = data.rates[code]
      }
    })
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
  }
})
</script>

<style scoped>
/* Base Styles */
.home {
  min-height: 100vh;
  background: var(--background-primary);
  color: var(--text-color);
}

/* Hero Section */
.hero {
  position: relative;
  min-height: 100vh;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(60px);
  opacity: 0.5;
}

.sphere-1 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, var(--primary-color), transparent);
  top: -100px;
  left: -100px;
  animation: float 20s ease-in-out infinite;
}

.sphere-2 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--accent-color), transparent);
  bottom: -50px;
  right: -50px;
  animation: float 15s ease-in-out infinite reverse;
}

.sphere-3 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--primary-color), transparent);
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: float 25s ease-in-out infinite;
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
  text-align: center;
  padding: 3rem;
  border-radius: 2rem;
}

.hero-title {
  font-size: 4rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  display: block;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-light);
  max-width: 600px;
  margin: 0 auto 3rem;
}

.hero-cta {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.cta-primary {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.cta-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.2);
}

.button-glow {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, transparent, rgba(255,255,255,0.2));
  transform: translateX(-100%);
  transition: transform 0.5s ease;
}

.cta-primary:hover .button-glow {
  transform: translateX(100%);
}

.cta-secondary {
  padding: 1rem 2.5rem;
  background: transparent;
  color: var(--text-color);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cta-secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
  transform: translateY(-2px);
}

/* Features Section */
.features-section {
  padding: 8rem 2rem;
  background: var(--background-secondary);
  position: relative;
}

.section-header {
  text-align: center;
  margin-bottom: 4rem;
}

.section-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.section-subtitle {
  color: var(--text-light);
  font-size: 1.25rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.feature-card {
  padding: 2rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  transform: translateY(-5px);
}

.feature-icon-wrapper {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  position: relative;
}

.feature-icon-wrapper i {
  font-size: 2rem;
  color: white;
}

.icon-glow {
  position: absolute;
  inset: -5px;
  border-radius: 50%;
  background: inherit;
  filter: blur(15px);
  opacity: 0.5;
}

/* Pricing Section */
.pricing-section {
  padding: 8rem 2rem;
  background: var(--background-primary);
}

.currency-selector {
  margin: 2rem 0;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.pricing-card {
  padding: 3rem 2rem;
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.pricing-card.popular {
  transform: scale(1.05);
  border: 1px solid var(--primary-color);
}

.pricing-header {
  text-align: center;
  margin-bottom: 2rem;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.currency {
  font-size: 1.5rem;
}

.period {
  font-size: 1.25rem;
  color: var(--text-light);
}

/* FAQ Section */
.faq-section {
  padding: 8rem 2rem;
  background: var(--background-secondary);
}

.faq-grid {
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border-radius: 1rem;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1.125rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left;
}

.faq-answer {
  padding: 0 1.5rem 1.5rem;
  color: var(--text-light);
  line-height: 1.6;
}

/* Footer */
.footer {
  background: var(--background-primary);
  padding-top: 4rem;
}

.footer-top {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.newsletter-section {
  padding: 3rem;
  border-radius: 1rem;
  margin-bottom: 4rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 2fr repeat(3, 1fr);
  gap: 4rem;
  padding-bottom: 4rem;
}

.footer-bottom {
  border-top: 1px solid var(--border-color);
  padding: 2rem 0;
}

.footer-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Animations */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(20px, 20px);
  }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .footer-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero {
    padding: 4rem 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .hero-cta {
    flex-direction: column;
  }

  .features-grid,
  .pricing-grid {
    grid-template-columns: 1fr;
  }

  .footer-grid {
    grid-template-columns: 1fr;
  }

  .footer-container {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }
}

/* Utility Classes */
.glass {
  background: rgba(var(--background-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.hover-effect {
  transition: all 0.3s ease;
}

.hover-effect:hover {
  transform: translateY(-2px);
}
</style>