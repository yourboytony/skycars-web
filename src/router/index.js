import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('../views/Home.vue')
    },
    {
      path: '/radar',
      name: 'radar',
      component: () => import('../views/Radar.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/planning',
      name: 'planning',
      component: () => import('../views/Planning.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/weather',
      name: 'weather',
      component: () => import('../views/Weather.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/Forum.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    }
  ]
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()
  
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router 