import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, Check, Calendar } from 'lucide-react';
import { getExperience } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';
import BookingModal from '../components/BookingModal';
import { useAuth } from '../context/AuthContext';

const CAT_COLOR = { sightseeing: 'bg-blue-100 text-blue-700', food: 'bg-orange-100 text-orange-700', adventure: 'bg-red-100 text-red-700', cultural: 'bg-purple-100 text-purple-700', guided: 'bg-teal-100 text-teal-700' };
const CAT_EMOJI = { sightseeing: '🏛️', food: '🍜', adventure: '🧗', cultural: '🎭', guided: '🗺️' };

export default function ExperienceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    getExperience(id).then((r) => setExp(r.data)).catch(() => navigate('/experiences')).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner message="Loading experience..." /></div>;
  if (!exp) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero */}
      <div className="relative h-[45vh]">
        <img src={exp.image_url} alt={exp.title}
          className="w-full h-full object-cover"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600&h=700&fit=crop'; }} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 flex items-center gap-2 glass text-white px-4 py-2 rounded-xl text-sm">
          <ArrowLeft size={16} /> Back
        </button>
        <div className="absolute top-4 right-4"><FavoriteButton type="experience" id={exp.id} /></div>
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="max-w-7xl mx-auto">
            <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize mb-3 inline-block ${CAT_COLOR[exp.category] || 'bg-slate-100 text-slate-700'}`}>
              {CAT_EMOJI[exp.category]} {exp.category}
            </span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white">{exp.title}</h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <MapPin size={14} className="text-teal-500" /> {exp.location}
                </div>
                <div className="flex items-center gap-2 text-slate-600 text-sm">
                  <Clock size={14} className="text-teal-500" /> {exp.duration_hours} hours
                </div>
              </div>
              <StarRating rating={exp.rating} />
              <p className="text-slate-600 leading-relaxed mt-4">{exp.description}</p>
            </div>

            {exp.destination && (
              <div className="bg-teal-50 rounded-2xl p-5">
                <p className="text-teal-800 font-semibold mb-1">📍 Located in {exp.destination.name}</p>
                <p className="text-teal-600 text-sm">{exp.destination.city}, {exp.destination.country}</p>
              </div>
            )}
          </div>

          <div>
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-20">
              <div className="text-center mb-4">
                <p className="text-3xl font-bold text-slate-800">₹{exp.price.toLocaleString()}</p>
                <p className="text-slate-500 text-sm">per person</p>
              </div>
              <div className="space-y-2 text-sm text-slate-600 mb-6">
                <div className="flex items-center gap-2"><Clock size={14} className="text-teal-500" /> {exp.duration_hours} hour experience</div>
                <div className="flex items-center gap-2"><MapPin size={14} className="text-teal-500" /> {exp.location}</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-teal-500" /> Expert guide included</div>
                <div className="flex items-center gap-2"><Check size={14} className="text-teal-500" /> Small group size</div>
              </div>
              <button onClick={() => { if (!user) navigate('/login'); else setShowBooking(true); }}
                className="btn-primary w-full justify-center py-3">
                <Calendar size={16} /> Book Experience
              </button>
              <p className="text-center text-xs text-slate-400 mt-2">🔒 Simulated demo booking</p>
            </div>
          </div>
        </div>
      </div>

      {showBooking && (
        <BookingModal type="experience" item={exp} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
