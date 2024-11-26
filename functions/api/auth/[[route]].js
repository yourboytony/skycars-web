import { D1Database } from '@cloudflare/workers-types'

export async function onRequest(context) {
  const { request, env } = context
  const JWT_SECRET = env.JWT_SECRET // Get secret from environment
  
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth/', '')

  switch (path) {
    case 'login':
      return handleLogin(request, env.DB, JWT_SECRET)
    case 'register':
      return handleRegister(request, env.DB, JWT_SECRET)
    default:
      return new Response('Not found', { status: 404 })
  }
}

async function handleLogin(request, db, JWT_SECRET) {
  const { email, password } = await request.json()
  
  try {
    const hashedPassword = await hashPassword(password)
    
    const stmt = db.prepare(
      'SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?'
    )
    const user = await stmt.bind(email, hashedPassword).first()

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const token = await generateToken(user, JWT_SECRET)

    return new Response(
      JSON.stringify({ token, user }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

async function handleRegister(request, db, JWT_SECRET) {
  const { email, password, username } = await request.json()
  
  try {
    // Check if user exists
    const stmt = db.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    )
    const existingUser = await stmt.bind(email, username).first()

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    }

    const hashedPassword = await hashPassword(password)
    
    // Insert new user
    const result = await db.prepare(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)'
    ).bind(email, username, hashedPassword).run()

    const user = {
      id: result.lastRowId,
      email,
      username
    }

    const token = await generateToken(user, JWT_SECRET)

    return new Response(
      JSON.stringify({ token, user }), 
      { 
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error' }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Use Web Crypto API for password hashing
async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(hash)
}

// Helper function to convert buffer to hex string
function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

// Simple token generation (in production, use a proper JWT implementation)
async function generateToken(user, JWT_SECRET) {
  const header = { alg: 'HS256', typ: 'JWT' }
  const payload = {
    userId: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60) // 7 days
  }

  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  
  const signature = await generateSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

async function generateSignature(input, JWT_SECRET) {
  const encoder = new TextEncoder()
  const data = encoder.encode(input + JWT_SECRET)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(hash)
} 