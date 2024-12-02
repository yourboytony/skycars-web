-- Create users table
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create profiles table
CREATE TABLE profiles (
  user_id TEXT PRIMARY KEY REFERENCES users(id),
  avatar_url TEXT,
  bio TEXT,
  location TEXT,
  website TEXT,
  social_links JSON,
  preferences JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create flights table
CREATE TABLE flights (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  aircraft_id TEXT NOT NULL,
  departure_icao TEXT NOT NULL,
  arrival_icao TEXT NOT NULL,
  departure_time DATETIME NOT NULL,
  arrival_time DATETIME,
  route_json JSON,
  weather_json JSON,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create aircraft table
CREATE TABLE aircraft (
  id TEXT PRIMARY KEY,
  registration TEXT NOT NULL,
  type TEXT NOT NULL,
  model TEXT NOT NULL,
  manufacturer TEXT NOT NULL,
  year INTEGER,
  specs_json JSON,
  status TEXT NOT NULL DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create waypoints table
CREATE TABLE waypoints (
  id TEXT PRIMARY KEY,
  flight_id TEXT NOT NULL REFERENCES flights(id),
  sequence INTEGER NOT NULL,
  type TEXT NOT NULL,
  identifier TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  altitude INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create weather_reports table
CREATE TABLE weather_reports (
  id TEXT PRIMARY KEY,
  icao TEXT NOT NULL,
  report_type TEXT NOT NULL,
  raw_text TEXT NOT NULL,
  parsed_json JSON NOT NULL,
  timestamp DATETIME NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create airports table
CREATE TABLE airports (
  icao TEXT PRIMARY KEY,
  iata TEXT,
  name TEXT NOT NULL,
  city TEXT,
  country TEXT,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  elevation INTEGER,
  timezone TEXT,
  data_json JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create airspace table
CREATE TABLE airspace (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  class TEXT NOT NULL,
  type TEXT NOT NULL,
  lower_limit INTEGER,
  upper_limit INTEGER,
  geometry_json JSON NOT NULL,
  metadata_json JSON,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX idx_flights_user ON flights(user_id);
CREATE INDEX idx_flights_departure ON flights(departure_icao);
CREATE INDEX idx_flights_arrival ON flights(arrival_icao);
CREATE INDEX idx_waypoints_flight ON waypoints(flight_id);
CREATE INDEX idx_weather_icao ON weather_reports(icao);
CREATE INDEX idx_weather_timestamp ON weather_reports(timestamp);
CREATE INDEX idx_airspace_class ON airspace(class); 