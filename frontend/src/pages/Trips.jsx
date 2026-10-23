import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, MapPin, Calendar, Users, Trash2, Edit3, ArrowRight,
  Wallet, X, Check
} from 'lucide-react';
import { getTrips, createTrip, deleteTrip, getDestinations } from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';

function CreateTripModal({ onClose, onCreated }) {
  const [form, setForm] = useState({ title: '', destination_id: '', start_date: '', end_date: '', travelers: 1, notes: '' });
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getDestinations().then((r) => setDestinations(r.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.title || !form.destination_id) { setError('Title and destination are required.'); return; }
    setLoading(true);
    try {
      const res = await createTrip(form);
      onCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create trip.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        <div className="bg-gradient-to-r from-[#0a1628] to-[#0d9488] px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-white font-bold text-lg">✈️ Create New Trip</h2>
          <button onClick={onClose} className="text-white/70 hover:text-white"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <p className="text-red-500 text-sm bg-red-50 p-3 rounded-xl">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Trip Name *</label>
            <input type="text" required value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g., Goa Beach Getaway 2024"
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Destination *</label>
            <select required value={form.destination_id}
              onChange={(e) => setForm({ ...form, destination_id: e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all appearance-none">
              <option value="">Select destination...</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>{d.name}, {d.country}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Start Date</label>
              <input type="date" value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">End Date</label>
              <input type="date" value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Number of Travelers</label>
            <select value={form.travelers}
              onChange={(e) => setForm({ ...form, travelers: +e.target.value })}
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all">
              {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} Traveler{n>1?'s':''}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes (optional)</label>
            <textarea value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3} placeholder="Any special requirements or notes..."
              className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm resize-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center py-3">
              {loading ? <span className="spinner !w-4 !h-4 border-2" /> : <><Check size={16} /> Create Trip</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Trips() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = () => {
    setLoading(true);
    getTrips().then((r) => setTrips(r.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (user) load();
    else navigate('/login');
  }, [user]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!confirm('Delete this trip? This cannot be undone.')) return;
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#0d9488] pt-10 pb-16 px-4">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">My Trips</h1>
            <p className="text-teal-200 mt-1">Plan, track and manage your travel itineraries</p>
          </div>
          <button onClick={() => setShowCreate(true)} className="btn-secondary whitespace-nowrap">
            <Plus size={18} /> New Trip
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {loading ? (
          <LoadingSpinner message="Loading your trips..." />
        ) : trips.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MapPin size={32} className="text-teal-500" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">No trips yet</h3>
            <p className="text-slate-500 mb-6">Start planning your first adventure!</p>
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus size={18} /> Create Your First Trip
            </button>
          </div>
        ) : (
          <div className="space-y-4 fade-in">
            {trips.map((trip) => (
              <Link key={trip.id} to={`/trips/${trip.id}`}
                className="block bg-white rounded-2xl shadow-md overflow-hidden card-hover group">
                <div className="flex flex-col sm:flex-row">
                  {trip.destination?.image_url && (
                    <div className="sm:w-48 h-40 sm:h-auto flex-shrink-0">
                      <img src={trip.destination.image_url} alt="" className="w-full h-full object-cover"
                        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop'; }} />
                    </div>
                  )}
                  <div className="flex-1 p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 group-hover:text-teal-600 transition-colors">{trip.title}</h3>
                          {trip.destination && (
                            <p className="text-slate-500 text-sm flex items-center gap-1 mt-0.5">
                              <MapPin size={12} /> {trip.destination.name}, {trip.destination.country}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={(e) => handleDelete(trip.id, e)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete trip"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-600">
                        {trip.start_date && (
                          <div className="flex items-center gap-1">
                            <Calendar size={13} className="text-teal-500" />
                            {trip.start_date} {trip.end_date && `→ ${trip.end_date}`}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Users size={13} className="text-teal-500" /> {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-1">
                          <Wallet size={13} className="text-orange-500" /> ₹{(trip.total_cost || 0).toLocaleString()} estimated
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                      <span className="text-xs text-slate-400">{trip.items?.length || 0} itinerary items</span>
                      <span className="flex items-center gap-1 text-teal-600 text-sm font-semibold group-hover:gap-2 transition-all">
                        Open Planner <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <CreateTripModal
          onClose={() => setShowCreate(false)}
          onCreated={(trip) => { setShowCreate(false); navigate(`/trips/${trip.id}`); }}
        />
      )}
    </div>
  );
}
