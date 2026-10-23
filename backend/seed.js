/* eslint-disable no-console */
/**
 * seed.js — populates the Voyentra SQLite database with realistic demonstration data.
 *
 * All data is illustrative and clearly seeded; it does NOT represent live availability
 * or verified commercial offers.
 */
import db from './db.js';
import bcrypt from 'bcryptjs';

// Image helper — uses Unsplash source URLs (free, no API key required)
const img = (q, w = 800, h = 600) =>
  `https://images.unsplash.com/photo-${q}?w=${w}&h=${h}&fit=crop`;
const gallery = (ids) => ids.map((id) => img(id, 1200, 800));

// ---------------------------------------------------------------------------
// Destination data
// ---------------------------------------------------------------------------
const destinations = [
  {
    name: 'Hyderabad',
    city: 'Hyderabad',
    country: 'India',
    description:
      'The City of Pearls blends Mughal heritage with modern tech hubs. Explore grand palaces, savour world-famous biryani, and stroll around serene lakes.',
    image_url: img('1593241779405-71dc9c0cc3b4', 1200, 800),
    best_time: 'October to March',
    est_budget: 12000,
    rating: 4.4,
    attractions: JSON.stringify(['Charminar', 'Golconda Fort', 'Hussain Sagar Lake', 'Ramoji Film City', 'Salar Jung Museum']),
    tags: JSON.stringify(['Heritage', 'Food', 'City']),
    gallery: JSON.stringify(gallery([
      '1593241779405-71dc9c0cc3b4',
      '1587474260584-2b15f6f8a8f6',
      '1561484930-994b546b5b3e',
    ])),
  },
  {
    name: 'Goa',
    city: 'Panaji',
    country: 'India',
    description:
      'India’s sunshine state with golden beaches, Portuguese-era churches, vibrant nightlife, and world-class seafood. Perfect for relaxation and adventure.',
    image_url: img('1512343879784-a960bf40f7f7', 1200, 800),
    best_time: 'November to February',
    est_budget: 18000,
    rating: 4.6,
    attractions: JSON.stringify(['Baga Beach', 'Dudhsagar Falls', 'Basilica of Bom Jesus', 'Fort Aguada', 'Anjuna Flea Market']),
    tags: JSON.stringify(['Beach', 'Nightlife', 'Relaxation']),
    gallery: JSON.stringify(gallery([
      '1512343879784-a960bf40f7f7',
      '1512100256341-2ea2af2f3cb0',
      '1582719478252-cb42ff375351',
    ])),
  },
  {
    name: 'Jaipur',
    city: 'Jaipur',
    country: 'India',
    description:
      'The Pink City captivates with majestic forts, ornate palaces, and bustling bazaars. A living museum of Rajputana grandeur and desert culture.',
    image_url: img('1599661046289-e31897846b7d', 1200, 800),
    best_time: 'October to March',
    est_budget: 15000,
    rating: 4.7,
    attractions: JSON.stringify(['Amber Fort', 'Hawa Mahal', 'City Palace', 'Jantar Mantar', 'Nahargarh Fort']),
    tags: JSON.stringify(['Heritage', 'Culture', 'Desert']),
    gallery: JSON.stringify(gallery([
      '1599661046289-e31897846b7d',
      '1599661046289-e31897846b7d',
      '1599640087758-1cd2792071e4',
    ])),
  },
  {
    name: 'Manali',
    city: 'Manali',
    country: 'India',
    description:
      'A Himalayan paradise surrounded by snow-capped peaks, pine forests, and gushing rivers. Ideal for trekking, skiing, and soul-refreshing mountain escapes.',
    image_url: img('1626637673761-9ca4b1f1e7b4', 1200, 800),
    best_time: 'March to June & October to February',
    est_budget: 20000,
    rating: 4.8,
    attractions: JSON.stringify(['Solang Valley', 'Rohtang Pass', 'Hadimba Temple', 'Old Manali', 'Manikaran Sahib']),
    tags: JSON.stringify(['Mountains', 'Adventure', 'Nature']),
    gallery: JSON.stringify(gallery([
      '1626637673761-9ca4b1f1e7b4',
      '1626637673761-9ca4b1f1e7b4',
      '1605640840605-14ac1855827b',
    ])),
  },
  {
    name: 'Kerala',
    city: 'Munnar',
    country: 'India',
    description:
      'God’s Own Country — emerald tea plantations, tranquil backwaters, and palm-fringed beaches. A tropical haven for wellness and nature lovers.',
    image_url: img('1602216056776-9234ab90469d', 1200, 800),
    best_time: 'September to March',
    est_budget: 22000,
    rating: 4.7,
    attractions: JSON.stringify(['Alleppey Backwaters', 'Munnar Tea Gardens', 'Athirappilly Falls', 'Kochi Fort', 'Wayanad Wildlife']),
    tags: JSON.stringify(['Nature', 'Backwaters', 'Wellness']),
    gallery: JSON.stringify(gallery([
      '1602216056776-9234ab90469d',
      '1602216056776-9234ab90469d',
      '1593693411515-c20261bcad6e',
    ])),
  },
  {
    name: 'Bali',
    city: 'Denpasar',
    country: 'Indonesia',
    description:
      'The Island of the Gods enchants with terraced rice fields, ancient temples, volcanic mountains, and pristine beaches. A spiritual and tropical paradise.',
    image_url: img('1537996194471-e657df975ab4', 1200, 800),
    best_time: 'April to October',
    est_budget: 45000,
    rating: 4.8,
    attractions: JSON.stringify(['Uluwatu Temple', 'Tegallalang Rice Terrace', 'Mount Batur', 'Seminyak Beach', 'Sacred Monkey Forest']),
    tags: JSON.stringify(['Beach', 'Culture', 'Spiritual']),
    gallery: JSON.stringify(gallery([
      '1537996194471-e657df975ab4',
      '1518548419970-58e3b4079ab2',
      '1573790387438-4da905039395',
    ])),
  },
  {
    name: 'Paris',
    city: 'Paris',
    country: 'France',
    description:
      'The City of Light — iconic landmarks, world-class art museums, charming boulevards, and irresistible cuisine. The ultimate romantic European destination.',
    image_url: img('1502602898657-3e91760cbb34', 1200, 800),
    best_time: 'June to September',
    est_budget: 80000,
    rating: 4.9,
    attractions: JSON.stringify(['Eiffel Tower', 'Louvre Museum', 'Notre-Dame', 'Montmartre', 'Champs-Élysées']),
    tags: JSON.stringify(['Romance', 'Culture', 'City']),
    gallery: JSON.stringify(gallery([
      '1502602898657-3e91760cbb34',
      '1499856871958-5b96b75cd4a8',
      '1520975954732-35dd22298614',
    ])),
  },
];

