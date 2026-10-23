import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import db from './db.js';
import { runSeed } from './seed.js';
import { signToken, requireAuth, optionalAuth, JWT_SECRET } from './middleware/auth.js';
import jwt from 'jsonwebtoken';

const app = express();

app.use(cors());
app.use(express.json());

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function parseJSON(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

/** Enrich a destination row by parsing its JSON columns */
function enrichDest(row) {
  if (!row) return null;
  return {
    ...row,
    attractions: parseJSON(row.attractions, []),
    tags: parseJSON(row.tags, []),
    gallery: parseJSON(row.gallery, []),
  };
}

function enrichHotel(row) {
  if (!row) return null;
  return {
    ...row,
    amenities: parseJSON(row.amenities, []),
    room_types: parseJSON(row.room_types, []),
    gallery: parseJSON(row.gallery, []),
  };
}

function enrichPkg(row) {
  if (!row) return null;
  return {
    ...row,
    inclusions: parseJSON(row.inclusions, []),
    itinerary: parseJSON(row.itinerary, []),
    gallery: parseJSON(row.gallery, []),
  };
}

function enrichExp(row) {
  if (!row) return null;
  return {
    ...row,
    gallery: parseJSON(row.gallery, []),
  };
}

// ---------------------------------------------------------------------------
// AUTH
// ---------------------------------------------------------------------------
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const hash = bcrypt.hashSync(password, 10);
  const info = db
    .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
    .run(name, email, hash);
  const user = { id: info.lastInsertRowid, name, email };
  const token = signToken(user);
  res.status(201).json({ token, user });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const row = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!row || !bcrypt.compareSync(password, row.password_hash)) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const user = { id: row.id, name: row.name, email: row.email };
  const token = signToken(user);
  res.json({ token, user });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ---------------------------------------------------------------------------
// DESTINATIONS
// ---------------------------------------------------------------------------
app.get('/api/destinations', (req, res) => {
  const { search, tag } = req.query;
  let query = 'SELECT * FROM destinations';
  const params = [];
  const conditions = [];

  if (search) {
    conditions.push('(name LIKE ? OR city LIKE ? OR country LIKE ?)');
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }
  if (tag) {
    conditions.push('tags LIKE ?');
    params.push(`%${tag}%`);
  }
  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }
  query += ' ORDER BY rating DESC';

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(enrichDest));
});

app.get('/api/destinations/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM destinations WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Destination not found.' });
  res.json(enrichDest(row));
});

// ---------------------------------------------------------------------------
// HOTELS
// ---------------------------------------------------------------------------
app.get('/api/hotels', (req, res) => {
  const { destination_id, search, min_price, max_price, min_rating, amenity, sort } = req.query;
  let query = 'SELECT * FROM hotels';
  const params = [];
  const conditions = [];

  if (destination_id) {
    conditions.push('destination_id = ?');
    params.push(destination_id);
  }
  if (search) {
    conditions.push('name LIKE ?');
    params.push(`%${search}%`);
  }
  if (min_price) {
    conditions.push('price_per_night >= ?');
    params.push(min_price);
  }
  if (max_price) {
    conditions.push('price_per_night <= ?');
    params.push(max_price);
  }
  if (min_rating) {
    conditions.push('rating >= ?');
    params.push(min_rating);
  }
  if (amenity) {
    conditions.push('amenities LIKE ?');
    params.push(`%${amenity}%`);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  // Sorting
  if (sort === 'price_asc') query += ' ORDER BY price_per_night ASC';
  else if (sort === 'price_desc') query += ' ORDER BY price_per_night DESC';
  else if (sort === 'rating') query += ' ORDER BY rating DESC';
  else query += ' ORDER BY rating DESC';

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(enrichHotel));
});

app.get('/api/hotels/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM hotels WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Hotel not found.' });
  const hotel = enrichHotel(row);
  // Attach destination info
  const dest = db.prepare('SELECT id, name, city, country FROM destinations WHERE id = ?').get(hotel.destination_id);
  hotel.destination = dest || null;
  res.json(hotel);
});

