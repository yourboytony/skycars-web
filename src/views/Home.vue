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

      <div class="scroll-indicator">
        <div class="mouse">
          <div class="wheel"></div>
        </div>
        <div class="arrows">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </section>

    <!-- Features Section with 3D Cards -->
    <section class="features-section">
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
          <div class="feature-content">
            <div class="feature-icon-wrapper">
              <div class="feature-icon">
                <i :class="feature.icon"></i>
              </div>
              <div class="icon-glow"></div>
            </div>
            
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-description">{{ feature.description }}</p>
            
            <div class="feature-details" :class="{ 'show': feature.active }">
              <ul class="feature-list">
                <li v-for="(detail, index) in feature.details" 
                    :key="index"
                    :style="{ animationDelay: `${index * 0.1}s` }"
                >
                  <i class="fas fa-check"></i>
                  {{ detail }}
                </li>
              </ul>
            </div>

            <router-link :to="feature.link" class="feature-link">
              <span>Learn More</span>
              <i class="fas fa-arrow-right"></i>
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Tracking Section -->
    <section class="live-tracking">
      <div class="tracking-content glass">
        <div class="tracking-info">
          <h2 class="tracking-title">
            <span class="gradient-text">Real-Time</span> Flight Tracking
          </h2>
          <p class="tracking-description">
            Monitor flights worldwide with our advanced tracking system
          </p>
          
          <div class="tracking-stats">
            <div class="stat-item" v-for="stat in trackingStats" :key="stat.label">
              <div class="stat-value">
                <span class="counter">{{ stat.value }}</span>
                <span class="suffix">{{ stat.suffix }}</span>
              </div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>

          <div class="tracking-features">
            <div class="track-feature" v-for="(feature, index) in trackingFeatures" 
                 :key="index"
                 :style="{ animationDelay: `${index * 0.2}s` }"
            >
              <i :class="feature.icon"></i>
              <span>{{ feature.text }}</span>
            </div>
          </div>
        </div>

        <div class="map-container glass">
          <div class="map-overlay">
            <div class="radar-sweep"></div>
            <div class="flight-paths">
              <!-- Animated flight paths -->
              <div v-for="n in 5" :key="n" class="flight-path"></div>
            </div>
            <div class="location-markers">
              <!-- Pulsing location markers -->
              <div v-for="n in 8" :key="n" class="location-marker"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Weather Section -->
    <section class="weather-section glass">
      <div class="weather-content">
        <h2 class="section-title">
          <span class="gradient-text">Advanced</span> Weather Radar
        </h2>
        
        <div class="weather-grid">
          <div class="weather-card" v-for="weather in weatherFeatures" 
               :key="weather.title"
               :class="{ 'active': weather.active }"
               @mouseenter="weather.active = true"
               @mouseleave="weather.active = false"
          >
            <div class="weather-icon">
              <i :class="weather.icon"></i>
            </div>
            <h3>{{ weather.title }}</h3>
            <p>{{ weather.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="testimonials">
      <div class="testimonials-container">
        <h2 class="section-title">
          <span class="gradient-text">Trusted by</span> Pilots Worldwide
        </h2>

        <div class="testimonials-carousel" ref="carousel">
          <div class="carousel-track" 
               :style="{ transform: `translateX(-${activeSlide * 100}%)` }">
            <div v-for="testimonial in testimonials" 
                 :key="testimonial.id" 
                 class="testimonial-card glass"
            >
              <div class="testimonial-header">
                <div class="testimonial-avatar">
                  <img :src="testimonial.avatar" :alt="testimonial.name">
                  <div class="avatar-glow"></div>
                </div>
                <div class="testimonial-info">
                  <h3>{{ testimonial.name }}</h3>
                  <p>{{ testimonial.role }}</p>
                </div>
              </div>
              
              <div class="testimonial-content">
                <div class="quote-icon">
                  <i class="fas fa-quote-left"></i>
                </div>
                <p>{{ testimonial.content }}</p>
              </div>
              
              <div class="testimonial-rating">
                <i v-for="star in 5" 
                   :key="star" 
                   class="fas fa-star"
                   :class="{ 'active': star <= testimonial.rating }"
                ></i>
              </div>
            </div>
          </div>

          <div class="carousel-controls">
            <button class="control-btn prev" @click="prevSlide">
              <i class="fas fa-chevron-left"></i>
            </button>
            <div class="carousel-dots">
              <button v-for="(_, index) in testimonials" 
                      :key="index"
                      class="dot"
                      :class="{ 'active': index === activeSlide }"
                      @click="goToSlide(index)"
              ></button>
            </div>
            <button class="control-btn next" @click="nextSlide">
              <i class="fas fa-chevron-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing Section -->
    <section class="pricing">
      <div class="pricing-container">
        <h2 class="section-title">
          <span class="gradient-text">Simple</span> Pricing
        </h2>
        <p class="section-subtitle">Choose the perfect plan for your needs</p>

        <div class="pricing-grid">
          <div v-for="plan in plans" 
               :key="plan.name" 
               class="pricing-card glass"
               :class="{ 
                 'popular': plan.popular,
                 'active': plan.active 
               }"
               @mouseenter="plan.active = true"
               @mouseleave="plan.active = false"
          >
            <div class="pricing-header">
              <div class="currency-selector">
                <label for="currency">Currency:</label>
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

            <div class="price">
              <span class="currency">{{ currencies[selectedCurrency].symbol }}</span>
              <span class="amount">{{ formatPrice(plan.basePrice) }}</span>
              <span class="period">/month</span>
            </div>

            <p class="plan-description">{{ plan.description }}</p>

            <div class="pricing-features">
              <ul>
                <li v-for="(feature, index) in plan.features" 
                    :key="index"
                    :class="{ 'included': feature.included }"
                >
                  <i :class="feature.included ? 'fas fa-check' : 'fas fa-times'"></i>
                  {{ feature.text }}
                </li>
              </ul>
            </div>

            <button class="pricing-cta" 
                    :class="{ 'primary': plan.popular }"
                    @click="selectPlan(plan)"
            >
              <span>{{ plan.popular ? 'Get Started' : 'Choose Plan' }}</span>
              <i class="fas fa-arrow-right"></i>
            </button>

            <div v-if="plan.popular" class="popular-badge">
              Most Popular
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="faq-container">
        <h2 class="section-title">
          <span class="gradient-text">Common</span> Questions
        </h2>
        <p class="section-subtitle">Everything you need to know about Skycars</p>

        <div class="faq-grid">
          <div v-for="(faq, index) in faqs" 
               :key="index"
               class="faq-item glass"
               :class="{ 'active': faq.isOpen }"
          >
            <button class="faq-question" 
                    @click="toggleFaq(faq)"
                    :aria-expanded="faq.isOpen"
            >
              <span>{{ faq.question }}</span>
              <div class="icon-container">
                <i class="fas fa-plus plus"></i>
                <i class="fas fa-minus minus"></i>
              </div>
            </button>
            
            <div class="faq-answer" 
                 :style="{ maxHeight: faq.isOpen ? faq.height + 'px' : '0px' }"
                 ref="answerRefs"
            >
              <div class="answer-content">
                {{ faq.answer }}
              </div>
            </div>
          </div>
        </div>

        <div class="faq-cta glass">
          <h3>Still have questions?</h3>
          <p>We're here to help you with anything you need</p>
          <button class="contact-btn" @click="scrollToContact">
            <span>Contact Support</span>
            <i class="fas fa-arrow-right"></i>
          </button>
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

      <!-- Animated Background -->
      <div class="footer-background">
        <div class="gradient-layer"></div>
        <div class="pattern-layer"></div>
        <div v-for="n in 50" :key="n" class="star"></div>
      </div>
    </footer>

    <!-- Contact Section -->
    <section id="contact" class="contact-section">
      <div class="contact-container">
        <div class="contact-content glass">
          <div class="contact-info">
            <h2 class="contact-title">
              <span class="gradient-text">Get in</span> Touch
            </h2>
            <p class="contact-subtitle">We'd love to hear from you</p>

            <div class="contact-methods">
              <div class="contact-method" 
                   v-for="method in contactMethods" 
                   :key="method.type"
              >
                <div class="method-icon">
                  <i :class="method.icon"></i>
                  <div class="icon-glow"></div>
                </div>
                <div class="method-details">
                  <h3>{{ method.title }}</h3>
                  <p>{{ method.value }}</p>
                </div>
              </div>
            </div>

            <div class="social-links">
              <a v-for="social in socialLinks" 
                 :key="social.name"
                 :href="social.url"
                 class="social-link"
                 :title="social.name"
              >
                <i :class="social.icon"></i>
              </a>
            </div>
          </div>

          <div class="contact-form-wrapper">
            <form class="contact-form" @submit.prevent="submitForm">
              <div class="form-grid">
                <div class="form-group" 
                     :class="{ 'focused': focused === 'name' }"
                >
                  <label for="name">Name</label>
                  <div class="input-wrapper">
                    <i class="fas fa-user"></i>
                    <input 
                      type="text" 
                      id="name"
                      v-model="formData.name"
                      @focus="focused = 'name'"
                      @blur="focused = null"
                      required
                    >
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="form-group" 
                     :class="{ 'focused': focused === 'email' }"
                >
                  <label for="email">Email</label>
                  <div class="input-wrapper">
                    <i class="fas fa-envelope"></i>
                    <input 
                      type="email" 
                      id="email"
                      v-model="formData.email"
                      @focus="focused = 'email'"
                      @blur="focused = null"
                      required
                    >
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="form-group full-width" 
                     :class="{ 'focused': focused === 'subject' }"
                >
                  <label for="subject">Subject</label>
                  <div class="input-wrapper">
                    <i class="fas fa-heading"></i>
                    <input 
                      type="text" 
                      id="subject"
                      v-model="formData.subject"
                      @focus="focused = 'subject'"
                      @blur="focused = null"
                      required
                    >
                    <div class="input-border"></div>
                  </div>
                </div>

                <div class="form-group full-width" 
                     :class="{ 'focused': focused === 'message' }"
                >
                  <label for="message">Message</label>
                  <div class="input-wrapper">
                    <i class="fas fa-message"></i>
                    <textarea 
                      id="message"
                      v-model="formData.message"
                      @focus="focused = 'message'"
                      @blur="focused = null"
                      required
                    ></textarea>
                    <div class="input-border"></div>
                  </div>
                </div>
              </div>

              <button type="submit" class="submit-btn" :disabled="isSubmitting">
                <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
                <i class="fas fa-paper-plane"></i>
                <div class="btn-glow"></div>
              </button>
            </form>
          </div>
        </div>

        <!-- 3D Decorative Elements -->
        <div class="decorative-elements">
          <div class="floating-shape shape-1"></div>
          <div class="floating-shape shape-2"></div>
          <div class="floating-shape shape-3"></div>
          <div class="particles">
            <div v-for="n in 20" :key="n" class="particle"></div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

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

// Add counting animation
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

const activeSlide = ref(0)
const autoplayInterval = ref(null)

const testimonials = [
  {
    id: 1,
    name: 'John Smith',
    role: 'Commercial Pilot',
    avatar: '/avatars/pilot1.jpg',
    content: 'Skycars has revolutionized how I plan my flights. The weather integration is absolutely incredible.',
    rating: 5
  },
  // Add more testimonials...
]

const selectedCurrency = ref('CAD')
const exchangeRates = ref({})
const basePrice = 1.99 // Base price in CAD

const currencies = {
  CAD: { code: 'CAD', symbol: '$', rate: 1 },
  USD: { code: 'USD', symbol: '$', rate: 0.74 },
  EUR: { code: 'EUR', symbol: '€', rate: 0.68 },
  GBP: { code: 'GBP', symbol: '£', rate: 0.59 },
  AUD: { code: 'AUD', symbol: '$', rate: 1.13 },
  // Add more currencies as needed
}

const formatPrice = (price) => {
  const rate = currencies[selectedCurrency.value].rate
  const convertedPrice = (price * rate).toFixed(2)
  return convertedPrice
}

const updatePrices = () => {
  plans.value = plans.value.map(plan => ({
    ...plan,
    displayPrice: formatPrice(plan.basePrice)
  }))
}

// Update plans data
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
    popular: false,
    active: false
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
    popular: true,
    active: false
  }
])

