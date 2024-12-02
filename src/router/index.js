import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Core Views
import Dashboard from '@/views/Dashboard.vue'
import Login from '@/views/Login.vue'
import NotFound from '@/views/NotFound.vue'

// Flight Planning Views
import FlightPlanning from '@/views/flight/FlightPlanning.vue'
import FlightHistory from '@/views/flight/FlightHistory.vue'

// Weather Views
import Weather from '@/views/weather/Weather.vue'
import WeatherMap from '@/views/weather/WeatherMap.vue'

// Settings & Profile
import Profile from '@/views/Profile.vue'
import Settings from '@/views/settings/Settings.vue'

// Charts & Data
import Charts from '@/views/charts/Charts.vue'
import Analytics from '@/views/charts/Analytics.vue'

// Error View
import Error from '@/views/Error.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'login',
    component: Login,
    meta: { 
      requiresGuest: true,
      layout: 'GuestLayout'
    }
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      layout: 'DefaultLayout'
    }
  },
  // Flight Planning Routes
  {
    path: '/flight',
    meta: { 
      requiresAuth: true,
      layout: 'DefaultLayout'
    },
    children: [
      {
        path: 'planning',
        name: 'flight-planning',
        component: FlightPlanning
      },
      {
        path: 'history',
        name: 'flight-history',
        component: FlightHistory
      }
    ]
  },
  // Weather Routes
  {
    path: '/weather',
    meta: { 
      requiresAuth: true,
      layout: 'DefaultLayout'
    },
    children: [
      {
        path: '',
        name: 'weather',
        component: Weather
      },
      {
        path: 'map',
        name: 'weather-map',
        component: WeatherMap
      }
    ]
  },
  // Charts & Analytics Routes
  {
    path: '/charts',
    meta: { 
      requiresAuth: true,
      layout: 'DefaultLayout'
    },
    children: [
      {
        path: '',
        name: 'charts',
        component: Charts
      },
      {
        path: 'analytics',
        name: 'analytics',
        component: Analytics
      }
    ]
  },
  // Settings Routes
  {
    path: '/settings',
    meta: { 
      requiresAuth: true,
      layout: 'DefaultLayout'
    },
    children: [
      {
        path: '',
        name: 'settings',
        component: Settings
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile
      }
    ]
  },
  // Error Route
  {
    path: '/error',
    name: 'error',
    component: Error,
    props: true,
    meta: { 
      layout: 'GuestLayout'
    }
  },
  // 404 Route
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
    meta: { 
      layout: 'DefaultLayout'
    }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated

  // Handle guest-only routes (like login)
  if (to.meta.requiresGuest && isAuthenticated) {
    next('/dashboard')
    return
  }

  // Handle protected routes
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
    return
  }

  // Allow navigation
  next()
})

// Handle navigation errors
router.onError((error) => {
  console.error('Navigation Error:', error)
  router.push('/dashboard')
})

export default router
