import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

// Page Components
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Listings from '../views/Listings.vue'
import ListingDetail from '../views/ListingDetail.vue'
import NewListing from '../views/NewListing.vue'
import Profile from '../views/Profile.vue'
import Messages from '../views/Messages.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: { guestOnly: true }
  },
  {
    path: '/listings',
    name: 'Listings',
    component: Listings
  },
  {
    path: '/listings/:id',
    name: 'ListingDetail',
    component: ListingDetail
  },
  {
    path: '/listings/new',
    name: 'NewListing',
    component: NewListing,
    meta: { requiresAuth: true }
  },
  {
    path: '/listings/:id/edit',
    name: 'EditListing',
    component: NewListing,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/favorites',
    name: 'Favorites',
    component: Profile,
    props: { defaultTab: 'favorites' },
    meta: { requiresAuth: true }
  },
  {
    path: '/profile/transactions',
    name: 'Transactions',
    component: Profile,
    props: { defaultTab: 'transactions' },
    meta: { requiresAuth: true }
  },
  {
    path: '/messages',
    name: 'Messages',
    component: Messages,
    meta: { requiresAuth: true }
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
router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isAuthenticated()) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    })
    return
  }

  // Check if route is for guests only (login, register)
  if (to.meta.guestOnly && auth.isAuthenticated()) {
    next('/')
    return
  }

  next()
})

export default router