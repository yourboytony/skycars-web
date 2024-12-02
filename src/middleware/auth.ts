import { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const authMiddleware: NavigationGuard = (to) => {
  const auth = useAuthStore()
  
  if (!auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
} 