// ---------------------------------------------------------------------------
// HOLIDAY PACKAGES
// ---------------------------------------------------------------------------
app.get('/api/packages', (req, res) => {
  const { destination_id, search, max_budget, travel_style, max_duration, sort } = req.query;
  let query = 'SELECT * FROM holiday_packages';
  const params = [];
  const conditions = [];

  if (destination_id) {
    conditions.push('destination_id = ?');
    params.push(destination_id);
  }
  if (search) {
    conditions.push('title LIKE ?');
    params.push(`%${search}%`);
  }
  if (max_budget) {
    conditions.push('price <= ?');
    params.push(max_budget);
  }
  if (travel_style) {
    conditions.push('travel_style = ?');
    params.push(travel_style);
  }
  if (max_duration) {
    conditions.push('duration_days <= ?');
    params.push(max_duration);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort === 'price_asc') query += ' ORDER BY price ASC';
  else if (sort === 'price_desc') query += ' ORDER BY price DESC';
  else if (sort === 'duration') query += ' ORDER BY duration_days ASC';
  else query += ' ORDER BY rating DESC';

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(enrichPkg));
});

app.get('/api/packages/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM holiday_packages WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Package not found.' });
  const pkg = enrichPkg(row);
  const dest = db.prepare('SELECT id, name, city, country, image_url FROM destinations WHERE id = ?').get(pkg.destination_id);
  pkg.destination = dest || null;
  res.json(pkg);
});

// ---------------------------------------------------------------------------
// LOCAL EXPERIENCES
// ---------------------------------------------------------------------------
app.get('/api/experiences', (req, res) => {
  const { destination_id, search, category, max_price, sort } = req.query;
  let query = 'SELECT * FROM local_experiences';
  const params = [];
  const conditions = [];

  if (destination_id) {
    conditions.push('destination_id = ?');
    params.push(destination_id);
  }
  if (search) {
    conditions.push('title LIKE ?');
    params.push(`%${search}%`);
  }
  if (category) {
    conditions.push('category = ?');
    params.push(category);
  }
  if (max_price) {
    conditions.push('price <= ?');
    params.push(max_price);
  }

  if (conditions.length) {
    query += ' WHERE ' + conditions.join(' AND ');
  }

  if (sort === 'price_asc') query += ' ORDER BY price ASC';
  else if (sort === 'price_desc') query += ' ORDER BY price DESC';
  else if (sort === 'rating') query += ' ORDER BY rating DESC';
  else query += ' ORDER BY rating DESC';

  const rows = db.prepare(query).all(...params);
  res.json(rows.map(enrichExp));
});

app.get('/api/experiences/:id', (req, res) => {
  const row = db.prepare('SELECT * FROM local_experiences WHERE id = ?').get(req.params.id);
  if (!row) return res.status(404).json({ error: 'Experience not found.' });
  const exp = enrichExp(row);
  const dest = db.prepare('SELECT id, name, city, country FROM destinations WHERE id = ?').get(exp.destination_id);
  exp.destination = dest || null;
  res.json(exp);
});

// ---------------------------------------------------------------------------
// TRIPS (requires auth)
// ---------------------------------------------------------------------------
app.get('/api/trips', requireAuth, (req, res) => {
  const trips = db.prepare('SELECT * FROM trips WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  // Enrich each trip with destination + items
  const result = trips.map((t) => {
    const dest = db.prepare('SELECT id, name, city, country, image_url FROM destinations WHERE id = ?').get(t.destination_id);
    const items = db.prepare('SELECT * FROM itinerary_items WHERE trip_id = ? ORDER BY day_number, id').all(t.id);
    const totalCost = items.reduce((sum, i) => sum + i.cost, 0);
    return { ...t, destination: dest, items, total_cost: totalCost };
  });
  res.json(result);
});

app.get('/api/trips/:id', requireAuth, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found.' });
  const dest = db.prepare('SELECT id, name, city, country, image_url FROM destinations WHERE id = ?').get(trip.destination_id);
  const items = db.prepare('SELECT * FROM itinerary_items WHERE trip_id = ? ORDER BY day_number, id').all(trip.id);
  const totalCost = items.reduce((sum, i) => sum + i.cost, 0);
  res.json({ ...trip, destination: dest, items, total_cost: totalCost });
});

