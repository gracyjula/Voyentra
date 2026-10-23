import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, X, Clock, Users } from 'lucide-react';
import { getPackages } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';

const STYLES = ['All', 'Leisure', 'Adventure', 'Relaxation', 'Cultural', 'Honeymoon'];

export default function Packages() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [style, setStyle] = useState('All');
  const [filters, setFilters] = useState({ search: '', max_budget: '', max_duration: '', sort: 'rating' });

  const load = (f = filters, s = style) => {
    setLoading(true);
    const params = {};
    if (f.search) params.search = f.search;
    if (f.max_budget) params.max_budget = f.max_budget;
    if (f.max_duration) params.max_duration = f.max_duration;
    if (f.sort) params.sort = f.sort;
    if (s && s !== 'All') params.travel_style = s;
    getPackages(params).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleStyle = (s) => { setStyle(s); load(filters, s); };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-600 to-[#0a1628] pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Holiday Packages</h1>
          <p className="text-slate-300 text-lg mb-8">Curated trips for every travel style and budget</p>
          <form onSubmit={(e) => { e.preventDefault(); load(filters, style); }} className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                placeholder="Search packages..."
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm" />
            </div>
            <button type="submit" className="btn-secondary px-6 py-3">Search</button>
            <button type="button" onClick={() => setShowFilters(!showFilters)}
              className={`px-4 py-3 rounded-xl border transition-all ${showFilters ? 'bg-orange-500 border-orange-500 text-white' : 'border-white/30 text-white hover:bg-white/10'}`}>
              <SlidersHorizontal size={16} />
            </button>
          </form>
        </div>
      </div>

      {/* Style filter */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
          {STYLES.map((s) => (
            <button key={s} onClick={() => handleStyle(s)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                style === s ? 'bg-orange-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Advanced filters */}
      {showFilters && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Max Budget (₹)</label>
              <input type="number" placeholder="Any" value={filters.max_budget}
                onChange={(e) => setFilters({ ...filters, max_budget: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Max Duration (days)</label>
              <input type="number" placeholder="Any" value={filters.max_duration}
                onChange={(e) => setFilters({ ...filters, max_duration: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm" />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Sort By</label>
              <select value={filters.sort} onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm">
                <option value="rating">Best Rated</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="duration">Shortest First</option>
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button onClick={() => load(filters, style)} className="btn-secondary py-2 px-4 text-sm">Apply</button>
              <button onClick={() => { const f = { search: '', max_budget: '', max_duration: '', sort: 'rating' }; setFilters(f); setStyle('All'); load(f, 'All'); }}
                className="p-2 border border-slate-200 text-slate-500 rounded-xl hover:bg-slate-50"><X size={14} /></button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 text-sm">{loading ? '...' : `${items.length} package${items.length !== 1 ? 's' : ''} found`}</p>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading packages..." />
        ) : items.length === 0 ? (
          <EmptyState title="No packages found" message="Try adjusting filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {items.map((pkg) => (
              <div key={pkg.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
                <div className="relative h-52">
                  <img src={pkg.image_url} alt={pkg.title} className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-2 left-2 flex gap-2">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">{pkg.duration_days} Days</span>
                    <span className="bg-white/20 backdrop-blur text-white text-xs font-medium px-2 py-1 rounded-full">{pkg.travel_style}</span>
                  </div>
                  <div className="absolute top-2 right-2"><FavoriteButton type="package" id={pkg.id} /></div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-800 mb-2 line-clamp-2">{pkg.title}</h3>
                  <p className="text-slate-500 text-sm line-clamp-2 mb-3">{pkg.description}</p>
                  <StarRating rating={pkg.rating} />

                  {pkg.inclusions?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {pkg.inclusions.slice(0, 3).map((inc) => (
                        <span key={inc} className="text-xs bg-teal-50 text-teal-700 px-2 py-0.5 rounded-full">✓ {inc}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
                    <div>
                      <span className="text-xl font-bold text-slate-800">₹{pkg.price.toLocaleString()}</span>
                      <span className="text-xs text-slate-500"> per person</span>
                    </div>
                    <Link to={`/packages/${pkg.id}`}
                      className="px-4 py-2 bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 rounded-xl text-sm font-semibold transition-all">
                      View Details
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
