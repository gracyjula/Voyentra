import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Calendar, Users, Wallet, Compass, Package, Hotel,
  Heart, BookOpen, Plus, ArrowRight, Star
} from 'lucide-react';
import { getTrips, getBookings, getFavorites } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    Promise.all([getTrips(), getBookings(), getFavorites()])
      .then(([t, b, f]) => {
        setTrips(t.data);
        setBookings(b.data);
        setFavorites(f.data);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return null;
  if (loading) return <div className="pt-20"><LoadingSpinner message="Loading dashboard..." /></div>;

  const totalBudget = trips.reduce((s, t) => s + (t.total_cost || 0), 0);

  const BOOKING_TYPE_ICON = { hotel: Hotel, package: Package, experience: Compass };
  const BOOKING_TYPE_COLOR = { hotel: 'bg-blue-100 text-blue-700', package: 'bg-orange-100 text-orange-700', experience: 'bg-purple-100 text-purple-700' };
  const FAV_TYPE_ICON = { destination: MapPin, hotel: Hotel, package: Package, experience: Compass };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#112952] px-4 pt-10 pb-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-teal-400 font-medium mb-1">Welcome back,</p>
          <h1 className="text-4xl font-bold text-white mb-1">{user.name} ✈️</h1>
          <p className="text-slate-400 text-sm">{user.email}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-8 pb-12">
        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Trips', value: trips.length, icon: Compass, color: 'from-teal-500 to-teal-600' },
            { label: 'Bookings', value: bookings.length, icon: BookOpen, color: 'from-orange-500 to-orange-600' },
            { label: 'Favorites', value: favorites.length, icon: Heart, color: 'from-red-500 to-red-600' },
            { label: 'Total Budget', value: `₹${(totalBudget / 1000).toFixed(0)}K`, icon: Wallet, color: 'from-purple-500 to-purple-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white shadow-md`}>
              <Icon size={22} className="mb-3 opacity-90" />
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm opacity-80">{label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* My Trips */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">My Trips</h2>
              <Link to="/trips" className="text-teal-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            {trips.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <Compass size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No trips yet. Start planning!</p>
                <Link to="/trips" className="btn-primary justify-center"><Plus size={16} /> Create Trip</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {trips.slice(0, 4).map((trip) => (
                  <Link key={trip.id} to={`/trips/${trip.id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm hover:shadow-md transition-all group">
                    <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                      {trip.destination?.image_url ? (
                        <img src={trip.destination.image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-teal-100 flex items-center justify-center">
                          <MapPin size={20} className="text-teal-500" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-slate-800 group-hover:text-teal-600 transition-colors truncate">{trip.title}</p>
                      <p className="text-xs text-slate-500">{trip.destination?.name} · {trip.items?.length || 0} activities</p>
                      <p className="text-xs font-medium text-teal-600">₹{(trip.total_cost || 0).toLocaleString()} est.</p>
                    </div>
                    <ArrowRight size={15} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Bookings */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Recent Bookings</h2>
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-full font-medium">Demo Only</span>
            </div>
            {bookings.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
                <BookOpen size={32} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 mb-4">No bookings yet.</p>
                <Link to="/hotels" className="text-teal-600 text-sm font-medium hover:underline">Browse hotels →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {bookings.slice(0, 4).map((b) => {
                  const Icon = BOOKING_TYPE_ICON[b.booking_type] || Hotel;
                  return (
                    <div key={b.id} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${BOOKING_TYPE_COLOR[b.booking_type] || 'bg-slate-100 text-slate-700'}`}>
                        <Icon size={18} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 truncate">{b.title}</p>
                        <p className="text-xs text-slate-500 capitalize">{b.booking_type} · {b.guests} guest{b.guests > 1 ? 's' : ''}</p>
                        <p className="text-xs font-bold text-teal-600">₹{b.total_price?.toLocaleString()}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">✓ Confirmed</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-900">Saved Favorites</h2>
              <Link to="/favorites" className="text-teal-600 text-sm font-medium hover:underline flex items-center gap-1">
                View all <ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {favorites.slice(0, 4).map((fav) => {
                const Icon = FAV_TYPE_ICON[fav.item_type] || Heart;
                return (
                  <div key={fav.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                    {fav.item?.image_url && (
                      <img src={fav.item.image_url} alt="" className="w-full h-28 object-cover" />
                    )}
                    <div className="p-3">
                      <p className="font-semibold text-slate-800 text-sm line-clamp-2">
                        {fav.item?.name || fav.item?.title || '—'}
                      </p>
                      <p className="text-xs text-teal-600 capitalize mt-0.5">{fav.item_type}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { to: '/destinations', label: 'Explore Destinations', icon: MapPin, color: 'from-teal-500 to-teal-600' },
              { to: '/hotels', label: 'Find Hotels', icon: Hotel, color: 'from-blue-500 to-blue-600' },
              { to: '/packages', label: 'Holiday Packages', icon: Package, color: 'from-orange-500 to-orange-600' },
              { to: '/trips', label: 'Plan a Trip', icon: Compass, color: 'from-purple-500 to-purple-600' },
            ].map(({ to, label, icon: Icon, color }) => (
              <Link key={to} to={to}
                className={`bg-gradient-to-br ${color} rounded-2xl p-5 text-white hover:shadow-lg hover:scale-105 transition-all`}>
                <Icon size={22} className="mb-2" />
                <p className="text-sm font-semibold">{label}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
