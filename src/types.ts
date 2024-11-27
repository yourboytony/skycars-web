export interface Env {
  DB: D1Database
  JWT_SECRET: string
}

export interface User {
  id: number
  name: string
  email: string
  password_hash: string
  created_at: string
  updated_at: string
} 