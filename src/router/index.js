import { createRouter, createWebHistory } from 'vue-router'

// Lazy load components for better performance
const Home = () => import('../views/Home.vue')
const Contact = () => import('../views/Contact.vue')
const Features = () => import('../views/Features.vue')
const Pricing = () => import('../views/Pricing.vue')
const Support = () => import('../views/Support.vue')
const Login = () => import('../views/Login.vue')
const Register = () => import('../views/Register.vue')
const Dashboard = () => import('../views/Dashboard.vue')
const NotFound = () => import('../views/NotFound.vue')

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      title: 'Home - Skycars',
      requiresAuth: false
    }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: Contact,
    meta: {
      title: 'Contact Us - Skycars',
      requiresAuth: false
    }
  },
  {
    path: '/features',
    name: 'Features',
    component: Features,
    meta: {
      title: 'Features - Skycars',
      requiresAuth: false
    }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: Pricing,
    meta: {
      title: 'Pricing - Skycars',
      requiresAuth: false
    }
  },
  {
    path: '/support',
    name: 'Support',
    component: Support,
    meta: {
      title: 'Support - Skycars',
      requiresAuth: false
    }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: {
      title: 'Login - Skycars',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      title: 'Register - Skycars',
      requiresAuth: false,
      hideForAuth: true
    }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: {
      title: 'Dashboard - Skycars',
      requiresAuth: true
    }
  },
  // Nested routes example for dashboard
  {
    path: '/dashboard/:section',
    name: 'DashboardSection',
    component: Dashboard,
    meta: {
      title: 'Dashboard - Skycars',
      requiresAuth: true
    }
  },
  // Handle 404
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound,
    meta: {
      title: '404 Not Found - Skycars'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Smooth scrolling behavior
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: 'smooth',
        top: 80 // Offset for fixed header
      }
    }
    if (savedPosition) {
      return savedPosition
    }
    return { top: 0, behavior: 'smooth' }
  }
})

// Navigation Guards
router.beforeEach((to, from, next) => {
  // Update document title
  document.title = to.meta.title || 'Skycars'

  // Check if route requires auth
  const isAuthenticated = localStorage.getItem('user-token') // Replace with your auth check
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // Redirect to login if auth is required but user is not authenticated
    next({
      name: 'Login',
      query: { redirect: to.fullPath }
    })
  } else if (to.meta.hideForAuth && isAuthenticated) {
    // Redirect to dashboard if user is already authenticated
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

// Handle route errors
router.onError((error) => {
  console.error('Router error:', error)
  // You can add error reporting service here
})

export default router