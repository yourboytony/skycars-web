export async function onRequest(context) {
  const { request } = context
  
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  }

  // Simple in-memory storage (just for demo)
  const users = [
    { id: 1, email: 'test@test.com', password: 'test123', username: 'testuser' }
  ]

  const url = new URL(request.url)
  const path = url.pathname.replace('/api/auth/', '')

  if (path === 'register') {
    const { email, password, username } = await request.json()
    
    const newUser = {
      id: users.length + 1,
      email,
      password,
      username
    }
    
    users.push(newUser)
    
    return new Response(
      JSON.stringify({
        token: 'demo-token',
        user: { id: newUser.id, email, username }
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  if (path === 'login') {
    const { email, password } = await request.json()
    
    return new Response(
      JSON.stringify({
        token: 'demo-token',
        user: { id: 1, email, username: 'user' }
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }

  return new Response('Not found', { status: 404 })
} 