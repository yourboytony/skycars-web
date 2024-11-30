<template>
  <div :class="['placeholder-icon', size, type]">
    <i :class="iconClass"></i>
    <span v-if="showLabel" class="placeholder-label">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  type: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'md' // 'sm', 'md', 'lg'
  },
  showLabel: {
    type: Boolean,
    default: false
  }
})

const iconClass = computed(() => {
  // Map of placeholder types to Font Awesome icons
  const iconMap = {
    // Integration/Partner Icons
    simbrief: 'fas fa-file-alt',
    navigraph: 'fas fa-map',
    vatsim: 'fas fa-headset',
    ivao: 'fas fa-globe',
    foreflight: 'fas fa-tablet-alt',
    garmin: 'fas fa-satellite',
    flightaware: 'fas fa-plane-departure',

    // Weather Service Icons
    noaa: 'fas fa-cloud-sun-rain',
    weatherCenter: 'fas fa-wind',
    metar: 'fas fa-cloud',
    windy: 'fas fa-hurricane',

    // Aircraft Manufacturer Icons
    boeing: 'fas fa-plane',
    airbus: 'fas fa-plane',
    cessna: 'fas fa-plane',
    bombardier: 'fas fa-plane',
    embraer: 'fas fa-plane',

    // Application Icons
    appLogo: 'fas fa-paper-plane',
    loading: 'fas fa-spinner fa-spin',
    aircraft: 'fas fa-plane',
    airport: 'fas fa-airport',
    user: 'fas fa-user-circle',

    // Social Media Icons
    discord: 'fab fa-discord',
    github: 'fab fa-github',
    twitter: 'fab fa-twitter',
    youtube: 'fab fa-youtube',
    facebook: 'fab fa-facebook',
    linkedin: 'fab fa-linkedin',

    // Payment Icons
    stripe: 'fas fa-credit-card',
    paypal: 'fab fa-paypal',
    visa: 'fab fa-cc-visa',
    mastercard: 'fab fa-cc-mastercard',

    // Chart Provider Icons
    jeppesen: 'fas fa-map-marked-alt',
    faa: 'fas fa-landmark',
    nats: 'fas fa-route',
    eurocontrol: 'fas fa-globe-europe',

    // Default fallback
    default: 'fas fa-image'
  }

  return iconMap[props.type] || iconMap.default
})

const label = computed(() => {
  // Convert type to display label
  return props.type.charAt(0).toUpperCase() + props.type.slice(1)
})
</script>

<style scoped>
.placeholder-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f8fafc;
  border-radius: 8px;
  padding: 1rem;
  color: #64748b;
  transition: all 0.2s;
}

.placeholder-icon:hover {
  background-color: #f1f5f9;
}

/* Size variants */
.placeholder-icon.sm {
  width: 32px;
  height: 32px;
  font-size: 16px;
}

.placeholder-icon.md {
  width: 48px;
  height: 48px;
  font-size: 24px;
}

.placeholder-icon.lg {
  width: 64px;
  height: 64px;
  font-size: 32px;
}

.placeholder-label {
  margin-top: 0.5rem;
  font-size: 12px;
  text-align: center;
}

/* Specific type styling */
.simbrief { color: #0ea5e9; }
.navigraph { color: #3b82f6; }
.vatsim { color: #6366f1; }
.noaa { color: #0891b2; }
.discord { color: #5865F2; }
.github { color: #24292e; }
.paypal { color: #003087; }
/* Add more specific colors as needed */
</style> 