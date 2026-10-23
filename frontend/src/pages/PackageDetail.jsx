import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Clock, Users, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { getPackage } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

export default function PackageDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [expandedDay, setExpandedDay] = useState(0);

  useEffect(() => {
    getPackage(id).then((r) => setPkg(r.data)).catch(() => navigate('/packages')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner message="Loading package..." /></div>;
  if (!pkg) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero */}
      <div className="relative h-[45vh]">
        <img src={pkg.image_url} alt={pkg.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=700&fit=crop'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 flex items-center gap-2 glass text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-all">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="absolute top-4 right-4"><FavoriteButton type="package" id={pkg.id} /></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-2 mb-2">
              <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">{pkg.duration_days} Days</span>
              <span className="bg-white/20 backdrop-blur text-white text-xs px-3 py-1 rounded-full">{pkg.travel_style}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{pkg.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Overview */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">About this Package</h2>
                  <StarRating rating={pkg.rating} />
                </div>
              </div>
              <p className="text-slate-600 leading-relaxed">{pkg.description}</p>
            </div>

            {/* Inclusions */}
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 mb-4">What's Included</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {pkg.inclusions.map((inc) => (
                  <div key={inc} className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                    <div className="w-7 h-7 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                      <Check size={13} className="text-white" />
                    </div>
                    <span className="text-slate-700 text-sm">{inc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Itinerary */}
            {pkg.itinerary?.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Day-wise Itinerary</h2>
                <div className="space-y-3">
                  {pkg.itinerary.map((day, i) => (
                    <div key={i} className="border border-slate-200 rounded-xl overflow-hidden">
                      <button
                        onClick={() => setExpandedDay(expandedDay === i ? -1 : i)}
                        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 transition-all"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                            {day.day}
                          </div>
                          <span className="font-semibold text-slate-800">{day.title}</span>
                        </div>
                        {expandedDay === i ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                      </button>
                      {expandedDay === i && (
                        <div className="px-4 pb-4 text-sm text-slate-600 border-t border-slate-100 pt-3">
                          {day.details}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-20">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-slate-800">₹{pkg.price.toLocaleString()}</p>
                <p className="text-slate-500 text-sm">per person</p>
              </div>
              <div className="space-y-3 text-sm text-slate-600 mb-4">
                <div className="flex items-center gap-2"><Clock size={14} className="text-teal-500" /> {pkg.duration_days} days</div>
                <div className="flex items-center gap-2"><Users size={14} className="text-teal-500" /> {pkg.travel_style} style</div>
                {pkg.inclusions.slice(0, 3).map((inc) => (
                  <div key={inc} className="flex items-center gap-2"><Check size={14} className="text-teal-500" /> {inc}</div>
                ))}
              </div>
              <button onClick={() => { if (!user) navigate('/login'); else setShowBooking(true); }}
                className="btn-secondary w-full justify-center py-3">
                <Calendar size={16} /> Book Package
              </button>
              <p className="text-center text-xs text-slate-400 mt-2">🔒 Simulated demo booking</p>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal type="package" item={pkg} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