// ---------------------------------------------------------------------------
// Hotels — 2 per destination
// ---------------------------------------------------------------------------
function hotelsFor(destId, dest) {
  return [
    {
      name: `${dest.city} Grand Palace Hotel`,
      destination_id: destId,
      description: `A luxurious 5-star hotel in the heart of ${dest.city}, offering elegant rooms, fine dining, and panoramic ${dest.country === 'India' ? 'city' : dest.country === 'France' ? 'river' : 'beach'} views.`,
      image_url: img('1566073771259-6a8506099945', 800, 600),
      price_per_night: dest.est_budget > 40000 ? 12000 : dest.est_budget > 15000 ? 4500 : 2800,
      rating: 4.7,
      amenities: JSON.stringify(['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Valet Parking', 'Airport Shuttle']),
      room_types: JSON.stringify(['Deluxe Room', 'Executive Suite', 'Presidential Suite']),
      address: `${dest.city} City Centre, ${dest.country}`,
      gallery: JSON.stringify(gallery(['1566073771259-6a8506099945', '1582719508470-3933e0571d4b', '1611892440504-42b0b1a2b0c0'])),
    },
    {
      name: `${dest.city} Boutique Inn`,
      destination_id: destId,
      description: `A charming boutique stay blending local character with modern comfort. Walking distance to ${dest.country === 'India' ? 'major attractions' : 'top landmarks'} and local markets.`,
      image_url: img('1551882547-ff40c63fe5fa', 800, 600),
      price_per_night: dest.est_budget > 40000 ? 7500 : dest.est_budget > 15000 ? 2200 : 1500,
      rating: 4.3,
      amenities: JSON.stringify(['Free WiFi', 'Breakfast', 'Restaurant', 'Bike Rental']),
      room_types: JSON.stringify(['Standard Room', 'Family Room', 'Garden View Room']),
      address: `${dest.city} Old Town, ${dest.country}`,
      gallery: JSON.stringify(gallery(['1551882547-ff40c63fe5fa', '1521568855801-35c1d9b6a7e2', '1590490360182-c33d57733427'])),
    },
  ];
}