// Fetch real exchange rates on component mount
onMounted(async () => {
  try {
    const response = await fetch(
      'https://api.exchangerate-api.com/v4/latest/CAD'
    )
    const data = await response.json()
    exchangeRates.value = data.rates
    // Update currency rates with real data
    Object.keys(currencies).forEach(code => {
      if (exchangeRates.value[code]) {
        currencies[code].rate = exchangeRates.value[code]
      }
    })
    updatePrices()
  } catch (error) {
    console.error('Failed to fetch exchange rates:', error)
  }
})

const nextSlide = () => {
  activeSlide.value = (activeSlide.value + 1) % testimonials.length
}

const prevSlide = () => {
  activeSlide.value = activeSlide.value === 0 
    ? testimonials.length - 1 
    : activeSlide.value - 1
}

const goToSlide = (index) => {
  activeSlide.value = index
}

const startAutoplay = () => {
  autoplayInterval.value = setInterval(nextSlide, 5000)
}

const stopAutoplay = () => {
  if (autoplayInterval.value) {
    clearInterval(autoplayInterval.value)
  }
}

onMounted(() => {
  startAutoplay()
})

onUnmounted(() => {
  stopAutoplay()
})

const faqs = ref([
  {
    question: 'How accurate is the weather forecasting?',
    answer: 'Our weather forecasting system uses data from multiple reliable sources and updates every 5 minutes, providing accuracy rates of over 95% for short-term forecasts.',
    isOpen: false,
    height: 0
  },
  {
    question: 'Can I use Skycars for commercial flights?',
    answer: 'Yes! We offer specialized commercial plans that include additional features like fleet management, crew scheduling, and advanced route optimization.',
    isOpen: false,
    height: 0
  },
  {
    question: 'Is there a mobile app available?',
    answer: 'Yes, we have native apps for both iOS and Android with full feature parity to the web version. You can download them from the respective app stores.',
    isOpen: false,
    height: 0
  },
  {
    question: 'What kind of support do you offer?',
    answer: 'We provide 24/7 support through live chat, email, and phone. Premium plans include priority support with dedicated account managers.',
    isOpen: false,
    height: 0
  }
])

