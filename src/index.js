import { Router } from 'itty-router'
import { sign, verify } from '@tsndr/cloudflare-worker-jwt'
import bcrypt from 'bcryptjs'

// Create router
const router = Router()

// CORS Middleware
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle CORS preflight
router.options('*', () => new Response(null, { headers: corsHeaders }))

// Auth Routes
router.post('/api/auth/login', async (request, env) => {
  try {
    const { email, password } = await request.json()

    // Get user from D1
    const user = await env.DB.prepare(
      'SELECT * FROM users WHERE email = ?'
    ).bind(email).first()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }), 
        { status: 401, headers: corsHeaders }
      )
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return new Response(
        JSON.stringify({ error: 'Invalid credentials' }), 
        { status: 401, headers: corsHeaders }
      )
    }

    // Generate JWT
    const token = await sign({
      sub: user.id.toString(),
      name: user.name,
      email: user.email
    }, env.JWT_SECRET)

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        }
      }), 
      { 
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: corsHeaders }
    )
  }
})

router.post('/api/auth/register', async (request, env) => {
  try {
    const { name, email, password } = await request.json()

    // Check if user exists
    const existingUser = await env.DB.prepare(
      'SELECT id FROM users WHERE email = ?'
    ).bind(email).first()

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: 'Email already in use' }), 
        { status: 409, headers: corsHeaders }
      )
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Create user
    const result = await env.DB.prepare(
      `INSERT INTO users (name, email, password_hash) 
       VALUES (?, ?, ?) RETURNING id`
    ).bind(name, email, password_hash).first()

    // Generate JWT
    const token = await sign({
      sub: result.id.toString(),
      name,
      email
    }, env.JWT_SECRET)

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: result.id,
          name,
          email
        }
      }), 
      { 
        status: 201,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      { status: 500, headers: corsHeaders }
    )
  }
})

// Catch-all 404
router.all('*', () => new Response('Not Found', { status: 404 }))

// Export handler
export default {
  fetch: router.handle
} 