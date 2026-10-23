import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Search, MapPin, Calendar, Users, Compass, Star,
  ArrowRight, ChevronRight, Globe, Shield, Clock, Zap
} from 'lucide-react';
import { getDestinations, getHotels, getPackages, getExperiences } from '../lib/api';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';

const HERO_BG = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop';

export default function Home() {
  const navigate = useNavigate();
  const [search, setSearch] = useState({ destination: '', startDate: '', endDate: '', travelers: 1 });
  const [destinations, setDestinations] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [packages, setPackages] = useState([]);
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    getDestinations().then((r) => setDestinations(r.data.slice(0, 6)));
    getHotels({ sort: 'rating' }).then((r) => setHotels(r.data.slice(0, 4)));
    getPackages({ sort: 'rating' }).then((r) => setPackages(r.data.slice(0, 4)));
    getExperiences({ sort: 'rating' }).then((r) => setExperiences(r.data.slice(0, 4)));
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search.destination) params.set('search', search.destination);
    navigate(`/destinations?${params.toString()}`);
  };

  const formatCurrency = (n) =>
    n >= 1000 ? `₹${(n / 1000).toFixed(0)}K` : `₹${n}`;

  return (
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{ backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <div className="absolute inset-0 hero-overlay" />
        {/* Floating decorative orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-16">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-teal-300 text-sm font-medium mb-6 animate-pulse">
            <Zap size={14} className="fill-current" />
            <span>✈️ Plan smarter. Travel better.</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight mb-6 fade-in">
            Your Journey,{' '}
            <span className="gradient-text">Beautifully Planned.</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Discover destinations, compare hotels, explore holiday packages, and create perfect itineraries — all in one beautiful platform.
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto">
            <form onSubmit={handleSearch}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div className="relative col-span-1 sm:col-span-2 lg:col-span-1">
                  <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
                  <input
                    type="text"
                    placeholder="Where to? (City or Country)"
                    value={search.destination}
                    onChange={(e) => setSearch({ ...search, destination: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
                  <input
                    type="date"
                    value={search.startDate}
                    onChange={(e) => setSearch({ ...search, startDate: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                </div>
                <div className="relative">
                  <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
                  <input
                    type="date"
                    value={search.endDate}
                    onChange={(e) => setSearch({ ...search, endDate: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                  />
                </div>
                <div className="relative">
                  <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500" />
                  <select
                    value={search.travelers}
                    onChange={(e) => setSearch({ ...search, travelers: e.target.value })}
                    className="w-full pl-9 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                      <option key={n} value={n}>{n} Traveler{n > 1 ? 's' : ''}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="submit" className="btn-primary flex-1 justify-center text-base py-3">
                  <Search size={18} /> Explore Destinations
                </button>
                <Link to="/trips" className="btn-secondary px-6 py-3">
                  Plan My Trip
                </Link>
              </div>
            </form>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-10">
            {[
              { label: '7+ Destinations', icon: Globe },
              { label: 'Verified Hotels', icon: Shield },
              { label: 'Quick Booking', icon: Clock },
            ].map(({ label, icon: Icon }) => (
              <div key={label} className="flex items-center gap-2 text-slate-300 text-sm">
                <Icon size={16} className="text-teal-400" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-white/60 rounded-full" />
          </div>
        </div>
      </section>

      {/* ─── FEATURED DESTINATIONS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Explore the World</p>
            <h2 className="text-4xl font-bold text-slate-900">Featured Destinations</h2>
          </div>
          <Link to="/destinations" className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm">
            View all <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              to={`/destinations/${dest.id}`}
              className="group relative overflow-hidden rounded-2xl shadow-md card-hover"
            >
              <div className="relative h-72">
                <img
                  src={dest.image_url}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => { e.target.src = `https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop`; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                <div className="absolute top-3 right-3">
                  <FavoriteButton type="destination" id={dest.id} />
                </div>
                <div className="absolute top-3 left-3">
                  <div className="flex gap-1">
                    {dest.tags.slice(0, 2).map((tag) => (
                      <span key={tag} className="px-2 py-0.5 bg-white/20 backdrop-blur text-white text-xs rounded-full">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex justify-between items-end">
                    <div>
                      <h3 className="text-white text-xl font-bold">{dest.name}</h3>
                      <p className="text-slate-300 text-sm">{dest.city}, {dest.country}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">{formatCurrency(dest.est_budget)}</p>
                      <p className="text-slate-300 text-xs">est. per person</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map(n => (
                      <Star key={n} size={12} className={n <= Math.round(dest.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-400'} />
                    ))}
                    <span className="text-slate-300 text-xs ml-1">{dest.rating}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── WHY VOYENTRA ─── */}
      <section className="py-16 bg-gradient-to-br from-slate-900 to-[#0d1f3c]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Voyentra?</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Everything you need for the perfect trip, all in one place.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Search, title: 'Smart Discovery', desc: 'Find destinations, hotels, and experiences with powerful filters.' },
              { icon: Compass, title: 'Itinerary Builder', desc: 'Create day-by-day plans with cost tracking and travel notes.' },
              { icon: Star, title: 'Curated Packages', desc: 'Pre-built holiday packages for every travel style and budget.' },
              { icon: Shield, title: 'Secure Booking', desc: 'Simulated booking workflow with clear demo labels throughout.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 transition-all text-center group">
                <div className="w-12 h-12 bg-teal-500/20 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500/30 transition-all">
                  <Icon size={22} className="text-teal-400" />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── POPULAR HOTELS ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Stay in Style</p>
            <h2 className="text-4xl font-bold text-slate-900">Popular Hotels</h2>
          </div>
          <Link to="/hotels" className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <Link key={hotel.id} to={`/hotels/${hotel.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
              <div className="relative h-48">
                <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'; }} />
                <div className="absolute top-2 right-2">
                  <FavoriteButton type="hotel" id={hotel.id} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{hotel.name}</h3>
                <StarRating rating={hotel.rating} size={12} />
                <div className="flex justify-between items-center mt-3">
                  <div>
                    <span className="text-lg font-bold text-teal-600">₹{hotel.price_per_night.toLocaleString()}</span>
                    <span className="text-xs text-slate-500">/night</span>
                  </div>
                  <span className="text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded-full">
                    {hotel.amenities.length} amenities
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── HOLIDAY PACKAGES ─── */}
      <section className="py-20 bg-gradient-to-br from-teal-50 to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Ready-Made Trips</p>
              <h2 className="text-4xl font-bold text-slate-900">Holiday Packages</h2>
            </div>
            <Link to="/packages" className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm">
              View all <ChevronRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Link key={pkg.id} to={`/packages/${pkg.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
                <div className="relative h-48">
                  <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'; }} />
                  <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                    {pkg.duration_days}D Trip
                  </div>
                  <div className="absolute top-2 right-2">
                    <FavoriteButton type="package" id={pkg.id} />
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-xs text-teal-600 font-medium mb-1">{pkg.travel_style}</p>
                  <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2">{pkg.title}</h3>
                  <StarRating rating={pkg.rating} size={12} />
                  <div className="mt-3">
                    <span className="text-lg font-bold text-slate-800">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500"> per person</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOCAL EXPERIENCES ─── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-teal-600 font-semibold text-sm uppercase tracking-wider mb-2">Immerse Yourself</p>
            <h2 className="text-4xl font-bold text-slate-900">Local Experiences</h2>
          </div>
          <Link to="/experiences" className="flex items-center gap-1 text-teal-600 hover:text-teal-700 font-medium text-sm">
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <Link key={exp.id} to={`/experiences/${exp.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
              <div className="relative h-48">
                <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop'; }} />
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur text-slate-700 text-xs font-semibold px-2 py-1 rounded-full capitalize">
                  {exp.category}
                </div>
                <div className="absolute top-2 right-2">
                  <FavoriteButton type="experience" id={exp.id} />
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{exp.title}</h3>
                <p className="text-xs text-slate-500 mb-2">⏱ {exp.duration_hours}h experience</p>
                <StarRating rating={exp.rating} size={12} />
                <div className="mt-3">
                  <span className="text-lg font-bold text-slate-800">₹{exp.price.toLocaleString()}</span>
                  <span className="text-xs text-slate-500"> per person</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="py-20 animated-gradient">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Plan Your Dream Trip?</h2>
          <p className="text-slate-300 text-lg mb-8">Join thousands of travelers who plan smarter with Voyentra.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="btn-secondary text-base py-4 px-8 justify-center">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/destinations" className="glass text-white font-semibold py-4 px-8 rounded-xl hover:bg-white/20 transition-all inline-flex items-center gap-2 justify-center">
              <Globe size={18} /> Explore Destinations
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