const answerRefs = ref([])

const toggleFaq = (faq) => {
  // Close other FAQs
  faqs.value.forEach(f => {
    if (f !== faq) f.isOpen = false
  })
  
  // Toggle current FAQ
  faq.isOpen = !faq.isOpen
  
  // Update heights after DOM update
  nextTick(() => {
    faqs.value.forEach((f, index) => {
      const content = answerRefs.value[index]?.querySelector('.answer-content')
      if (content) {
        f.height = content.offsetHeight
      }
    })
  })
}

const scrollToContact = () => {
  document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })
}

onMounted(() => {
  // Initialize heights
  nextTick(() => {
    faqs.value.forEach((faq, index) => {
      const content = answerRefs.value[index]?.querySelector('.answer-content')
      if (content) {
        faq.height = content.offsetHeight
      }
    })
  })
})

const focused = ref(null)
const isSubmitting = ref(false)

const contactMethods = [
  {
    type: 'email',
    title: 'Email Us',
    value: 'contact@skycars.com',
    icon: 'fas fa-envelope'
  },
  {
    type: 'phone',
    title: 'Call Us',
    value: '+1 (555) 123-4567',
    icon: 'fas fa-phone'
  },
  {
    type: 'address',
    title: 'Visit Us',
    value: '123 Aviation Way, Sky City',
    icon: 'fas fa-location-dot'
  }
]

