import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin, Clock, Wallet, Star, ArrowLeft, Heart,
  Hotel, Package, Compass, Plus, ChevronRight
} from 'lucide-react';
import { getDestination, getHotels, getPackages, getExperiences } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import StarRating from '../components/StarRating';
import FavoriteButton from '../components/FavoriteButton';
import { useAuth } from '../context/AuthContext';

export default function DestinationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dest, setDest] = useState(null);
  const [hotels, setHotels] = useState([]);
  const [packages, setPackages] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [imgIdx, setImgIdx] = useState(0);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getDestination(id),
      getHotels({ destination_id: id }),
      getPackages({ destination_id: id }),
      getExperiences({ destination_id: id }),
    ]).then(([d, h, p, e]) => {
      setDest(d.data);
      setHotels(h.data);
      setPackages(p.data);
      setExperiences(e.data);
    }).catch(() => navigate('/destinations'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="pt-20"><LoadingSpinner message="Loading destination..." /></div>;
  if (!dest) return null;

  const allImages = [dest.image_url, ...dest.gallery].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i);
  const tabs = ['overview', 'hotels', 'packages', 'experiences'];

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Hero */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={allImages[imgIdx]} alt={dest.name}
          className="w-full h-full object-cover transition-all duration-700"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&h=900&fit=crop'; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 flex items-center gap-2 glass text-white px-4 py-2 rounded-xl text-sm hover:bg-white/20 transition-all">
          <ArrowLeft size={16} /> Back
        </button>

        {/* Fav */}
        <div className="absolute top-4 right-4">
          <FavoriteButton type="destination" id={dest.id} />
        </div>

        {/* Gallery dots */}
        {allImages.length > 1 && (
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2">
            {allImages.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === imgIdx ? 'bg-white w-6' : 'bg-white/50'}`} />
            ))}
          </div>
        )}

        {/* Destination info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
          <div className="max-w-7xl mx-auto flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="flex gap-2 mb-2">
                {dest.tags.map((t) => (
                  <span key={t} className="px-3 py-1 bg-teal-500/80 text-white text-xs font-medium rounded-full">{t}</span>
                ))}
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold text-white mb-1">{dest.name}</h1>
              <p className="text-slate-300 text-lg flex items-center gap-2">
                <MapPin size={16} /> {dest.city}, {dest.country}
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <StarRating rating={dest.rating} size={18} />
              <div className="bg-white/10 backdrop-blur rounded-xl px-4 py-2 text-white text-center">
                <p className="text-2xl font-bold">₹{dest.est_budget.toLocaleString()}</p>
                <p className="text-xs text-slate-300">est. per person</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 sticky top-16 z-20">
        <div className="max-w-7xl mx-auto px-4 flex gap-6 overflow-x-auto">
          {tabs.map((t) => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={`py-4 px-2 text-sm font-medium border-b-2 capitalize transition-all whitespace-nowrap ${
                activeTab === t
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}>
              {t} {t === 'hotels' && hotels.length > 0 && `(${hotels.length})`}
              {t === 'packages' && packages.length > 0 && `(${packages.length})`}
              {t === 'experiences' && experiences.length > 0 && `(${experiences.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-3">About {dest.name}</h2>
                <p className="text-slate-600 leading-relaxed">{dest.description}</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Top Attractions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dest.attractions.map((a) => (
                    <div key={a} className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                      <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center flex-shrink-0">
                        <MapPin size={14} className="text-white" />
                      </div>
                      <span className="text-slate-700 text-sm font-medium">{a}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-4">Quick Info</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-teal-500" />
                    <div>
                      <p className="text-xs text-slate-500">Best Time to Visit</p>
                      <p className="text-sm font-medium text-slate-800">{dest.best_time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Wallet size={16} className="text-orange-500" />
                    <div>
                      <p className="text-xs text-slate-500">Estimated Budget</p>
                      <p className="text-sm font-medium text-slate-800">₹{dest.est_budget.toLocaleString()} per person</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Star size={16} className="text-amber-500" />
                    <div>
                      <p className="text-xs text-slate-500">Traveler Rating</p>
                      <p className="text-sm font-medium text-slate-800">{dest.rating} / 5</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick links */}
              <div className="bg-white rounded-2xl p-5 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-3">Explore More</h3>
                <div className="space-y-2">
                  <button onClick={() => setActiveTab('hotels')} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-teal-50 rounded-xl text-sm font-medium text-slate-700 transition-all">
                    <div className="flex items-center gap-2"><Hotel size={15} className="text-teal-500" /> Hotels ({hotels.length})</div>
                    <ChevronRight size={14} />
                  </button>
                  <button onClick={() => setActiveTab('packages')} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-teal-50 rounded-xl text-sm font-medium text-slate-700 transition-all">
                    <div className="flex items-center gap-2"><Package size={15} className="text-orange-500" /> Packages ({packages.length})</div>
                    <ChevronRight size={14} />
                  </button>
                  <button onClick={() => setActiveTab('experiences')} className="w-full flex items-center justify-between p-3 bg-slate-50 hover:bg-teal-50 rounded-xl text-sm font-medium text-slate-700 transition-all">
                    <div className="flex items-center gap-2"><Compass size={15} className="text-purple-500" /> Experiences ({experiences.length})</div>
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              <Link to="/trips" className="btn-primary w-full justify-center py-3">
                <Plus size={18} /> Plan a Trip Here
              </Link>
            </div>
          </div>
        )}

        {/* Hotels tab */}
        {activeTab === 'hotels' && (
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Hotels in {dest.name}</h2>
              <Link to={`/hotels?destination_id=${dest.id}`} className="text-teal-600 text-sm font-medium hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotels.map((h) => (
                <Link key={h.id} to={`/hotels/${h.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
                  <img src={h.image_url} alt={h.name} className="w-full h-44 object-cover"
                    onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop'; }} />
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 mb-1">{h.name}</h3>
                    <StarRating rating={h.rating} size={12} />
                    <p className="text-slate-500 text-xs mt-1 mb-3">{h.address}</p>
                    <div className="flex justify-between items-center">
                      <div><span className="text-lg font-bold text-teal-600">₹{h.price_per_night.toLocaleString()}</span><span className="text-xs text-slate-500">/night</span></div>
                      <span className="text-xs bg-teal-50 text-teal-700 px-2 py-1 rounded-full">View Hotel</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Packages tab */}
        {activeTab === 'packages' && (
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Packages for {dest.name}</h2>
              <Link to="/packages" className="text-teal-600 text-sm font-medium hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((p) => (
                <Link key={p.id} to={`/packages/${p.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
                  <div className="relative">
                    <img src={p.image_url} alt={p.title} className="w-full h-44 object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'; }} />
                    <span className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">{p.duration_days}D</span>
                  </div>
                  <div className="p-4">
                    <p className="text-teal-600 text-xs font-medium mb-1">{p.travel_style}</p>
                    <h3 className="font-bold text-slate-800 text-sm mb-2 line-clamp-2">{p.title}</h3>
                    <StarRating rating={p.rating} size={12} />
                    <p className="mt-2 text-lg font-bold text-slate-800">₹{p.price.toLocaleString()}<span className="text-xs font-normal text-slate-500"> per person</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Experiences tab */}
        {activeTab === 'experiences' && (
          <div className="fade-in">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Experiences in {dest.name}</h2>
              <Link to="/experiences" className="text-teal-600 text-sm font-medium hover:underline">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {experiences.map((exp) => (
                <Link key={exp.id} to={`/experiences/${exp.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden card-hover">
                  <div className="relative">
                    <img src={exp.image_url} alt={exp.title} className="w-full h-44 object-cover"
                      onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&h=600&fit=crop'; }} />
                    <span className="absolute top-2 left-2 bg-white/90 text-slate-700 text-xs font-semibold px-2 py-1 rounded-full capitalize">{exp.category}</span>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-slate-800 text-sm mb-1 line-clamp-2">{exp.title}</h3>
                    <p className="text-xs text-slate-500 mb-2">⏱ {exp.duration_hours}h · {exp.location}</p>
                    <StarRating rating={exp.rating} size={12} />
                    <p className="mt-2 text-lg font-bold text-slate-800">₹{exp.price.toLocaleString()}<span className="text-xs font-normal text-slate-500"> per person</span></p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
