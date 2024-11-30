import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

// Main Views
import Dashboard from '@/views/Dashboard.vue'
import Profile from '@/views/Profile.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import ForgotPassword from '@/views/ForgotPassword.vue'
import ResetPassword from '@/views/ResetPassword.vue'

// Flight Planning
import FlightPlanning from '@/views/flight/FlightPlanning.vue'
import FlightHistory from '@/views/flight/FlightHistory.vue'
import FlightDetails from '@/views/flight/FlightDetails.vue'

// Weather
import Weather from '@/views/weather/Weather.vue'
import WeatherBriefing from '@/views/weather/WeatherBriefing.vue'

// Charts & Maps
import Charts from '@/views/charts/Charts.vue'
import ChartViewer from '@/views/charts/ChartViewer.vue'

// Aircraft
import Aircraft from '@/views/aircraft/Aircraft.vue'
import AircraftDetails from '@/views/aircraft/AircraftDetails.vue'

// Settings & Admin
import Settings from '@/views/settings/Settings.vue'
import AdminDashboard from '@/views/admin/AdminDashboard.vue'

const routes = [
  // Public Routes
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { 
      requiresAuth: false,
      title: 'Login'
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { 
      requiresAuth: false,
      title: 'Register'
    }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: ForgotPassword,
    meta: { 
      requiresAuth: false,
      title: 'Forgot Password'
    }
  },
  {
    path: '/reset-password/:token',
    name: 'ResetPassword',
    component: ResetPassword,
    meta: { 
      requiresAuth: false,
      title: 'Reset Password'
    }
  },

  // Protected Routes
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { 
      requiresAuth: true,
      title: 'Dashboard'
    }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { 
      requiresAuth: true,
      title: 'Profile'
    }
  },

  // Flight Planning Routes
  {
    path: '/flight-planning',
    name: 'FlightPlanning',
    component: FlightPlanning,
    meta: { 
      requiresAuth: true,
      title: 'Flight Planning'
    }
  },
  {
    path: '/flight-history',
    name: 'FlightHistory',
    component: FlightHistory,
    meta: { 
      requiresAuth: true,
      title: 'Flight History'
    }
  },
  {
    path: '/flight/:id',
    name: 'FlightDetails',
    component: FlightDetails,
    meta: { 
      requiresAuth: true,
      title: 'Flight Details'
    }
  },

  // Weather Routes
  {
    path: '/weather',
    name: 'Weather',
    component: Weather,
    meta: { 
      requiresAuth: true,
      title: 'Weather'
    }
  },
  {
    path: '/weather-briefing/:route',
    name: 'WeatherBriefing',
    component: WeatherBriefing,
    meta: { 
      requiresAuth: true,
      title: 'Weather Briefing'
    }
  },

  // Charts Routes
  {
    path: '/charts',
    name: 'Charts',
    component: Charts,
    meta: { 
      requiresAuth: true,
      title: 'Charts'
    }
  },
  {
    path: '/chart/:id',
    name: 'ChartViewer',
    component: ChartViewer,
    meta: { 
      requiresAuth: true,
      title: 'Chart Viewer'
    }
  },

  // Aircraft Routes
  {
    path: '/aircraft',
    name: 'Aircraft',
    component: Aircraft,
    meta: { 
      requiresAuth: true,
      title: 'Aircraft'
    }
  },
  {
    path: '/aircraft/:id',
    name: 'AircraftDetails',
    component: AircraftDetails,
    meta: { 
      requiresAuth: true,
      title: 'Aircraft Details'
    }
  },

  // Settings & Admin Routes
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { 
      requiresAuth: true,
      title: 'Settings'
    }
  },
  {
    path: '/admin',
    name: 'AdminDashboard',
    component: AdminDashboard,
    meta: { 
      requiresAuth: true,
      requiresAdmin: true,
      title: 'Admin Dashboard'
    }
  },

  // Error Routes
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/errors/NotFound.vue'),
    meta: { 
      title: '404 Not Found'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
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
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin)

  // Update page title
  document.title = `${to.meta.title} - SkyCast` || 'SkyCast'

  // Check if route requires authentication
  if (requiresAuth && !userStore.isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }

  // Check if route requires admin privileges
  if (requiresAdmin && !userStore.user?.isAdmin) {
    next({ name: 'Dashboard' })
    return
  }

  // Handle redirect after login
  if (to.name === 'Login' && userStore.isAuthenticated) {
    next({ name: 'Dashboard' })
    return
  }

  next()
})

// Error Handling
router.onError((error) => {
  console.error('Router error:', error)
  router.push({ name: 'NotFound' })
})

export default router