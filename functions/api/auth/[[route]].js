export async function onRequest(context) {
  const { request, env } = context
  
  // Handle CORS preflight
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

  // Basic request validation
  if (!env.DB) {
    return new Response(
      JSON.stringify({ message: 'Database configuration error' }), 
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  try {
    switch (path) {
      case 'register':
        return handleRegister(request, env.DB)
      case 'login':
        return handleLogin(request, env.DB)
      default:
        return new Response(
          JSON.stringify({ message: 'Endpoint not found' }), 
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
    return new Response(
      JSON.stringify({ 
        message: 'Server error',
        error: error.message 
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

async function handleRegister(request, db) {
  try {
    const { email, password, username } = await request.json()

    // Input validation
    if (!email || !password || !username) {
      return new Response(
        JSON.stringify({ 
          message: 'Missing required fields',
          fields: { email: !!email, password: !!password, username: !!username }
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

    // Check for existing user
    const checkUser = await db
      .prepare('SELECT id FROM users WHERE email = ? OR username = ?')
      .bind(email, username)
      .all()

    if (checkUser.results.length > 0) {
      return new Response(
        JSON.stringify({ message: 'Email or username already exists' }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Hash password
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Insert new user
    const stmt = db
      .prepare('INSERT INTO users (email, username, password_hash) VALUES (?, ?, ?)')
      .bind(email, username, hashedPassword)

    const result = await stmt.run()

    if (!result.success) {
      throw new Error('Failed to create user')
    }

    // Generate simple token
    const token = btoa(JSON.stringify({
      userId: result.lastRowId,
      email,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }))

    return new Response(
      JSON.stringify({
        token,
        user: {
          id: result.lastRowId,
          email,
          username
        }
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
    return new Response(
      JSON.stringify({ 
        message: 'Registration failed',
        error: error.message 
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

async function handleLogin(request, db) {
  try {
    const { email, password } = await request.json()

    // Input validation
    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: 'Email and password are required' }), 
        { 
          status: 400,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Hash password for comparison
    const encoder = new TextEncoder()
    const data = encoder.encode(password)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashedPassword = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')

    // Find user
    const user = await db
      .prepare('SELECT id, email, username FROM users WHERE email = ? AND password_hash = ?')
      .bind(email, hashedPassword)
      .first()

    if (!user) {
      return new Response(
        JSON.stringify({ message: 'Invalid credentials' }), 
        { 
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        }
      )
    }

    // Generate token
    const token = btoa(JSON.stringify({
      userId: user.id,
      email: user.email,
      exp: Date.now() + (7 * 24 * 60 * 60 * 1000) // 7 days
    }))

    return new Response(
      JSON.stringify({ token, user }), 
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ 
        message: 'Login failed',
        error: error.message 
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