// ---------------------------------------------------------------------------
// Holiday Packages — 1-2 per destination
// ---------------------------------------------------------------------------
function packagesFor(destId, dest) {
  const basePkg = {
    title: `${dest.name} Explorer — ${dest.city} Getaway`,
    destination_id: destId,
    description: `A curated ${dest.name} holiday covering top attractions, comfortable stays, and guided experiences in ${dest.city}.`,
    image_url: dest.image_url,
    duration_days: dest.est_budget > 40000 ? 7 : 5,
    price: dest.est_budget * 1.5,
    inclusions: JSON.stringify(['Hotel Accommodation', 'Daily Breakfast', 'Airport Transfers', 'Guided Sightseeing', 'Inter-city Travel']),
    itinerary: JSON.stringify([
      { day: 1, title: 'Arrival & Check-in', details: `Arrive in ${dest.city}, hotel check-in, evening at leisure.` },
      { day: 2, title: 'City Highlights', details: `Guided tour of ${JSON.parse(dest.attractions)[0]} and ${JSON.parse(dest.attractions)[1]}.` },
      { day: 3, title: 'Cultural Immersion', details: `Visit ${JSON.parse(dest.attractions)[2]}, local cuisine experience.` },
      { day: 4, title: 'Adventure & Nature', details: `Explore ${JSON.parse(dest.attractions)[3] || 'surrounding areas'} and scenic spots.` },
      { day: 5, title: 'Departure', details: 'Morning at leisure, check-out, and departure transfer.' },
    ]),
    travel_style: dest.tags.includes('Beach') ? 'Relaxation' : dest.tags.includes('Mountains') ? 'Adventure' : 'Leisure',
    rating: 4.5,
    gallery: dest.gallery,
  };
  return [basePkg];
}

// ---------------------------------------------------------------------------
// Local Experiences — 3-4 per destination
// ---------------------------------------------------------------------------
function experiencesFor(destId, dest) {
  const attractions = JSON.parse(dest.attractions);
  return [
    {
      title: `${attractions[0]} Guided Tour`,
      destination_id: destId,
      description: `An expert-led walking tour of the iconic ${attractions[0]}, covering history, architecture, and hidden gems.`,
      image_url: dest.image_url,
      category: 'sightseeing',
      duration_hours: 3,
      price: dest.est_budget > 40000 ? 3500 : 800,
      location: `${attractions[0]}, ${dest.city}`,
      rating: 4.6,
      gallery: dest.gallery,
    },
    {
      title: `${dest.city} Food Trail`,
      destination_id: destId,
      description: `A mouthwatering culinary journey through ${dest.city}'s best street food, local restaurants, and hidden gems.`,
      image_url: img('1504674900247-0877df9cc836', 800, 600),
      category: 'food',
      duration_hours: 4,
      price: dest.est_budget > 40000 ? 5000 : 1200,
      location: `${dest.city} Food District, ${dest.country}`,
      rating: 4.8,
      gallery: JSON.stringify(gallery(['1504674900247-0877df9cc836', '1504674900247-0877df9cc836'])),
    },
    {
      title: `${dest.name} Adventure Experience`,
      destination_id: destId,
      description: `Thrilling outdoor activities in ${dest.city} — perfect for adrenaline seekers looking to explore ${dest.name} from a different angle.`,
      image_url: img('1602002589255-1d4e0f4a4c4e', 800, 600),
      category: 'adventure',
      duration_hours: 6,
      price: dest.est_budget > 40000 ? 6000 : 2000,
      location: `${dest.city} Outskirts, ${dest.country}`,
      rating: 4.5,
      gallery: JSON.stringify(gallery(['1602002589255-1d4e0f4a4c4e'])),
    },
    {
      title: `${dest.city} Cultural Evening`,
      destination_id: destId,
      description: `Immerse yourself in ${dest.country}'s rich cultural heritage with traditional music, dance, and storytelling.`,
      image_url: img('1493225457124-a3eb161ffa5f', 800, 600),
      category: 'cultural',
      duration_hours: 2,
      price: dest.est_budget > 40000 ? 3000 : 600,
      location: `${dest.city} Cultural Centre, ${dest.country}`,
      rating: 4.7,
      gallery: JSON.stringify(gallery(['1493225457124-a3eb161ffa5f'])),
    },
  ];
}

