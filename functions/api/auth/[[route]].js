export async function onRequest(context) {
  const { request, env } = context
  
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    })
  }

  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth/', '')

  try {
    switch (path) {
      case 'login':
        return handleLogin(request, env.DB, env.JWT_SECRET)
      case 'register':
        return handleRegister(request, env.DB, env.JWT_SECRET)
      default:
        return new Response(
          JSON.stringify({ message: 'Not found' }), 
          { 
            status: 404,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            }
          }
        )
    }
  } catch (error) {
    console.error('Auth error:', error)
    return new Response(
      JSON.stringify({ 
        message: 'Server error',
        details: error.message 
      }), 
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}

async function handleLogin(request, db, JWT_SECRET) {
  const { email, password } = await request.json()
  
  try {
    const hashedPassword = await hashPassword(password)
    
    const { results } = await db
      .prepare('SELECT id, username, email FROM users WHERE email = ? AND password_hash = ?')
      .bind(email, hashedPassword)
      .all()

    const user = results?.[0]

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
  try {
    const { email, password, username } = await request.json()
    
    // Validate input
    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ 
          message: 'Email, password, and username are required' 
        }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Check if user exists
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .bind(email, username)
      .first()

    if (existingUser) {
      return new Response(
        JSON.stringify({ 
          message: 'Email or username already exists' 
        }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    const hashedPassword = await hashPassword(password)
    
    // Insert new user
    const result = await db
      .prepare('INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)')
      .bind(email, username, hashedPassword)
      .run()

    if (!result.success) {
      throw new Error('Failed to create user')
    }

    const user = {
      id: result.lastRowId,
      email,
      username
    }

    const token = await generateToken(user, JWT_SECRET)

    return new Response(
      JSON.stringify({ 
        token, 
        user,
        message: 'Account created successfully' 
      }), 
      { 
        status: 201,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    console.error('Registration error:', error)
    
    return new Response(
      JSON.stringify({ 
        message: 'Server error during registration',
        details: error.message 
      }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
}

async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return bufferToHex(hash)
}

function bufferToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
}

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