const socialLinks = [
  { name: 'Twitter', url: '#', icon: 'fab fa-twitter' },
  { name: 'LinkedIn', url: '#', icon: 'fab fa-linkedin' },
  { name: 'Facebook', url: '#', icon: 'fab fa-facebook' },
  { name: 'Instagram', url: '#', icon: 'fab fa-instagram' }
]

const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Add your form submission logic here
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulate API call
    
    // Reset form
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
    // Show success message
    alert('Message sent successfully!')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

// Lazy loading images
const lazyLoadImage = (target) => {
  const io = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        observer.disconnect()
      }
    })
  })
  io.observe(target)
}

// Debounced scroll handler
const debounce = (fn, delay) => {
  let timeoutId
  return (...args) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

// Optimized scroll handler
const handleScroll = debounce(() => {
  // Your scroll logic here
}, 16)

// Cleanup
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// Dynamic star positioning
onMounted(() => {
  const stars = document.querySelectorAll('.star')
  stars.forEach(star => {
    star.style.setProperty('--duration', `${4 + Math.random() * 6}s`)
    star.style.left = `${Math.random() * 100}%`
    star.style.top = `${Math.random() * 100}%`
  })

  // Initialize lazy loading
  document.querySelectorAll('img[data-src]').forEach(lazyLoadImage)
  
  // Add scroll listener
  window.addEventListener('scroll', handleScroll)
})

// Preload critical assets
const preloadAssets = () => {
  const criticalImages = [
    '/images/hero-bg.jpg',
    '/images/logo.svg'
  ]
  
  criticalImages.forEach(src => {
    const img = new Image()
    img.src = src
  })
}

// Add to existing onMounted
onMounted(() => {
  preloadAssets()
  // ... other onMounted code
})
</script>

<style scoped>
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 2rem;
  background: var(--background-primary);
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
}

