DROP TABLE IF EXISTS listings;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    phone TEXT,
    location TEXT,
    bio TEXT,
    settings TEXT,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE listings (
    id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    images TEXT DEFAULT '[]',
    status TEXT NOT NULL DEFAULT 'draft',
    views INTEGER DEFAULT 0,
    favorites INTEGER DEFAULT 0,
    messages INTEGER DEFAULT 0,
    created_at TEXT DEFAULT (datetime('now')),
    updated_at TEXT DEFAULT (datetime('now')),
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_listings_user ON listings(user_id);
CREATE INDEX idx_listings_status ON listings(status);