// ---------------------------------------------------------------------------
// Seed runner
// ---------------------------------------------------------------------------
export function runSeed() {
  console.log('🌱 Seeding Voyentra database...\n');

  // Wipe existing data
  db.exec(`
    DELETE FROM bookings; DELETE FROM itinerary_items; DELETE FROM trips;
    DELETE FROM favorites; DELETE FROM local_experiences; DELETE FROM holiday_packages;
    DELETE FROM hotels; DELETE FROM destinations; DELETE FROM users;
  `);
  // Reset autoincrement counters
  db.exec(`
    DELETE FROM sqlite_sequence WHERE name IN
    ('bookings','itinerary_items','trips','favorites','local_experiences','holiday_packages','hotels','destinations','users');
  `);

  // --- Demo user ---
  const demoPassword = bcrypt.hashSync('demo12345', 10);
  db.prepare(`INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)`).run(
    'Demo Traveler', 'demo@voyentra.com', demoPassword
  );
  console.log('  ✓ Demo user: demo@voyentra.com / demo12345');

  // --- Destinations ---
  const insertDest = db.prepare(`
    INSERT INTO destinations (name, city, country, description, image_url, best_time, est_budget, rating, attractions, tags, gallery)
    VALUES (@name, @city, @country, @description, @image_url, @best_time, @est_budget, @rating, @attractions, @tags, @gallery)
  `);

  const insertHotel = db.prepare(`
    INSERT INTO hotels (name, destination_id, description, image_url, price_per_night, rating, amenities, room_types, address, gallery)
    VALUES (@name, @destination_id, @description, @image_url, @price_per_night, @rating, @amenities, @room_types, @address, @gallery)
  `);

  const insertPkg = db.prepare(`
    INSERT INTO holiday_packages (title, destination_id, description, image_url, duration_days, price, inclusions, itinerary, travel_style, rating, gallery)
    VALUES (@title, @destination_id, @description, @image_url, @duration_days, @price, @inclusions, @itinerary, @travel_style, @rating, @gallery)
  `);

  const insertExp = db.prepare(`
    INSERT INTO local_experiences (title, destination_id, description, image_url, category, duration_hours, price, location, rating, gallery)
    VALUES (@title, @destination_id, @description, @image_url, @category, @duration_hours, @price, @location, @rating, @gallery)
  `);

  let destCount = 0, hotelCount = 0, pkgCount = 0, expCount = 0;

  for (const d of destinations) {
    const info = insertDest.run(d);
    const destId = info.lastInsertRowid;
    destCount++;

    for (const h of hotelsFor(destId, d)) {
      insertHotel.run(h);
      hotelCount++;
    }

    for (const p of packagesFor(destId, d)) {
      insertPkg.run(p);
      pkgCount++;
    }

    for (const e of experiencesFor(destId, d)) {
      insertExp.run(e);
      expCount++;
    }
  }

  console.log(`  ✓ ${destCount} destinations`);
  console.log(`  ✓ ${hotelCount} hotels`);
  console.log(`  ✓ ${pkgCount} holiday packages`);
  console.log(`  ✓ ${expCount} local experiences`);
  console.log('\n✅ Seeding complete!\n');
}

// Run when invoked directly: `node seed.js`
const isDirect = process.argv[1] && process.argv[1].endsWith('seed.js');
if (isDirect) {
  runSeed();
}
