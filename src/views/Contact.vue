<template>
  <div class="contact-page">
    <!-- Hero Banner -->
    <section class="contact-hero">
      <div class="hero-content glass">
        <h1 class="hero-title">
          <span class="gradient-text">Get in</span> Touch
        </h1>
        <p class="hero-subtitle">We're here to help with any questions you have</p>
      </div>
      
      <div class="hero-background">
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="particles-container">
          <div v-for="n in 30" :key="n" class="particle"></div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section class="contact-section">
      <div class="contact-container">
        <!-- Contact Methods -->
        <div class="contact-methods glass">
          <div v-for="method in contactMethods" 
               :key="method.type"
               class="contact-method"
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

        <!-- Contact Form -->
        <div class="contact-form-wrapper glass">
          <h2>Send us a Message</h2>
          
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
                    rows="5"
                  ></textarea>
                  <div class="input-border"></div>
                </div>
              </div>
            </div>

            <button type="submit" 
                    class="submit-button"
                    :disabled="isSubmitting"
            >
              <span>{{ isSubmitting ? 'Sending...' : 'Send Message' }}</span>
              <i class="fas fa-paper-plane"></i>
            </button>
          </form>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="section-header">
        <h2 class="section-title">
          <span class="gradient-text">Frequently Asked</span> Questions
        </h2>
        <p class="section-subtitle">Find quick answers to common questions</p>
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
  </div>
</template>

<script setup>
import { ref } from 'vue'

// Form Data
const focused = ref(null)
const isSubmitting = ref(false)
const formData = ref({
  name: '',
  email: '',
  subject: '',
  message: ''
})

// Contact Methods
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
  },
  {
    type: 'hours',
    title: 'Business Hours',
    value: 'Mon - Fri, 9:00 - 17:00',
    icon: 'fas fa-clock'
  }
]

// Social Links
const socialLinks = [
  { name: 'Twitter', url: '#', icon: 'fab fa-twitter' },
  { name: 'LinkedIn', url: '#', icon: 'fab fa-linkedin' },
  { name: 'Facebook', url: '#', icon: 'fab fa-facebook' },
  { name: 'Instagram', url: '#', icon: 'fab fa-instagram' }
]

// FAQs
const faqs = ref([
  {
    question: 'How quickly do you respond to inquiries?',
    answer: 'We aim to respond to all inquiries within 24 hours during business days. Premium support customers receive priority response within 4 hours.',
    isOpen: false
  },
  {
    question: 'Do you offer technical support?',
    answer: 'Yes, we provide comprehensive technical support through email, phone, and live chat. Our support team is available during business hours.',
    isOpen: false
  },
  {
    question: 'Can I schedule a demo?',
    answer: 'Absolutely! You can schedule a personalized demo with our team to explore Skycars features and discuss your specific needs.',
    isOpen: false
  }
])

// Methods
const submitForm = async () => {
  isSubmitting.value = true
  
  try {
    // Add your form submission logic here
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Reset form
    formData.value = {
      name: '',
      email: '',
      subject: '',
      message: ''
    }
    
    alert('Message sent successfully! We\'ll get back to you soon.')
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('Failed to send message. Please try again.')
  } finally {
    isSubmitting.value = false
  }
}

const toggleFaq = (faq) => {
  faqs.value.forEach(f => {
    if (f !== faq) f.isOpen = false
  })
  faq.isOpen = !faq.isOpen
}
</script>

<style scoped>
.contact-page {
  min-height: 100vh;
  background: var(--background-primary);
  color: var(--text-color);
}

/* Hero Section */
.contact-hero {
  position: relative;
  min-height: 40vh;
  padding: 6rem 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
  text-align: center;
  padding: 3rem;
  border-radius: 2rem;
}

.hero-title {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  color: var(--text-light);
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
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--primary-color), transparent);
  top: -50px;
  left: -50px;
  animation: float 20s ease-in-out infinite;
}

.sphere-2 {
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, var(--accent-color), transparent);
  bottom: -30px;
  right: -30px;
  animation: float 15s ease-in-out infinite reverse;
}

/* Contact Section */
.contact-section {
  padding: 4rem 2rem;
  background: var(--background-secondary);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
}

.contact-methods {
  padding: 3rem;
  border-radius: 1rem;
  height: fit-content;
}

.contact-method {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.contact-method:last-child {
  border-bottom: none;
}

.method-icon {
  width: 50px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  position: relative;
}

.method-icon i {
  font-size: 1.25rem;
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

.method-details h3 {
  font-size: 1.125rem;
  margin-bottom: 0.25rem;
}

.method-details p {
  color: var(--text-light);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.social-link {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--background-primary);
  color: var(--text-color);
  transition: all 0.3s ease;
}

.social-link:hover {
  transform: translateY(-3px);
  color: var(--primary-color);
  box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.1);
}

/* Contact Form */
.contact-form-wrapper {
  padding: 3rem;
  border-radius: 1rem;
}

.contact-form-wrapper h2 {
  font-size: 2rem;
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-light);
}

.input-wrapper {
  position: relative;
}

.input-wrapper i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-light);
}

.input-wrapper input,
.input-wrapper textarea {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: var(--background-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-color);
  transition: all 0.3s ease;
}

.input-wrapper textarea {
  resize: vertical;
  min-height: 120px;
}

.form-group.focused .input-wrapper input,
.form-group.focused .input-wrapper textarea {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.1);
}

.submit-button {
  margin-top: 2rem;
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(var(--primary-rgb), 0.2);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* FAQ Section */
.faq-section {
  padding: 8rem 2rem;
  background: var(--background-primary);
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
  .contact-container {
    grid-template-columns: 1fr;
  }

  .hero-title {
    font-size: 3rem;
  }
}

@media (max-width: 768px) {
  .contact-hero {
    padding: 4rem 1rem;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .section-title {
    font-size: 2.5rem;
  }
}

/* Utility Classes */
.glass {
  background: rgba(var(--background-primary-rgb), 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(var(--primary-rgb), 0.1);
}

.gradient-text {
  background: linear-gradient(135deg, var(--primary-color), var(--accent-color));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
</style>