.gradient-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
  animation: float 20s ease-in-out infinite;
}

.sphere-1 {
  width: 400px;
  height: 400px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  top: -100px;
  left: -100px;
  animation-delay: -5s;
}

.sphere-2 {
  width: 300px;
  height: 300px;
  background: linear-gradient(135deg, var(--secondary-color), var(--primary-color));
  bottom: -50px;
  right: -50px;
  animation-delay: -2s;
}

.sphere-3 {
  width: 200px;
  height: 200px;
  background: linear-gradient(135deg, var(--accent-color), var(--secondary-color));
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -8s;
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: var(--primary-color);
  border-radius: 50%;
  animation: particle-float 20s linear infinite;
}

.hero-content {
  position: relative;
  z-index: 2;
  max-width: 1200px;
  text-align: center;
  padding: 3rem;
  border-radius: 2rem;
  background: rgba(var(--background-primary-rgb), 0.8);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.hero-title {
  font-size: 4.5rem;
  line-height: 1.2;
  margin-bottom: 1.5rem;
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 8s ease infinite;
}

.main-text {
  display: block;
  font-size: 4rem;
  color: var(--text-color);
  margin-top: 0.5rem;
}

.hero-subtitle {
  font-size: 1.5rem;
  color: var(--text-light);
  margin-bottom: 3rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-bottom: 4rem;
}

.cta-primary,
.cta-secondary {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 2rem;
  border-radius: 1rem;
  font-weight: 600;
  font-size: 1.125rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.cta-primary {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
}

.button-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cta-primary:hover .button-glow {
  opacity: 0.1;
  animation: rotate 2s linear infinite;
}

.hero-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.stat-card {
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.stat-label {
  color: var(--text-light);
  font-size: 1.125rem;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.scroll-indicator:hover {
  opacity: 1;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 30px);
  }
}

@keyframes particle-float {
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateY(-1000px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* Add responsive styles */
@media (max-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
  
  .main-text {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1.25rem;
  }
  
  .hero-cta {
    flex-direction: column;
  }
  
  .cta-primary,
  .cta-secondary {
    width: 100%;
    justify-content: center;
  }
}

/* Features Section Styles */
.features-section {
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.feature-card {
  position: relative;
  padding: 2rem;
  border-radius: 1.5rem;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  perspective: 1000px;
}

.feature-card.active {
  transform: translateY(-10px) rotateX(10deg);
  box-shadow: 0 20px 40px rgba(var(--primary-rgb), 0.1);
}

.feature-icon-wrapper {
  position: relative;
  width: 80px;
  height: 80px;
  margin-bottom: 1.5rem;
}

.feature-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 20px;
  font-size: 2rem;
  color: white;
  position: relative;
  z-index: 1;
}

.icon-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--primary-color);
  filter: blur(20px);
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;
}

.feature-card.active .icon-glow {
  opacity: 0.5;
}

.feature-title {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.feature-description {
  color: var(--text-light);
  margin-bottom: 1.5rem;
}

.feature-details {
  height: 0;
  opacity: 0;
  transition: all 0.3s ease;
  overflow: hidden;
}

.feature-details.show {
  height: auto;
  opacity: 1;
  margin: 1rem 0;
}

.feature-list li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  opacity: 0;
  transform: translateX(-20px);
}

.feature-card.active .feature-list li {
  animation: slideIn 0.5s forwards;
}

/* Live Tracking Styles */
.live-tracking {
  padding: 4rem 2rem;
  background: var(--background-secondary);
}

.tracking-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 3rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 3rem;
  border-radius: 2rem;
}

.map-container {
  position: relative;
  aspect-ratio: 16/9;
  border-radius: 1rem;
  overflow: hidden;
}

.radar-sweep {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent 50%, rgba(var(--primary-rgb), 0.1) 100%);
  animation: radar-sweep 4s linear infinite;
}

