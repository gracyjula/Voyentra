import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { ArrowLeft, Check, X, Star } from 'lucide-react';
import { getHotel } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';

const ALL_AMENITIES = ['Free WiFi', 'Pool', 'Spa', 'Gym', 'Restaurant', 'Bar', 'Breakfast', 'Airport Shuttle', 'Valet Parking', 'Bike Rental'];

export default function HotelCompare() {
  const [searchParams] = useSearchParams();
  const ids = searchParams.get('ids')?.split(',').filter(Boolean) || [];
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (ids.length === 0) { setLoading(false); return; }
    Promise.all(ids.map((id) => getHotel(id).then((r) => r.data)))
      .then(setHotels)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="pt-20"><LoadingSpinner message="Loading comparison..." /></div>;

  const presentAmenities = ALL_AMENITIES.filter((a) => hotels.some((h) => h.amenities?.includes(a)));

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      <div className="bg-gradient-to-br from-[#0a1628] to-[#1a3a6b] pt-10 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <Link to="/hotels" className="flex items-center gap-2 text-teal-300 hover:text-white mb-4 text-sm transition-colors">
            <ArrowLeft size={15} /> Back to Hotels
          </Link>
          <h1 className="text-4xl font-bold text-white">Hotel Comparison</h1>
          <p className="text-slate-300 mt-1">Comparing {hotels.length} hotels side by side</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 -mt-4">
        {hotels.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-500 mb-4">No hotels selected for comparison.</p>
            <Link to="/hotels" className="btn-primary">Browse Hotels</Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {/* Header with images */}
            <div className="grid fade-in" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
              <div className="p-4 bg-slate-50 border-b border-slate-200" />
              {hotels.map((h) => (
                <div key={h.id} className="border-l border-b border-slate-200">
                  <img src={h.image_url} alt={h.name} className="w-full h-44 object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop'; }} />
                  <div className="p-4">
                    <h3 className="font-bold text-slate-900 text-sm">{h.name}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{h.address}</p>
                    <StarRating rating={h.rating} size={12} />
                    <Link to={`/hotels/${h.id}`} className="mt-2 block text-center py-2 bg-teal-50 hover:bg-teal-500 hover:text-white text-teal-600 rounded-xl text-xs font-semibold transition-all">
                      View Hotel
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Price */}
            <div className="grid border-b border-slate-200 bg-teal-50" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
              <div className="p-4 font-semibold text-slate-700 text-sm flex items-center">Price per night</div>
              {hotels.map((h) => (
                <div key={h.id} className="p-4 border-l border-slate-200 text-center">
                  <p className="text-xl font-bold text-teal-600">₹{h.price_per_night.toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Rating */}
            <div className="grid border-b border-slate-200" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
              <div className="p-4 font-semibold text-slate-700 text-sm flex items-center bg-slate-50">Rating</div>
              {hotels.map((h) => (
                <div key={h.id} className="p-4 border-l border-slate-200 flex justify-center">
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    <span className="font-bold text-slate-800">{h.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Room types */}
            <div className="grid border-b border-slate-200" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
              <div className="p-4 font-semibold text-slate-700 text-sm flex items-start bg-slate-50">Room Types</div>
              {hotels.map((h) => (
                <div key={h.id} className="p-4 border-l border-slate-200">
                  {h.room_types?.map((r) => (
                    <p key={r} className="text-xs text-slate-600 py-0.5">• {r}</p>
                  ))}
                </div>
              ))}
            </div>

            {/* Amenities */}
            {presentAmenities.map((amenity, i) => (
              <div key={amenity} className={`grid border-b border-slate-200 ${i % 2 === 0 ? '' : 'bg-slate-50'}`}
                style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
                <div className="p-3 text-sm text-slate-700 flex items-center">{amenity}</div>
                {hotels.map((h) => (
                  <div key={h.id} className="p-3 border-l border-slate-200 flex justify-center items-center">
                    {h.amenities?.includes(amenity)
                      ? <Check size={18} className="text-teal-500" />
                      : <X size={18} className="text-slate-300" />
                    }
                  </div>
                ))}
              </div>
            ))}

            {/* Book buttons */}
            <div className="grid p-2" style={{ gridTemplateColumns: `200px repeat(${hotels.length}, 1fr)` }}>
              <div className="p-4 font-semibold text-slate-700 text-sm flex items-center bg-slate-50 rounded-l-xl">Book</div>
              {hotels.map((h) => (
                <div key={h.id} className="p-4 border-l border-slate-200">
                  <Link to={`/hotels/${h.id}`} className="btn-primary w-full justify-center py-2.5 text-sm">
                    Select Hotel
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
