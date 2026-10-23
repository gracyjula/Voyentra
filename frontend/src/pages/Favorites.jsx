import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Hotel, Package, Compass, Trash2 } from 'lucide-react';
import { getFavorites, removeFavorite } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { useFavorites } from '../context/FavoritesContext';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StarRating from '../components/StarRating';

const TYPE_PATHS = { destination: '/destinations', hotel: '/hotels', package: '/packages', experience: '/experiences' };
const TYPE_ICON = { destination: MapPin, hotel: Hotel, package: Package, experience: Compass };

export default function Favorites() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { reload } = useFavorites();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  const load = () => {
    if (!user) return;
    setLoading(true);
    getFavorites().then((r) => setFavorites(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    load();
  }, [user]);

  const handleRemove = async (fav) => {
    await removeFavorite(fav.id);
    setFavorites((prev) => prev.filter((f) => f.id !== fav.id));
    reload();
  };

  const filtered = filter === 'all' ? favorites : favorites.filter((f) => f.item_type === filter);
  const counts = favorites.reduce((acc, f) => ({ ...acc, [f.item_type]: (acc[f.item_type] || 0) + 1 }), {});

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-gradient-to-br from-red-900 to-[#0a1628] pt-10 pb-16 px-4">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Heart size={32} className="text-red-400 fill-red-400" />
          <div>
            <h1 className="text-4xl font-bold text-white">Saved Favorites</h1>
            <p className="text-slate-300 mt-1">{favorites.length} item{favorites.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-5xl mx-auto px-4 flex gap-2 overflow-x-auto py-3">
          {[
            { key: 'all', label: `All (${favorites.length})` },
            { key: 'destination', label: `Destinations (${counts.destination || 0})`, icon: MapPin },
            { key: 'hotel', label: `Hotels (${counts.hotel || 0})`, icon: Hotel },
            { key: 'package', label: `Packages (${counts.package || 0})`, icon: Package },
            { key: 'experience', label: `Experiences (${counts.experience || 0})`, icon: Compass },
          ].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                filter === key ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <LoadingSpinner message="Loading favorites..." />
        ) : filtered.length === 0 ? (
          <EmptyState
            title="No saved items"
            message="Browse destinations, hotels, packages and experiences to save your favorites."
            icon={Heart}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
            {filtered.map((fav) => {
              const Icon = TYPE_ICON[fav.item_type] || Heart;
              const basePath = TYPE_PATHS[fav.item_type] || '/';
              const item = fav.item;
              if (!item) return null;

              return (
                <div key={fav.id} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover group relative">
                  <Link to={`${basePath}/${item.id}`}>
                    {item.image_url && (
                      <img src={item.image_url} alt={item.name || item.title} className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'; }} />
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="bg-white/90 backdrop-blur text-slate-700 text-xs font-medium px-2 py-1 rounded-full capitalize flex items-center gap-1">
                        <Icon size={11} /> {fav.item_type}
                      </span>
                    </div>
                  </Link>

                  <button
                    onClick={() => handleRemove(fav)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-md transition-all"
                    title="Remove from favorites"
                  >
                    <Trash2 size={14} />
                  </button>

                  <div className="p-4">
                    <Link to={`${basePath}/${item.id}`}>
                      <h3 className="font-bold text-slate-800 hover:text-teal-600 transition-colors">
                        {item.name || item.title}
                      </h3>
                    </Link>

                    {item.rating && <StarRating rating={item.rating} size={12} />}

                    <div className="flex justify-between items-center mt-2 text-sm">
                      {(item.price_per_night || item.price) && (
                        <span className="font-bold text-teal-600">
                          ₹{(item.price_per_night || item.price)?.toLocaleString()}
                          {item.price_per_night ? '/night' : '/person'}
                        </span>
                      )}
                      {item.est_budget && (
                        <span className="font-bold text-teal-600">₹{(item.est_budget / 1000).toFixed(0)}K est.</span>
                      )}
                      <Link to={`${basePath}/${item.id}`} className="text-teal-600 text-xs font-semibold hover:underline">
                        View →
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