app.post('/api/trips', requireAuth, (req, res) => {
  const { title, destination_id, start_date, end_date, travelers, notes } = req.body;
  if (!title || !destination_id) {
    return res.status(400).json({ error: 'Trip title and destination are required.' });
  }
  const info = db.prepare(`
    INSERT INTO trips (user_id, title, destination_id, start_date, end_date, travelers, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, title, destination_id, start_date || null, end_date || null, travelers || 1, notes || '');
  const trip = db.prepare('SELECT * FROM trips WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ ...trip, items: [], total_cost: 0 });
});

app.put('/api/trips/:id', requireAuth, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found.' });
  const { title, start_date, end_date, travelers, notes } = req.body;
  db.prepare(`
    UPDATE trips SET title = ?, start_date = ?, end_date = ?, travelers = ?, notes = ? WHERE id = ?
  `).run(
    title ?? trip.title,
    start_date ?? trip.start_date,
    end_date ?? trip.end_date,
    travelers ?? trip.travelers,
    notes ?? trip.notes,
    trip.id
  );
  const updated = db.prepare('SELECT * FROM trips WHERE id = ?').get(trip.id);
  res.json(updated);
});

app.delete('/api/trips/:id', requireAuth, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.id, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found.' });
  db.prepare('DELETE FROM trips WHERE id = ?').run(trip.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// ITINERARY ITEMS (requires auth, scoped to user's trips)
// ---------------------------------------------------------------------------
app.post('/api/trips/:tripId/items', requireAuth, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.tripId, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found.' });

  const { day_number, item_type, ref_id, title, description, location, start_time, cost, duration_hours } = req.body;
  if (!title || !item_type) {
    return res.status(400).json({ error: 'Item title and type are required.' });
  }
  const info = db.prepare(`
    INSERT INTO itinerary_items (trip_id, day_number, item_type, ref_id, title, description, location, start_time, cost, duration_hours)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    trip.id,
    day_number || 1,
    item_type,
    ref_id || null,
    title,
    description || '',
    location || '',
    start_time || '',
    cost || 0,
    duration_hours || 0
  );
  const item = db.prepare('SELECT * FROM itinerary_items WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json(item);
});

app.put('/api/trips/:tripId/items/:itemId', requireAuth, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.tripId, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found.' });
  const item = db.prepare('SELECT * FROM itinerary_items WHERE id = ? AND trip_id = ?').get(req.params.itemId, trip.id);
  if (!item) return res.status(404).json({ error: 'Itinerary item not found.' });

  const { day_number, title, description, location, start_time, cost, duration_hours } = req.body;
  db.prepare(`
    UPDATE itinerary_items SET day_number = ?, title = ?, description = ?, location = ?, start_time = ?, cost = ?, duration_hours = ? WHERE id = ?
  `).run(
    day_number ?? item.day_number,
    title ?? item.title,
    description ?? item.description,
    location ?? item.location,
    start_time ?? item.start_time,
    cost ?? item.cost,
    duration_hours ?? item.duration_hours,
    item.id
  );
  const updated = db.prepare('SELECT * FROM itinerary_items WHERE id = ?').get(item.id);
  res.json(updated);
});

