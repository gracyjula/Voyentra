import { DatabaseSync } from 'node:sqlite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = join(__dirname, 'voyentra.db');

const db = new DatabaseSync(DB_PATH);

db.exec('PRAGMA journal_mode = WAL;');
db.exec('PRAGMA foreign_keys = ON;');

// ---------------------------------------------------------------------------
// Schema definitions
// ---------------------------------------------------------------------------

export function createSchema() {
  db.exec(`
    -- Users
    CREATE TABLE IF NOT EXISTS users (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      email         TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now'))
    );

    -- Destinations
    CREATE TABLE IF NOT EXISTS destinations (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      city          TEXT NOT NULL,
      country       TEXT NOT NULL,
      description   TEXT NOT NULL,
      image_url     TEXT NOT NULL,
      best_time     TEXT NOT NULL,
      est_budget    REAL NOT NULL,           -- per person INR
      attractions   TEXT NOT NULL DEFAULT '[]', -- JSON array of strings
      rating        REAL NOT NULL DEFAULT 4.5,
      tags          TEXT NOT NULL DEFAULT '[]',  -- JSON array of strings
      gallery       TEXT NOT NULL DEFAULT '[]'  -- JSON array of image URLs
    );

    -- Hotels
    CREATE TABLE IF NOT EXISTS hotels (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      name          TEXT NOT NULL,
      destination_id INTEGER NOT NULL,
      description   TEXT NOT NULL,
      image_url     TEXT NOT NULL,
      price_per_night REAL NOT NULL,
      rating        REAL NOT NULL DEFAULT 4.0,
      amenities     TEXT NOT NULL DEFAULT '[]',  -- JSON array
      room_types    TEXT NOT NULL DEFAULT '[]',  -- JSON array
      address       TEXT NOT NULL,
      gallery       TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (destination_id) REFERENCES destinations(id)
    );

    -- Holiday Packages
    CREATE TABLE IF NOT EXISTS holiday_packages (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT NOT NULL,
      destination_id INTEGER NOT NULL,
      description   TEXT NOT NULL,
      image_url     TEXT NOT NULL,
      duration_days INTEGER NOT NULL,
      price         REAL NOT NULL,
      inclusions    TEXT NOT NULL DEFAULT '[]',  -- JSON array
      itinerary     TEXT NOT NULL DEFAULT '[]',  -- JSON array of day objects
      travel_style  TEXT NOT NULL DEFAULT 'Leisure',
      rating        REAL NOT NULL DEFAULT 4.3,
      gallery       TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (destination_id) REFERENCES destinations(id)
    );

    -- Local Experiences
    CREATE TABLE IF NOT EXISTS local_experiences (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      title         TEXT NOT NULL,
      destination_id INTEGER NOT NULL,
      description   TEXT NOT NULL,
      image_url     TEXT NOT NULL,
      category      TEXT NOT NULL,  -- sightseeing, food, adventure, cultural, guided
      duration_hours REAL NOT NULL,
      price         REAL NOT NULL,
      location      TEXT NOT NULL,
      rating        REAL NOT NULL DEFAULT 4.5,
      gallery       TEXT NOT NULL DEFAULT '[]',
      FOREIGN KEY (destination_id) REFERENCES destinations(id)
    );

    -- Trips (user-created itineraries)
    CREATE TABLE IF NOT EXISTS trips (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER NOT NULL,
      title         TEXT NOT NULL,
      destination_id INTEGER NOT NULL,
      start_date    TEXT,
      end_date      TEXT,
      travelers     INTEGER NOT NULL DEFAULT 1,
      notes         TEXT NOT NULL DEFAULT '',
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (destination_id) REFERENCES destinations(id)
    );

    -- Itinerary Items (activities added to a trip on a specific day)
    CREATE TABLE IF NOT EXISTS itinerary_items (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      trip_id       INTEGER NOT NULL,
      day_number    INTEGER NOT NULL DEFAULT 1,
      item_type     TEXT NOT NULL,  -- 'experience', 'hotel', 'package', 'custom'
      ref_id        INTEGER,        -- FK to local_experiences / hotels / packages (nullable for custom)
      title         TEXT NOT NULL,
      description   TEXT NOT NULL DEFAULT '',
      location      TEXT NOT NULL DEFAULT '',
      start_time    TEXT NOT NULL DEFAULT '',
      cost          REAL NOT NULL DEFAULT 0,
      duration_hours REAL NOT NULL DEFAULT 0,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
    );

    -- Favorites (polymorphic: destination, hotel, package, experience)
    CREATE TABLE IF NOT EXISTS favorites (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER NOT NULL,
      item_type     TEXT NOT NULL,  -- 'destination', 'hotel', 'package', 'experience'
      item_id       INTEGER NOT NULL,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, item_type, item_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );

    -- Bookings (simulated / demo bookings)
    CREATE TABLE IF NOT EXISTS bookings (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id       INTEGER NOT NULL,
      booking_type  TEXT NOT NULL,  -- 'hotel', 'package', 'experience'
      ref_id        INTEGER NOT NULL,
      trip_id       INTEGER,        -- optional link to a trip
      title         TEXT NOT NULL,
      check_in      TEXT,
      check_out     TEXT,
      guests        INTEGER NOT NULL DEFAULT 1,
      total_price   REAL NOT NULL,
      status        TEXT NOT NULL DEFAULT 'confirmed',  -- always 'confirmed' (simulated)
      is_simulated  INTEGER NOT NULL DEFAULT 1,
      created_at    TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
    );
  `);
}

createSchema();

export default db;
