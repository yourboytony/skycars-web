export default {
  async fetch(request, env, ctx) {
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders })
    }

    try {
      const url = new URL(request.url)
      const path = url.pathname

      // Auth Routes
      if (path === '/api/auth/register') {
        try {
          const { email, password } = await request.json()

          // Check if user exists
          const existingUser = await env.DB.prepare(
            'SELECT id FROM users WHERE email = ?'
          ).bind(email).first()

          if (existingUser) {
            return new Response(
              JSON.stringify({ error: 'Email already registered' }), 
              { 
                status: 400, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
              }
            )
          }

          // Create new user
          const result = await env.DB.prepare(
            `INSERT INTO users (email, password_hash, created_at) 
             VALUES (?, ?, datetime('now'))`
          ).bind(email, password).run()

          return new Response(
            JSON.stringify({ 
              success: true, 
              userId: result.lastRowId 
            }),
            { 
              status: 200, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            }
          )
        } catch (error) {
          console.error('Registration error:', error)
          return new Response(
            JSON.stringify({ 
              error: 'Registration failed', 
              details: error.message 
            }),
            { 
              status: 500, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            }
          )
        }
      }

      if (path === '/api/auth/login') {
        try {
          const { email, password } = await request.json()

          // Find user
          const user = await env.DB.prepare(
            'SELECT * FROM users WHERE email = ? AND password_hash = ?'
          ).bind(email, password).first()

          if (!user) {
            return new Response(
              JSON.stringify({ error: 'Invalid credentials' }),
              { 
                status: 401, 
                headers: { 'Content-Type': 'application/json', ...corsHeaders }
              }
            )
          }

          // Create session
          const token = crypto.randomUUID()
          await env.DB.prepare(
            `INSERT INTO sessions (user_id, token, expires_at) 
             VALUES (?, ?, datetime('now', '+7 days'))`
          ).bind(user.id, token).run()

          return new Response(
            JSON.stringify({ 
              token,
              user: {
                id: user.id,
                email: user.email
              }
            }),
            { 
              status: 200, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            }
          )
        } catch (error) {
          console.error('Login error:', error)
          return new Response(
            JSON.stringify({ 
              error: 'Login failed', 
              details: error.message 
            }),
            { 
              status: 500, 
              headers: { 'Content-Type': 'application/json', ...corsHeaders }
            }
          )
        }
      }

      // Default 404
      return new Response(
        JSON.stringify({ error: 'Not found' }),
        { 
          status: 404, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )

    } catch (error) {
      console.error('Worker Error:', error)
      return new Response(
        JSON.stringify({ 
          error: 'Internal Server Error',
          details: error.message
        }),
        { 
          status: 500, 
          headers: { 'Content-Type': 'application/json', ...corsHeaders }
        }
      )
    }
  }
}