app.delete('/api/trips/:tripId/items/:itemId', requireAuth, (req, res) => {
  const trip = db.prepare('SELECT * FROM trips WHERE id = ? AND user_id = ?').get(req.params.tripId, req.user.id);
  if (!trip) return res.status(404).json({ error: 'Trip not found.' });
  db.prepare('DELETE FROM itinerary_items WHERE id = ? AND trip_id = ?').run(req.params.itemId, trip.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// FAVORITES (requires auth)
// ---------------------------------------------------------------------------
app.get('/api/favorites', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM favorites WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  // Enrich with actual item data
  const enriched = rows.map((f) => {
    let item = null;
    if (f.item_type === 'destination') {
      item = db.prepare('SELECT id, name, city, country, image_url, rating FROM destinations WHERE id = ?').get(f.item_id);
    } else if (f.item_type === 'hotel') {
      item = db.prepare('SELECT id, name, image_url, price_per_night, rating FROM hotels WHERE id = ?').get(f.item_id);
    } else if (f.item_type === 'package') {
      item = db.prepare('SELECT id, title, image_url, price, duration_days, rating FROM holiday_packages WHERE id = ?').get(f.item_id);
    } else if (f.item_type === 'experience') {
      item = db.prepare('SELECT id, title, image_url, price, category, rating FROM local_experiences WHERE id = ?').get(f.item_id);
    }
    return { ...f, item };
  });
  res.json(enriched);
});

app.post('/api/favorites', requireAuth, (req, res) => {
  const { item_type, item_id } = req.body;
  if (!item_type || !item_id) {
    return res.status(400).json({ error: 'item_type and item_id are required.' });
  }
  const validTypes = ['destination', 'hotel', 'package', 'experience'];
  if (!validTypes.includes(item_type)) {
    return res.status(400).json({ error: 'Invalid item_type.' });
  }
  try {
    const info = db.prepare('INSERT INTO favorites (user_id, item_type, item_id) VALUES (?, ?, ?)').run(req.user.id, item_type, item_id);
    const fav = db.prepare('SELECT * FROM favorites WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json(fav);
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      return res.status(409).json({ error: 'Already in favorites.' });
    }
    throw err;
  }
});

app.delete('/api/favorites/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM favorites WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// Also allow removal by type+id (convenience)
app.delete('/api/favorites', requireAuth, (req, res) => {
  const { item_type, item_id } = req.body;
  db.prepare('DELETE FROM favorites WHERE item_type = ? AND item_id = ? AND user_id = ?').run(item_type, item_id, req.user.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// BOOKINGS (requires auth — all bookings are simulated)
// ---------------------------------------------------------------------------
app.get('/api/bookings', requireAuth, (req, res) => {
  const rows = db.prepare('SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC').all(req.user.id);
  res.json(rows.map((b) => ({ ...b, is_simulated: !!b.is_simulated })));
});

app.post('/api/bookings', requireAuth, (req, res) => {
  const { booking_type, ref_id, trip_id, title, check_in, check_out, guests, total_price } = req.body;
  if (!booking_type || !ref_id || !title || !total_price) {
    return res.status(400).json({ error: 'booking_type, ref_id, title, and total_price are required.' });
  }
  const validTypes = ['hotel', 'package', 'experience'];
  if (!validTypes.includes(booking_type)) {
    return res.status(400).json({ error: 'Invalid booking_type.' });
  }
  const info = db.prepare(`
    INSERT INTO bookings (user_id, booking_type, ref_id, trip_id, title, check_in, check_out, guests, total_price, status, is_simulated)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'confirmed', 1)
  `).run(req.user.id, booking_type, ref_id, trip_id || null, title, check_in || null, check_out || null, guests || 1, total_price);
  const booking = db.prepare('SELECT * FROM bookings WHERE id = ?').get(info.lastInsertRowid);
  res.status(201).json({ ...booking, is_simulated: true });
});

app.delete('/api/bookings/:id', requireAuth, (req, res) => {
  db.prepare('DELETE FROM bookings WHERE id = ? AND user_id = ?').run(req.params.id, req.user.id);
  res.json({ success: true });
});

// ---------------------------------------------------------------------------
// HEALTH
// ---------------------------------------------------------------------------
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'voyentra-api' });
});

// ---------------------------------------------------------------------------
// 404 + Error handler
// ---------------------------------------------------------------------------
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Endpoint not found.' });
});

app.use((err, _req, res, _next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
const PORT = process.env.PORT || 4000;

// Auto-seed on first run (if destinations table is empty)
const count = db.prepare('SELECT COUNT(*) as c FROM destinations').get();
if (count.c === 0) {
  console.log('No data found — running seed automatically...\n');
  runSeed();
}

app.listen(PORT, () => {
  console.log(`🚀 Voyentra API running on http://localhost:${PORT}`);
});
