import { Router } from 'itty-router'
import { handleLogin, handleRegister } from './functions/auth'
import { Env } from './types'
import { cors } from './middleware/cors'
import { validateAuth } from './middleware/auth'

const router = Router()

// CORS middleware
router.all('*', cors)

// Auth routes
router.post('/api/auth/login', async (request: Request, env: Env) => {
  const { email, password } = await request.json()
  return handleLogin(email, password, env)
})

router.post('/api/auth/register', async (request: Request, env: Env) => {
  const { name, email, password } = await request.json()
  return handleRegister(name, email, password, env)
})

// Protected routes example
router.get('/api/user/profile', validateAuth, async (request: Request, env: Env) => {
  // Handle protected route
})

// 404 handler
router.all('*', () => new Response('Not Found', { status: 404 }))

export default {
  fetch: router.handle
} 