import { DrizzleD1Database } from 'drizzle-orm/d1'
import { eq } from 'drizzle-orm'
import { users } from '../schema'
import { Env } from '../types'
import * as bcrypt from 'bcryptjs'
import { sign } from '@tsndr/cloudflare-worker-jwt'

export async function handleLogin(
  email: string,
  password: string,
  env: Env
): Promise<Response> {
  try {
    const db = env.DB

    // Find user by email
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get()

    if (!user) {
      return new Response(JSON.stringify({ 
        error: 'Invalid credentials' 
      }), { 
        status: 401 
      })
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash)
    if (!validPassword) {
      return new Response(JSON.stringify({ 
        error: 'Invalid credentials' 
      }), { 
        status: 401 
      })
    }

    // Generate JWT
    const token = await sign({
      sub: user.id.toString(),
      name: user.name,
      email: user.email
    }, env.JWT_SECRET)

    return new Response(JSON.stringify({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500 
    })
  }
}

export async function handleRegister(
  name: string,
  email: string,
  password: string,
  env: Env
): Promise<Response> {
  try {
    const db = env.DB

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .get()

    if (existingUser) {
      return new Response(JSON.stringify({ 
        error: 'Email already in use' 
      }), { 
        status: 409 
      })
    }

    // Hash password
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt)

    // Create user
    const result = await db
      .insert(users)
      .values({
        name,
        email,
        password_hash
      })
      .run()

    // Generate JWT
    const token = await sign({
      sub: result.lastRowId.toString(),
      name,
      email
    }, env.JWT_SECRET)

    return new Response(JSON.stringify({
      token,
      user: {
        id: result.lastRowId,
        name,
        email
      }
    }), {
      status: 201,
      headers: {
        'Content-Type': 'application/json'
      }
    })
  } catch (error) {
    console.error('Registration error:', error)
    return new Response(JSON.stringify({ 
      error: 'Internal server error' 
    }), { 
      status: 500 
    })
  }
} 