.flight-path {
  position: absolute;
  height: 2px;
  background: var(--primary-color);
  opacity: 0.5;
  animation: flight-path 10s linear infinite;
}

.location-marker {
  position: absolute;
  width: 10px;
  height: 10px;
  background: var(--accent-color);
  border-radius: 50%;
  animation: pulse 2s ease-out infinite;
}

@keyframes radar-sweep {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes flight-path {
  from { width: 0; opacity: 0; }
  50% { opacity: 1; }
  to { width: 100%; opacity: 0; }
}

@keyframes slideIn {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* Add responsive styles */
@media (max-width: 1024px) {
  .tracking-content {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .section-title {
    font-size: 2.5rem;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
}

/* Testimonials Styles */
.testimonials {
  padding: 8rem 2rem;
  background: var(--background-primary);
  position: relative;
  overflow: hidden;
}

.testimonials-container {
  max-width: 1400px;
  margin: 0 auto;
}

.testimonials-carousel {
  position: relative;
  margin-top: 4rem;
  overflow: hidden;
}

.carousel-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.testimonial-card {
  flex: 0 0 100%;
  padding: 3rem;
  border-radius: 2rem;
  margin: 1rem;
  transition: all 0.3s ease;
}

.testimonial-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.testimonial-avatar {
  position: relative;
  width: 80px;
  height: 80px;
}

.testimonial-avatar img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.avatar-glow {
  position: absolute;
  inset: -5px;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  z-index: -1;
  opacity: 0.5;
  filter: blur(10px);
}

.quote-icon {
  font-size: 2rem;
  color: var(--primary-color);
  margin-bottom: 1rem;
  opacity: 0.5;
}

.testimonial-rating {
  margin-top: 2rem;
}

.fa-star {
  color: #cbd5e1;
  margin-right: 0.25rem;
}

.fa-star.active {
  color: #fbbf24;
}

/* Pricing Styles */
.pricing {
  padding: 8rem 2rem;
  background: var(--background-secondary);
}

.pricing-container {
  max-width: 1400px;
  margin: 0 auto;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
}

.pricing-card {
  position: relative;
  padding: 3rem;
  border-radius: 2rem;
  transition: all 0.3s ease;
}

.pricing-card.active {
  transform: translateY(-10px);
}

.pricing-card.popular {
  border: 2px solid var(--primary-color);
}

.popular-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--primary-color);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 2rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.price {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 1.5rem 0;
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 0.25rem;
}

.currency {
  font-size: 1.5rem;
  vertical-align: super;
}

.period {
  font-size: 1.25rem;
  color: var(--text-light);
}

.pricing-features {
  margin: 2rem 0;
}

.pricing-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
  color: var(--text-light);
}

.pricing-features li.included {
  color: var(--text-color);
}

.pricing-cta {
  width: 100%;
  padding: 1rem;
  border-radius: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.pricing-cta.primary {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
}

@media (max-width: 768px) {
  .pricing-grid {
    grid-template-columns: 1fr;
  }
}

.faq-section {
  padding: 8rem 2rem;
  background: var(--background-primary);
  position: relative;
  overflow: hidden;
}

.faq-container {
  max-width: 1000px;
  margin: 0 auto;
}

.faq-grid {
  margin-top: 4rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.faq-item.active {
  box-shadow: 0 10px 30px rgba(var(--primary-rgb), 0.1);
}

.faq-question {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-color);
  font-size: 1.125rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
}

.icon-container {
  position: relative;
  width: 24px;
  height: 24px;
}

.plus,
.minus {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all 0.3s ease;
}

.minus {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(-90deg);
}

.faq-item.active .plus {
  opacity: 0;
  transform: translate(-50%, -50%) rotate(90deg);
}

.faq-item.active .minus {
  opacity: 1;
  transform: translate(-50%, -50%) rotate(0);
}

.faq-answer {
  overflow: hidden;
  transition: max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.answer-content {
  padding: 0 1.5rem 1.5rem;
  color: var(--text-light);
  line-height: 1.6;
}

.faq-cta {
  margin-top: 4rem;
  padding: 3rem;
  text-align: center;
  border-radius: 1rem;
}

.faq-cta h3 {
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.faq-cta p {
  color: var(--text-light);
  margin-bottom: 2rem;
}

.contact-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.contact-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.2);
}

@media (max-width: 768px) {
  .faq-section {
    padding: 4rem 1rem;
  }
  
  .faq-question {
    font-size: 1rem;
    padding: 1.25rem;
  }
  
  .answer-content {
    padding: 0 1.25rem 1.25rem;
  }
}

.contact-section {
  padding: 8rem 2rem;
  position: relative;
  overflow: hidden;
  background: var(--background-secondary);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
}

.contact-content {
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  gap: 4rem;
  padding: 4rem;
  border-radius: 2rem;
  position: relative;
  z-index: 2;
}

.contact-title {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.contact-subtitle {
  color: var(--text-light);
  font-size: 1.25rem;
  margin-bottom: 3rem;
}

.contact-methods {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.method-icon {
  position: relative;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 1rem;
  font-size: 1.5rem;
  color: white;
}

.icon-glow {
  position: absolute;
  inset: 0;
  background: inherit;
  border-radius: inherit;
  filter: blur(15px);
  opacity: 0.5;
  z-index: -1;
}

.method-details h3 {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.method-details p {
  color: var(--text-light);
}

.social-links {
  display: flex;
  gap: 1rem;
}

.social-link {
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background-primary);
  border-radius: 50%;
  color: var(--text-color);
  font-size: 1.25rem;
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  color: var(--primary-color);
  box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.1);
}

.contact-form {
  background: var(--background-primary);
  padding: 3rem;
  border-radius: 1.5rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 0.75rem;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  color: var(--text-light);
  transition: color 0.3s ease;
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.input-wrapper textarea {
  min-height: 150px;
  resize: vertical;
}

.form-group.focused .input-wrapper i {
  color: var(--primary-color);
}

.form-group.focused .input-wrapper input,
.form-group.focused .input-wrapper textarea {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 4px rgba(var(--primary-rgb), 0.1);
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.submit-btn:hover {
  transform: translateY(-2px);
}

.btn-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.submit-btn:hover .btn-glow {
  opacity: 0.1;
  animation: rotate 2s linear infinite;
}

/* Decorative Elements */
.decorative-elements {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.floating-shape {
  position: absolute;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  border-radius: 50%;
  filter: blur(40px);
  opacity: 0.1;
  animation: float 20s ease-in-out infinite;
}

.shape-1 {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -100px;
  animation-delay: -5s;
}

.shape-2 {
  width: 200px;
  height: 200px;
  bottom: -50px;
  right: -50px;
  animation-delay: -2s;
}

.shape-3 {
  width: 150px;
  height: 150px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation-delay: -8s;
}

@keyframes float {
  0%, 100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(30px, 30px);
  }
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .contact-content {
    grid-template-columns: 1fr;
    gap: 3rem;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 4rem 1rem;
  }
  
  .contact-content {
    padding: 2rem;
  }
  
  .form-grid {
    grid-template-columns: 1fr;
  }
}

.currency-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  justify-content: center;
}

.currency-selector select {
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-color);
  background: var(--background-primary);
  color: var(--text-color);
  font-size: 1rem;
  cursor: pointer;
}

.currency-selector select:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
}
</style> 