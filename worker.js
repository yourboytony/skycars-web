export default {
  async fetch(request, env, ctx) {
    return await handleRequest(request, env)
  }
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Max-Age': '86400',
}

function corsResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  })
}

function handleOptions() {
  return new Response(null, { headers: corsHeaders })
}

async function validateToken(request, env) {
  const authHeader = request.headers.get('Authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  const token = authHeader.split(' ')[1]
  const [id, email] = atob(token).split(':')

  const currentUser = await env.DB.prepare(
    'SELECT * FROM users WHERE id = ? AND email = ?'
  ).bind(id, email).first()

  return currentUser
}

async function handleRequest(request, env) {
  if (request.method === 'OPTIONS') {
    return handleOptions()
  }

  try {
    const url = new URL(request.url)
    const path = url.pathname

    // Public endpoints
    if (path === '/') {
      return corsResponse({
        name: 'Flight Sim License Marketplace API',
        version: '1.0.0',
        status: 'active'
      })
    }

    // Auth endpoints
    if (path === '/api/auth/register' && request.method === 'POST') {
      const { name, email, password } = await request.json()
      
      if (!name || !email || !password) {
        return corsResponse({ error: 'All fields are required' }, 400)
      }

      const existingUser = await env.DB.prepare(
        'SELECT id FROM users WHERE email = ?'
      ).bind(email).first()

      if (existingUser) {
        return corsResponse({ error: 'Email already registered' }, 409)
      }

      const result = await env.DB.prepare(`
        INSERT INTO users (name, email, password, credits) 
        VALUES (?, ?, ?, 1000)
        RETURNING id, name, email, credits
      `).bind(name, email, password).first()

      const token = btoa(`${result.id}:${email}`)

      return corsResponse({
        token,
        user: {
          id: result.id,
          name: result.name,
          email: result.email,
          credits: result.credits
        }
      }, 201)
    }

    if (path === '/api/auth/login' && request.method === 'POST') {
      const { email, password } = await request.json()

      if (!email || !password) {
        return corsResponse({ error: 'Email and password are required' }, 400)
      }

      const user = await env.DB.prepare(
        'SELECT * FROM users WHERE email = ? AND password = ?'
      ).bind(email, password).first()

      if (!user) {
        return corsResponse({ error: 'Invalid credentials' }, 401)
      }

      const token = btoa(`${user.id}:${email}`)

      return corsResponse({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          credits: user.credits
        }
      })
    }

    // Protected endpoints
    const user = await validateToken(request, env)
    if (!user) {
      return corsResponse({ error: 'Unauthorized' }, 401)
    }

    // Listings endpoints
    if (path === '/api/listings' && request.method === 'GET') {
      const simulator = url.searchParams.get('simulator')
      const aircraft_type = url.searchParams.get('aircraft_type')
      const developer = url.searchParams.get('developer')
      
      let query = `
        SELECT l.*, u.name as seller_name 
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE status = 'active'
      `
      const params = []

      if (simulator) {
        query += ' AND simulator = ?'
        params.push(simulator)
      }
      if (aircraft_type) {
        query += ' AND aircraft_type = ?'
        params.push(aircraft_type)
      }
      if (developer) {
        query += ' AND developer = ?'
        params.push(developer)
      }

      query += ' ORDER BY created_at DESC'

      const listings = await env.DB.prepare(query).bind(...params).all()
      return corsResponse({ listings: listings.results })
    }

    if (path === '/api/listings' && request.method === 'POST') {
      const { title, description, simulator, developer, aircraft_type, price_credits } = await request.json()
      
      if (!title || !simulator || !developer || !aircraft_type || !price_credits) {
        return corsResponse({ error: 'Missing required fields' }, 400)
      }

      const result = await env.DB.prepare(`
        INSERT INTO listings (
          user_id, title, description, simulator, 
          developer, aircraft_type, price_credits, status
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'active')
        RETURNING *
      `).bind(
        user.id,
        title,
        description,
        simulator,
        developer,
        aircraft_type,
        price_credits
      ).first()

      return corsResponse({ listing: result }, 201)
    }

    // Individual listing endpoints
    const listingMatch = path.match(/^\/api\/listings\/(\d+)$/)
    if (listingMatch) {
      const listingId = listingMatch[1]

      if (request.method === 'GET') {
        const listing = await env.DB.prepare(`
          SELECT l.*, u.name as seller_name 
          FROM listings l
          JOIN users u ON l.user_id = u.id
          WHERE l.id = ?
        `).bind(listingId).first()

        if (!listing) {
          return corsResponse({ error: 'Listing not found' }, 404)
        }

        // Increment views
        await env.DB.prepare(
          'UPDATE listings SET views = views + 1 WHERE id = ?'
        ).bind(listingId).run()

        return corsResponse({ listing })
      }

      if (request.method === 'PUT') {
        const listing = await env.DB.prepare(
          'SELECT * FROM listings WHERE id = ? AND user_id = ?'
        ).bind(listingId, user.id).first()

        if (!listing) {
          return corsResponse({ error: 'Listing not found' }, 404)
        }

        const updates = await request.json()
        const result = await env.DB.prepare(`
          UPDATE listings 
          SET title = ?, description = ?, simulator = ?,
              developer = ?, aircraft_type = ?, price_credits = ?
          WHERE id = ? AND user_id = ?
          RETURNING *
        `).bind(
          updates.title || listing.title,
          updates.description || listing.description,
          updates.simulator || listing.simulator,
          updates.developer || listing.developer,
          updates.aircraft_type || listing.aircraft_type,
          updates.price_credits || listing.price_credits,
          listingId,
          user.id
        ).first()

        return corsResponse({ listing: result })
      }
    }

    // Credits endpoints
    if (path === '/api/credits/balance' && request.method === 'GET') {
      return corsResponse({ credits: user.credits })
    }

    if (path === '/api/credits/purchase' && request.method === 'POST') {
      const { amount } = await request.json()
      
      if (!amount || amount < 0) {
        return corsResponse({ error: 'Invalid amount' }, 400)
      }

      const result = await env.DB.prepare(`
        UPDATE users 
        SET credits = credits + ? 
        WHERE id = ?
        RETURNING credits
      `).bind(amount, user.id).first()

      return corsResponse({ credits: result.credits })
    }

    // Messages endpoints
    if (path === '/api/messages' && request.method === 'GET') {
      const messages = await env.DB.prepare(`
        SELECT m.*, 
               s.name as sender_name,
               r.name as receiver_name,
               l.title as listing_title
        FROM messages m
        JOIN users s ON m.sender_id = s.id
        JOIN users r ON m.receiver_id = r.id
        JOIN listings l ON m.listing_id = l.id
        WHERE m.sender_id = ? OR m.receiver_id = ?
        ORDER BY m.created_at DESC
      `).bind(user.id, user.id).all()

      return corsResponse({ messages: messages.results })
    }

    if (path === '/api/messages' && request.method === 'POST') {
      const { receiver_id, listing_id, content } = await request.json()
      
      if (!receiver_id || !listing_id || !content) {
        return corsResponse({ error: 'Missing required fields' }, 400)
      }

      const result = await env.DB.prepare(`
        INSERT INTO messages (sender_id, receiver_id, listing_id, content)
        VALUES (?, ?, ?, ?)
        RETURNING *
      `).bind(user.id, receiver_id, listing_id, content).first()

      return corsResponse({ message: result }, 201)
    }

    // Mark message as read
    const messageMatch = path.match(/^\/api\/messages\/(\d+)\/read$/)
    if (messageMatch && request.method === 'POST') {
      const messageId = messageMatch[1]
      
      const result = await env.DB.prepare(`
        UPDATE messages 
        SET read = 1 
        WHERE id = ? AND receiver_id = ?
        RETURNING *
      `).bind(messageId, user.id).first()

      if (!result) {
        return corsResponse({ error: 'Message not found' }, 404)
      }

      return corsResponse({ message: result })
    }

    // Favorites endpoints
    if (path === '/api/favorites' && request.method === 'GET') {
      const favorites = await env.DB.prepare(`
        SELECT l.*, u.name as seller_name
        FROM favorites f
        JOIN listings l ON f.listing_id = l.id
        JOIN users u ON l.user_id = u.id
        WHERE f.user_id = ?
        ORDER BY f.created_at DESC
      `).bind(user.id).all()

      return corsResponse({ favorites: favorites.results })
    }

    // Add/remove favorite
    const favoriteMatch = path.match(/^\/api\/listings\/(\d+)\/favorite$/)
    if (favoriteMatch) {
      const listingId = favoriteMatch[1]

      if (request.method === 'POST') {
        try {
          await env.DB.prepare(`
            INSERT INTO favorites (user_id, listing_id)
            VALUES (?, ?)
          `).bind(user.id, listingId).run()

          await env.DB.prepare(`
            UPDATE listings 
            SET favorites = favorites + 1
            WHERE id = ?
          `).bind(listingId).run()

          return corsResponse({ success: true })
        } catch (error) {
          if (error.message.includes('UNIQUE constraint failed')) {
            return corsResponse({ error: 'Already favorited' }, 409)
          }
          throw error
        }
      }

      if (request.method === 'DELETE') {
        const result = await env.DB.prepare(`
          DELETE FROM favorites 
          WHERE user_id = ? AND listing_id = ?
        `).bind(user.id, listingId).run()

        if (result.changes) {
          await env.DB.prepare(`
            UPDATE listings 
            SET favorites = favorites - 1
            WHERE id = ?
          `).bind(listingId).run()
        }

        return corsResponse({ success: true })
      }
    }

    // Purchase endpoint
    if (path.match(/^\/api\/listings\/(\d+)\/purchase$/) && request.method === 'POST') {
      const listingId = path.match(/^\/api\/listings\/(\d+)\/purchase$/)[1]
      
      const listing = await env.DB.prepare(`
        SELECT l.*, u.id as seller_id
        FROM listings l
        JOIN users u ON l.user_id = u.id
        WHERE l.id = ? AND l.status = 'active'
      `).bind(listingId).first()

      if (!listing) {
        return corsResponse({ error: 'Listing not found or not available' }, 404)
      }

      if (listing.seller_id === user.id) {
        return corsResponse({ error: 'Cannot purchase your own listing' }, 400)
      }

      if (user.credits < listing.price_credits) {
        return corsResponse({ error: 'Insufficient credits' }, 400)
      }

      // Begin transaction
      await env.DB.prepare('BEGIN').run()

      try {
        // Remove credits from buyer
        await env.DB.prepare(`
          UPDATE users 
          SET credits = credits - ? 
          WHERE id = ?
        `).bind(listing.price_credits, user.id).run()

        // Add credits to seller
        await env.DB.prepare(`
          UPDATE users 
          SET credits = credits + ? 
          WHERE id = ?
        `).bind(listing.price_credits, listing.seller_id).run()

        // Mark listing as sold
        await env.DB.prepare(`
          UPDATE listings 
          SET status = 'sold' 
          WHERE id = ?
        `).bind(listingId).run()

        await env.DB.prepare('COMMIT').run()

        return corsResponse({ 
          success: true,
          message: 'Purchase successful'
        })
      } catch (error) {
        await env.DB.prepare('ROLLBACK').run()
        throw error
      }
    }

    return corsResponse({ error: 'Not found' }, 404)

  } catch (error) {
    console.error('Request error:', error)
    return corsResponse({ 
      error: 'Internal server error',
      details: error.message 
    }, 500)
  }
} 