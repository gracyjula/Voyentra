# 🧭 Voyentra — Your Journey, Beautifully Planned

A full-stack travel marketplace web application for discovering destinations, comparing hotels, exploring holiday packages, creating personalized itineraries, and booking local experiences.

> **Demo Notice:** All bookings are simulated. No real reservations or payments occur.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite 8 |
| Styling | Tailwind CSS v4 |
| Icons | Lucide React |
| Routing | React Router v7 |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | SQLite (Node built-in, no install needed) |
| Auth | JWT + bcryptjs |

---

## Project Structure

```
InnoveX/
├── backend/
│   ├── server.js          # Express API server with all routes
│   ├── db.js              # SQLite schema + connection
│   ├── seed.js            # Sample data seeder
│   ├── middleware/
│   │   └── auth.js        # JWT middleware
│   └── package.json
└── frontend/
    ├── src/
    │   ├── pages/         # All page components
    │   ├── components/    # Shared components (Navbar, Footer, etc.)
    │   ├── context/       # Auth + Favorites context
    │   └── lib/           # API client + toast utility
    ├── vite.config.js
    └── package.json
```

---

## Quick Start

### Prerequisites
- **Node.js v22+** (required for built-in SQLite support)

### 1. Install dependencies

```powershell
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Start the Backend

```powershell
cd backend
npm run dev
```

The API server starts at **http://localhost:4000**

On first run, the database is seeded automatically with 7 destinations, 14 hotels, 7 packages, and 28 experiences.

### 3. Start the Frontend

Open a new terminal:

```powershell
cd frontend
npm run dev
```

The app opens at **http://localhost:5173**

---

## Demo Account

| Field | Value |
|-------|-------|
| Email | demo@voyentra.com |
| Password | demo12345 |

Or register a new account from the Sign Up page.

---

## Implemented Features

### Core
- ✅ Landing page with hero, search, featured sections
- ✅ Destination search with tag filters
- ✅ Hotel search with price/rating/amenity filters + sorting
- ✅ Side-by-side hotel comparison (up to 3)
- ✅ Holiday package search with travel style and budget filters
- ✅ Local experiences by category (food, sightseeing, adventure, cultural, guided)
- ✅ Detailed pages for each item with image galleries

### User Accounts
- ✅ Register / Login with password hashing (bcryptjs)
- ✅ JWT authentication (7-day tokens)
- ✅ Protected routes (server-side + client-side)
- ✅ User dashboard with stats

### Itinerary Builder
- ✅ Create trips with destination, dates, travelers
- ✅ Day-by-day itinerary planner
- ✅ Add/Edit/Delete itinerary items
- ✅ Item types: hotel, experience, package, custom
- ✅ Real-time budget calculation
- ✅ Per-traveler cost breakdown

### Favorites & Bookings
- ✅ Save any item (destination/hotel/package/experience) to favorites
- ✅ Simulated booking workflow with confirmation page
- ✅ Booking history in dashboard
- ✅ All bookings clearly labeled as demo/simulated

### Design
- ✅ Premium dark navy + teal + orange color scheme
- ✅ Responsive layouts (mobile, tablet, desktop)
- ✅ Smooth card hover animations
- ✅ Loading spinners and empty states
- ✅ Toast notification system

---

## API Endpoints

```
GET    /api/health
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/destinations
GET    /api/destinations/:id
GET    /api/hotels
GET    /api/hotels/:id
GET    /api/packages
GET    /api/packages/:id
GET    /api/experiences
GET    /api/experiences/:id

GET    /api/trips                    [auth]
POST   /api/trips                    [auth]
GET    /api/trips/:id                [auth]
PUT    /api/trips/:id                [auth]
DELETE /api/trips/:id                [auth]

POST   /api/trips/:tripId/items      [auth]
PUT    /api/trips/:tripId/items/:id  [auth]
DELETE /api/trips/:tripId/items/:id  [auth]

GET    /api/favorites                [auth]
POST   /api/favorites                [auth]
DELETE /api/favorites/:id            [auth]
DELETE /api/favorites                [auth]

GET    /api/bookings                 [auth]
POST   /api/bookings                 [auth]
DELETE /api/bookings/:id             [auth]
```

---

## Sample Data

Seeded destinations:
- 🇮🇳 Hyderabad, Goa, Jaipur, Manali, Kerala
- 🇮🇩 Bali
- 🇫🇷 Paris

Each destination includes 2 hotels, 1 holiday package, and 4 local experiences.

---

## Limitations

- No real payment processing (all bookings are simulated)
- Images load from Unsplash (requires internet connection)
- No email verification or password reset flow
- No real-time availability checking
- Maps integration not implemented (noted as "where practical" in spec)

---

## Demo Workflows

1. **Destination Discovery** → Home → Explore Destinations → click a destination card
2. **Hotel Comparison** → Hotels → check compare boxes on 2-3 hotels → Compare Now
3. **Itinerary Building** → Sign in → Trips → New Trip → Add activities per day
4. **Demo Booking** → Open any hotel/package/experience → Book → fill form → Confirm
5. **Favorites** → Heart icon on any card → Dashboard → Saved Favorites
