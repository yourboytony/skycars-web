export const schema = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Flight Plans table
CREATE TABLE IF NOT EXISTS flight_plans (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  simbrief_id TEXT,
  departure TEXT NOT NULL,
  arrival TEXT NOT NULL,
  route TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- VATSIM Tracking Cache table
CREATE TABLE IF NOT EXISTS vatsim_cache (
  id TEXT PRIMARY KEY,
  data_type TEXT NOT NULL,
  data JSON NOT NULL,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Forum Posts table
CREATE TABLE IF NOT EXISTS forum_posts (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`; 