import { D1Database } from '@cloudflare/workers-types'
import { createHash } from 'crypto'
import { sign } from 'jsonwebtoken'

const JWT_SECRET = 'your-secret-key' // Replace with environment variable

export async function onRequest(context) {
  const { request, env } = context
  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth/', '')

  switch (path) {
    case 'login':
      return handleLogin(request, env.DB)
    case 'register':
      return handleRegister(request, env.DB)
    default:
      return new Response('Not found', { status: 404 })
  }
}

async function handleLogin(request, db) {
  const { email, password } = await request.json()
  
  try {
    const hashedPassword = hashPassword(password)
    
    const user = await db.prepare(
      'SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?'
    )
    .bind(email, hashedPassword)
    .first()

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }), 
        { status: 401 }
      )
    }

    const token = generateToken(user)

    return new Response(
      JSON.stringify({ token, user }), 
      { status: 200 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error' }), 
      { status: 500 }
    )
  }
}

async function handleRegister(request, db) {
  const { email, password, username } = await request.json()
  
  try {
    // Check if user exists
    const existingUser = await db.prepare(
      'SELECT id FROM users WHERE email = ? OR username = ?'
    )
    .bind(email, username)
    .first()

    if (existingUser) {
      return new Response(
        JSON.stringify({ message: 'User already exists' }), 
        { status: 400 }
      )
    }

    const hashedPassword = hashPassword(password)
    
    // Insert new user
    const result = await db.prepare(
      'INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)'
    )
    .bind(email, username, hashedPassword)
    .run()

    const user = {
      id: result.lastRowId,
      email,
      username
    }

    const token = generateToken(user)

    return new Response(
      JSON.stringify({ token, user }), 
      { status: 201 }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ message: 'Server error' }), 
      { status: 500 }
    )
  }
}

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex')
}

function generateToken(user) {
  return sign(
    { userId: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
} 