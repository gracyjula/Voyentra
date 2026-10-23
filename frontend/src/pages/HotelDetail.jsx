import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Wifi, Check, Calendar, Users, ShoppingBag } from 'lucide-react';
import { getHotel } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    getHotel(id)
      .then((r) => setHotel(r.data))
      .catch(() => navigate('/hotels'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner message="Loading hotel..." /></div>;
  if (!hotel) return null;

  const allImages = [hotel.image_url, ...(hotel.gallery || [])].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);

  const AMENITY_ICONS = {
    'Free WiFi': '📶', 'Pool': '🏊', 'Spa': '💆', 'Gym': '💪',
    'Restaurant': '🍽️', 'Bar': '🍸', 'Breakfast': '🍳',
    'Parking': '🅿️', 'Airport Shuttle': '🚌', 'Valet Parking': '🚗',
    'Bike Rental': '🚲',
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Gallery */}
      <div className="relative h-[50vh] bg-slate-800">
        <img src={allImages[imgIdx]} alt={hotel.name}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=700&fit=crop'; }} />
        <div className="absolute inset-0 bg-black/30" />
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 glass text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-all">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="absolute top-4 right-4"><FavoriteButton type="hotel" id={hotel.id} /></div>
        {allImages.length > 1 && (
          <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-6' : 'bg-white/50'}`} />
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            {allImages.map((img, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`flex-shrink-0 w-16 h-12 rounded-lg overflow-hidden ring-2 transition-all ${i === imgIdx ? 'ring-teal-500' : 'ring-transparent'}`}>
                <img src={img} alt="" className="w-full h-full object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop'; }} />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 mb-1">{hotel.name}</h1>
                  <p className="text-slate-500 flex items-center gap-1"><MapPin size={14} /> {hotel.address}</p>
                  {hotel.destination && (
                    <Link to={`/destinations/${hotel.destination.id}`} className="text-teal-600 text-sm hover:underline mt-1 inline-block">
                      {hotel.destination.name}, {hotel.destination.country}
                    </Link>
                  )}
                </div>
                <StarRating rating={hotel.rating} size={16} />
              </div>
              <p className="text-slate-600 mt-4 leading-relaxed">{hotel.description}</p>
            </div>

            {/* Amenities */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Amenities</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {hotel.amenities.map((a) => (
                  <div key={a} className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl">
                    <span className="text-lg">{AMENITY_ICONS[a] || '✓'}</span>
                    <span className="text-sm text-slate-700">{a}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Room Types */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Room Types</h2>
              <div className="space-y-3">
                {hotel.room_types.map((room) => (
                  <div key={room} className="flex justify-between items-center p-4 border border-slate-200 rounded-xl hover:border-teal-300 hover:bg-teal-50/30 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                        <ShoppingBag size={14} className="text-teal-600" />
                      </div>
                      <span className="font-medium text-slate-800">{room}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-teal-600">₹{hotel.price_per_night.toLocaleString()}</p>
                      <p className="text-xs text-slate-500">per night</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Booking card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-20">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-teal-600">₹{hotel.price_per_night.toLocaleString()}</p>
                <p className="text-slate-500 text-sm">per night</p>
              </div>
              <StarRating rating={hotel.rating} />
              <div className="mt-4 space-y-2 text-sm text-slate-600">
                {hotel.amenities.slice(0, 5).map((a) => (
                  <div key={a} className="flex items-center gap-2">
                    <Check size={14} className="text-teal-500" />
                    {a}
                  </div>
                ))}
              </div>
              <div className="mt-6 space-y-3">
                <button onClick={() => {
                  if (!user) navigate('/login');
                  else setShowBooking(true);
                }} className="btn-primary w-full justify-center py-3">
                  <Calendar size={16} /> Book This Hotel
                </button>
                <p className="text-center text-xs text-slate-400">🔒 Simulated demo booking — no real payment</p>
              </div>
            </div>

            {hotel.destination && (
              <Link to={`/destinations/${hotel.destination.id}`}
                className="block bg-gradient-to-br from-teal-500 to-teal-700 text-white rounded-2xl p-5 text-center hover:shadow-lg hover:shadow-teal-500/30 transition-all">
                <MapPin size={18} className="mx-auto mb-2" />
                <p className="font-bold">Explore {hotel.destination.name}</p>
                <p className="text-sm text-teal-100">View destination details →</p>
              </Link>
            )}
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal
          type="hotel"
          item={hotel}
          onClose={() => setShowBooking(false)}
        />
      )}
    </div>
  );
}
