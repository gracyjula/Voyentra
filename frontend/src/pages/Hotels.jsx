import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, CheckSquare, Square } from 'lucide-react';
import { getHotels } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';

const AMENITIES_LIST = ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Breakfast'];

export default function Hotels() {
  const [searchParams] = useSearchParams();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [compare, setCompare] = useState([]);

  const [filters, setFilters] = useState({
    search: '',
    min_price: '',
    max_price: '',
    min_rating: '',
    sort: 'rating',
    destination_id: searchParams.get('destination_id') || '',
  });

  const load = (f = filters) => {
    setLoading(true);
    const params = {};
    Object.entries(f).forEach(([k, v]) => { if (v) params[k] = v; });
    getHotels(params).then((r) => setHotels(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(filters); };

  const toggleCompare = (hotel) => {
    if (compare.find((h) => h.id === hotel.id)) {
      setCompare(compare.filter((h) => h.id !== hotel.id));
    } else if (compare.length < 3) {
      setCompare([...compare, hotel]);
    }
  };

  const AMENITY_BADGES = { 'Free WiFi': '📶', 'Pool': '🏊', 'Spa': '💆', 'Gym': '💪', 'Restaurant': '🍽️', 'Bar': '🍸', 'Breakfast': '🍳' };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#1a3a6b] pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Find Your Perfect Stay</h1>
          <p className="text-slate-300 text-lg mb-8">Browse hotels across all destinations</p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search hotel name..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-400 text-sm" />
            </div>
            <button type="submit" className="btn-primary px-6 py-3">Search</button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border transition-all flex items-center gap-2 text-sm ${showFilters ? 'bg-teal-500 border-teal-500 text-white' : 'border-white/30 text-white hover:bg-white/10'}`}>
              <SlidersHorizontal size={16} /> Filters
            </button>
          </form>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border-b border-slate-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Min Price / night</label>
              <input type="number" placeholder="₹0" value={filters.min_price}
                onChange={(e) => setFilters({ ...filters, min_price: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Max Price / night</label>
              <input type="number" placeholder="Any" value={filters.max_price}
                onChange={(e) => setFilters({ ...filters, max_price: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Min Rating</label>
              <select value={filters.min_rating} onChange={(e) => setFilters({ ...filters, min_rating: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm">
                <option value="">Any</option>
                <option value="3">3+</option>
                <option value="4">4+</option>
                <option value="4.5">4.5+</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-2 block">Sort By</label>
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm">
                <option value="rating">Best Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
              </select>
            </div>
            <div className="col-span-2 sm:col-span-4 flex gap-3">
              <button onClick={() => load(filters)} className="btn-primary py-2 px-6">Apply Filters</button>
              <button onClick={() => { const f = { search: '', min_price: '', max_price: '', min_rating: '', sort: 'rating', destination_id: '' }; setFilters(f); load(f); }}
                className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm transition-all flex items-center gap-1">
                <X size={14} /> Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Compare bar */}
      {compare.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-[#0a1628] border-t border-teal-500/30 z-40 py-3 px-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-white text-sm font-medium">Comparing {compare.length} hotels:</span>
              {compare.map((h) => (
                <span key={h.id} className="bg-white/10 text-white text-xs px-3 py-1 rounded-full">{h.name}</span>
              ))}
            </div>
            <div className="flex gap-3">
              <Link to={`/hotels/compare?ids=${compare.map((h) => h.id).join(',')}`}
                className="btn-primary py-2 px-4 text-sm">Compare Now</Link>
              <button onClick={() => setCompare([])} className="p-2 text-slate-400 hover:text-white"><X size={16} /></button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 text-sm">{loading ? '...' : `${hotels.length} hotel${hotels.length !== 1 ? 's' : ''} found`}</p>
          {!loading && hotels.length > 0 && (
            <p className="text-xs text-slate-400">Click compare (max 3) to see side-by-side</p>
          )}
        </div>

        {loading ? (
          <LoadingSpinner message="Searching hotels..." />
        ) : hotels.length === 0 ? (
          <EmptyState title="No hotels found" message="Try adjusting your filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {hotels.map((hotel) => {
              const inCompare = compare.find((h) => h.id === hotel.id);
              return (
                <div key={hotel.id} className={`bg-white rounded-2xl shadow-md overflow-hidden card-hover ${inCompare ? 'ring-2 ring-teal-400' : ''}`}>
                  <div className="relative h-52">
                    <img src={hotel.image_url} alt={hotel.name} className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'; }} />
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button onClick={() => toggleCompare(hotel)} title="Compare"
                        className={`p-2 rounded-full text-xs font-medium transition-all ${inCompare ? 'bg-teal-500 text-white' : 'bg-white/90 text-slate-500 hover:bg-teal-50'}`}>
                        {inCompare ? <CheckSquare size={15} /> : <Square size={15} />}
                      </button>
                      <FavoriteButton type="hotel" id={hotel.id} />
                    </div>
                  </div>
                  <div className="p-5">
                    <h3 className="font-bold text-slate-800 mb-1">{hotel.name}</h3>
                    <p className="text-xs text-slate-500 mb-2">📍 {hotel.address}</p>
                    <StarRating rating={hotel.rating} />
                    <div className="flex flex-wrap gap-1 mt-3">
                      {hotel.amenities.slice(0, 4).map((a) => (
                        <span key={a} className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                          {AMENITY_BADGES[a] || '✓'} {a}
                        </span>
                      ))}
                      {hotel.amenities.length > 4 && (
                        <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">+{hotel.amenities.length - 4} more</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                      <div>
                        <span className="text-xl font-bold text-teal-600">₹{hotel.price_per_night.toLocaleString()}</span>
                        <span className="text-xs text-slate-500">/night</span>
                      </div>
                      <Link to={`/hotels/${hotel.id}`}
                        className="px-4 py-2 bg-teal-50 hover:bg-teal-500 hover:text-white text-teal-600 rounded-xl text-sm font-semibold transition-all">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
