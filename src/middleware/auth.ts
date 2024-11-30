import { verify } from '@tsndr/cloudflare-worker-jwt'
import { Env } from '../types'

export const validateAuth = async (request: Request, env: Env) => {
  const authHeader = request.headers.get('Authorization')
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new Response('Unauthorized', { status: 401 })
  }

  const token = authHeader.split(' ')[1]

  try {
    const isValid = await verify(token, env.JWT_SECRET)
    if (!isValid) {
      throw new Error('Invalid token')
    }
  } catch (error) {
    return new Response('Unauthorized', { status: 401 })
  }
} 