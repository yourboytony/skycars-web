import { NavigationGuard } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

export const guestMiddleware: NavigationGuard = () => {
  const auth = useAuthStore()
  
  if (auth.isAuthenticated) {
    return { name: 'dashboard' }
  }
} 