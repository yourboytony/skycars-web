import { createRouter, createWebHistory } from 'vue-router'

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
      component: () => import('../views/Radar.vue')
    },
    {
      path: '/planning',
      name: 'planning',
      component: () => import('../views/Planning.vue')
    },
    {
      path: '/weather',
      name: 'weather',
      component: () => import('../views/Weather.vue')
    },
    {
      path: '/forum',
      name: 'forum',
      component: () => import('../views/Forum.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/About.vue')
    }
  ]
})

export default router 