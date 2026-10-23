import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, SlidersHorizontal, MapPin, Star, X } from 'lucide-react';
import { getDestinations } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import FavoriteButton from '../components/FavoriteButton';
import StarRating from '../components/StarRating';

const TAGS = ['All', 'Beach', 'Heritage', 'Mountains', 'City', 'Nature', 'Adventure', 'Culture', 'Food', 'Romance'];

export default function Destinations() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [tag, setTag] = useState('');
  const [view, setView] = useState('grid'); // grid | list

  const load = (s = search, t = tag === 'All' ? '' : tag) => {
    setLoading(true);
    getDestinations({ search: s || undefined, tag: t || undefined })
      .then((r) => setItems(r.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => { e.preventDefault(); load(search, tag === 'All' ? '' : tag); };

  const handleTag = (t) => {
    const next = t === 'All' ? '' : t;
    setTag(t);
    load(search, next);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#0d9488] pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-white mb-4">Explore Destinations</h1>
          <p className="text-slate-300 text-lg mb-8">Discover amazing places across India and the world</p>
          <form onSubmit={handleSearch} className="flex gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text" value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search city, country, or destination..."
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-white/20 bg-white/10 text-white placeholder:text-slate-400 focus:bg-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400 transition-all text-sm"
              />
            </div>
            <button type="submit" className="btn-primary px-6 py-3">Search</button>
          </form>
        </div>
      </div>

      {/* Tags filter */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => handleTag(t)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                (t === 'All' && !tag) || tag === t
                  ? 'bg-teal-500 text-white shadow-sm shadow-teal-500/40'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
          {(search || (tag && tag !== 'All')) && (
            <button onClick={() => { setSearch(''); setTag(''); load('', ''); }}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm text-red-500 bg-red-50 hover:bg-red-100 transition-all">
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Results count */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-slate-600 text-sm">
            {loading ? '...' : `${items.length} destination${items.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {loading ? (
          <LoadingSpinner message="Discovering destinations..." />
        ) : items.length === 0 ? (
          <EmptyState title="No destinations found" message="Try a different search or remove filters." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 fade-in">
            {items.map((dest) => (
              <div key={dest.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover group">
                <div className="relative h-56">
                  <img
                    src={dest.image_url} alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute top-3 right-3">
                    <FavoriteButton type="destination" id={dest.id} />
                  </div>
                  <div className="absolute top-3 left-3 flex gap-1 flex-wrap">
                    {dest.tags.slice(0, 2).map((t) => (
                      <span key={t} className="px-2 py-0.5 bg-white/20 backdrop-blur text-white text-xs rounded-full">{t}</span>
                    ))}
                  </div>
                  <div className="absolute bottom-3 left-4 right-4 flex justify-between items-end">
                    <div>
                      <h3 className="text-white font-bold text-lg leading-tight">{dest.name}</h3>
                      <p className="text-slate-300 text-sm flex items-center gap-1">
                        <MapPin size={12} /> {dest.city}, {dest.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-bold">₹{(dest.est_budget / 1000).toFixed(0)}K</p>
                      <p className="text-slate-300 text-xs">per person</p>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-slate-600 text-sm line-clamp-2 mb-3">{dest.description}</p>
                  <div className="flex items-center justify-between">
                    <StarRating rating={dest.rating} />
                    <Link
                      to={`/destinations/${dest.id}`}
                      className="text-teal-600 hover:text-teal-700 text-sm font-semibold flex items-center gap-1"
                    >
                      Explore →
                    </Link>
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-100">
                    <p className="text-xs text-slate-500">
                      <span className="font-medium text-slate-700">Best time:</span> {dest.best_time}
                    </p>
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
