import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Clock } from 'lucide-react';
import { getExperiences } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';

const CATEGORIES = ['All', 'sightseeing', 'food', 'adventure', 'cultural', 'guided'];
const CAT_EMOJI = { sightseeing: '🏛️', food: '🍜', adventure: '🧗', cultural: '🎭', guided: '🗺️' };
const CAT_COLOR = { sightseeing: 'bg-blue-100 text-blue-700', food: 'bg-orange-100 text-orange-700', adventure: 'bg-red-100 text-red-700', cultural: 'bg-purple-100 text-purple-700', guided: 'bg-teal-100 text-teal-700' };

export default function Experiences() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const [filters, setFilters] = useState({ search: '', max_price: '', sort: 'rating' });
  const [showFilters, setShowFilters] = useState(false);

  const load = (f = filters, cat = category) => {
    setLoading(true);
    const params = {};
    if (f.search) params.search = f.search;
    if (f.max_price) params.max_price = f.max_price;
    if (f.sort) params.sort = f.sort;
    if (cat && cat !== 'All') params.category = cat;
    getExperiences(params).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleCat = (c) => { setCategory(c); load(filters, c); };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-900 to-[#0a1628] pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Local Experiences</h1>
          <p className="text-slate-300 text-lg mb-8">Immerse yourself in authentic local culture and adventure</p>
          <form onSubmit={(e) => { e.preventDefault(); load(filters, category); }} className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search experiences..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400 text-sm" />
            </div>
            <button type="submit" className="px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-semibold transition-all text-sm">Search</button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border transition-all ${showFilters ? 'bg-purple-600 border-purple-600 text-white' : 'border-white/30 text-white hover:bg-white/10'}`}>
              <SlidersHorizontal size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Category filter */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {CATEGORIES.map((c) => (
            <button key={c} onClick={() => handleCat(c)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-all capitalize ${
                category === c ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {c !== 'All' && CAT_EMOJI[c]} {c}
            </button>
          ))}
        </div>
      </div>

      {showFilters && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-5 flex flex-wrap gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Max Price (₹)</label>
              <input type="number" placeholder="Any" value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm w-36" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Sort By</label>
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="px-3 py-2 border border-slate-200 rounded-xl text-sm">
                <option value="rating">Best Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => load(filters, category)} className="px-4 py-2 bg-purple-600 text-white rounded-xl text-sm hover:bg-purple-500 transition-all">Apply</button>
              <button onClick={() => { const f = { search: '', max_price: '', sort: 'rating' }; setFilters(f); setCategory('All'); load(f, 'All'); }}
                className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50"><X size={14} /></button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <p className="text-slate-600 text-sm mb-6">{loading ? '...' : `${items.length} experience${items.length !== 1 ? 's' : ''} found`}</p>

        {loading ? (
          <LoadingSpinner message="Loading experiences..." />
        ) : items.length === 0 ? (
          <EmptyState title="No experiences found" message="Try adjusting filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 fade-in">
            {items.map((exp) => (
              <div key={exp.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
                <div className="relative h-48">
                  <img src={exp.image_url} alt={exp.title} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop'; }} />
                  <div className="absolute top-2 left-2">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${CAT_COLOR[exp.category] || 'bg-slate-100 text-slate-700'}`}>
                      {CAT_EMOJI[exp.category]} {exp.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2"><FavoriteButton type="experience" id={exp.id} /></div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{exp.title}</h3>
                  <p className="text-xs text-slate-500 mb-1">📍 {exp.location}</p>
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                    <Clock size={12} /> {exp.duration_hours}h experience
                  </div>
                  <StarRating rating={exp.rating} size={12} />
                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-100">
                    <div>
                      <span className="font-bold text-slate-800">₹{exp.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-500">/person</span>
                    </div>
                    <Link to={`/experiences/${exp.id}`}
                      className="px-3 py-1.5 bg-purple-50 hover:bg-purple-600 hover:text-white text-purple-700 rounded-xl text-xs font-semibold transition-all">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
