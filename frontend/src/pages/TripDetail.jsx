import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Plus, Trash2, Edit3, Clock, MapPin, Wallet,
  Calendar, Users, Check, X, GripVertical, Hotel, Package, Compass
} from 'lucide-react';
import {
  getTrip, addItineraryItem, updateItineraryItem, deleteItineraryItem, updateTrip
} from '../lib/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

function ItemForm({ tripId, dayNumber, item, onSave, onCancel }) {
  const [form, setForm] = useState(
    item || { day_number: dayNumber, item_type: 'custom', title: '', description: '', location: '', start_time: '', cost: 0, duration_hours: 0 }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { setError('Title is required.'); return; }
    setLoading(true);
    try {
      let res;
      if (item) {
        res = await updateItineraryItem(tripId, item.id, form);
      } else {
        res = await addItineraryItem(tripId, form);
      }
      onSave(res.data, !!item);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save item.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-50 rounded-xl p-4 border border-teal-200 space-y-3">
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Title *</label>
          <input type="text" required value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Activity name..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Type</label>
          <select value={form.item_type} onChange={(e) => setForm({ ...form, item_type: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none">
            <option value="custom">Custom</option>
            <option value="experience">Experience</option>
            <option value="hotel">Hotel</option>
            <option value="package">Package</option>
          </select>
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Day</label>
          <input type="number" min="1" value={form.day_number}
            onChange={(e) => setForm({ ...form, day_number: +e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Start Time</label>
          <input type="time" value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Duration (hours)</label>
          <input type="number" min="0" step="0.5" value={form.duration_hours}
            onChange={(e) => setForm({ ...form, duration_hours: +e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
        </div>
        <div>
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Estimated Cost (₹)</label>
          <input type="number" min="0" value={form.cost}
            onChange={(e) => setForm({ ...form, cost: +e.target.value })}
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Location</label>
          <input type="text" value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Address or area..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-semibold text-slate-600 uppercase mb-1 block">Notes / Description</label>
          <textarea value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2} placeholder="Travel notes..."
            className="w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm resize-none" />
        </div>
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={loading} className="btn-primary py-2 px-5 text-sm">
          {loading ? <span className="spinner !w-4 !h-4 border-2" /> : <><Check size={14} /> {item ? 'Update' : 'Add Item'}</>}
        </button>
        <button type="button" onClick={onCancel} className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-100 text-sm transition-all">
          <X size={14} />
        </button>
      </div>
    </form>
  );
}

const TYPE_ICON = { hotel: Hotel, package: Package, experience: Compass, custom: MapPin };
const TYPE_COLOR = { hotel: 'bg-blue-100 text-blue-700', package: 'bg-orange-100 text-orange-700', experience: 'bg-purple-100 text-purple-700', custom: 'bg-teal-100 text-teal-700' };

export default function TripDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [addingToDay, setAddingToDay] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const load = () => {
    setLoading(true);
    getTrip(id).then((r) => setTrip(r.data)).catch(() => navigate('/trips')).finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!user) navigate('/login');
    else load();
  }, [user, id]);

  const handleSave = (saved, isEdit) => {
    setTrip((prev) => {
      // Remove any tmp placeholders for this day, then add/update the real item
      const realItems = (prev.items || []).filter((i) => !String(i.id).startsWith('tmp-'));
      const items = isEdit
        ? realItems.map((i) => (i.id === saved.id ? saved : i))
        : [...realItems, saved];
      const totalCost = items.reduce((s, i) => s + i.cost, 0);
      return { ...prev, items, total_cost: totalCost };
    });
    setAddingToDay(null);
    setEditingItem(null);
  };

  const handleDelete = async (itemId) => {
    if (!confirm('Remove this item from the itinerary?')) return;
    await deleteItineraryItem(id, itemId);
    setTrip((prev) => {
      const items = prev.items.filter((i) => i.id !== itemId);
      return { ...prev, items, total_cost: items.reduce((s, i) => s + i.cost, 0) };
    });
  };

  if (loading || !trip) return <div className="pt-20"><LoadingSpinner message="Loading trip..." /></div>;

  // Group items by day (exclude temp placeholders)
  const realItems = (trip.items || []).filter((i) => !String(i.id).startsWith('tmp-'));
  const maxDay = realItems.length > 0 ? Math.max(...realItems.map((i) => i.day_number), 1) : 1;
  // Also include pending new days (from tmp items)
  const pendingDays = (trip.items || []).filter((i) => String(i.id).startsWith('tmp-')).map((i) => i.day_number);
  const allDayNumbers = [...new Set([...realItems.map(i => i.day_number), ...pendingDays, 1])].sort((a,b) => a-b);
  const days = Array.from({ length: Math.max(...allDayNumbers) }, (_, i) => i + 1);
  const itemsByDay = (day) => realItems.filter((i) => i.day_number === day).sort((a, b) => a.start_time.localeCompare(b.start_time));

  const nights = trip.start_date && trip.end_date
    ? Math.max(1, Math.ceil((new Date(trip.end_date) - new Date(trip.start_date)) / 86400000))
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 pt-16">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#0a1628] to-[#112952]">
        {trip.destination?.image_url && (
          <div className="relative h-40 overflow-hidden">
            <img src={trip.destination.image_url} alt="" className="w-full h-full object-cover opacity-30"
              onError={() => {}} />
          </div>
        )}
        <div className="max-w-5xl mx-auto px-4 py-6 -mt-8 relative z-10">
          <button onClick={() => navigate('/trips')} className="flex items-center gap-2 text-teal-300 hover:text-white mb-4 text-sm transition-colors">
            <ArrowLeft size={15} /> My Trips
          </button>
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-white">{trip.title}</h1>
              {trip.destination && (
                <p className="text-teal-300 text-sm flex items-center gap-1 mt-1">
                  <MapPin size={13} /> {trip.destination.name}, {trip.destination.country}
                </p>
              )}
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-slate-300">
              {trip.start_date && (
                <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                  <Calendar size={13} /> {trip.start_date}{trip.end_date && ` → ${trip.end_date}`}
                </div>
              )}
              <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                <Users size={13} /> {trip.travelers} traveler{trip.travelers > 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Budget Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Budget', value: `₹${(trip.total_cost || 0).toLocaleString()}`, icon: Wallet, color: 'text-teal-600' },
            { label: 'Activities', value: `${(trip.items || []).length}`, icon: Compass, color: 'text-purple-600' },
            { label: 'Days', value: `${days.length}`, icon: Calendar, color: 'text-orange-600' },
            { label: 'Per Traveler', value: `₹${trip.travelers > 0 ? Math.round((trip.total_cost || 0) / trip.travelers).toLocaleString() : 0}`, icon: Users, color: 'text-blue-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-4 shadow-sm text-center">
              <Icon size={20} className={`mx-auto mb-2 ${color}`} />
              <p className={`text-xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-slate-500">{label}</p>
            </div>
          ))}
        </div>

        {/* Itinerary */}
        <div className="space-y-6">
          {days.map((day) => {
            const dayItems = itemsByDay(day);
            const dayTotal = dayItems.reduce((s, i) => s + i.cost, 0);
            return (
              <div key={day} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="flex justify-between items-center px-5 py-4 bg-gradient-to-r from-slate-800 to-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold text-sm">
                      {day}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">
                        Day {day}
                        {trip.start_date && (
                          <span className="text-slate-400 text-xs ml-2 font-normal">
                            {new Date(new Date(trip.start_date).getTime() + (day - 1) * 86400000).toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                          </span>
                        )}
                      </h3>
                      {dayTotal > 0 && <p className="text-teal-400 text-xs">₹{dayTotal.toLocaleString()} estimated</p>}
                    </div>
                  </div>
                  <button
                    onClick={() => setAddingToDay(addingToDay === day ? null : day)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/20 hover:bg-teal-500/40 text-teal-300 rounded-lg text-xs font-medium transition-all"
                  >
                    <Plus size={13} /> Add Activity
                  </button>
                </div>

                <div className="p-4 space-y-3">
                  {addingToDay === day && (
                    <ItemForm
                      tripId={id}
                      dayNumber={day}
                      onSave={handleSave}
                      onCancel={() => setAddingToDay(null)}
                    />
                  )}

                  {dayItems.length === 0 && addingToDay !== day && (
                    <div className="text-center py-8 text-slate-400">
                      <p className="text-sm">No activities planned for Day {day}.</p>
                      <button onClick={() => setAddingToDay(day)} className="text-teal-500 hover:text-teal-600 text-sm font-medium mt-1">
                        + Add an activity
                      </button>
                    </div>
                  )}

                  {dayItems.map((item) => {
                    const Icon = TYPE_ICON[item.item_type] || MapPin;
                    return (
                      <div key={item.id}>
                        {editingItem === item.id ? (
                          <ItemForm
                            tripId={id}
                            dayNumber={day}
                            item={item}
                            onSave={handleSave}
                            onCancel={() => setEditingItem(null)}
                          />
                        ) : (
                          <div className="flex gap-3 p-3 border border-slate-100 rounded-xl hover:border-teal-200 hover:bg-teal-50/30 transition-all group">
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${TYPE_COLOR[item.item_type] || 'bg-teal-100 text-teal-700'}`}>
                              <Icon size={15} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="font-semibold text-slate-800 text-sm">{item.title}</p>
                                  {item.start_time && <p className="text-xs text-slate-500">🕐 {item.start_time} {item.duration_hours > 0 && `· ${item.duration_hours}h`}</p>}
                                  {item.location && <p className="text-xs text-slate-500">📍 {item.location}</p>}
                                  {item.description && <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{item.description}</p>}
                                </div>
                                <div className="text-right flex flex-col items-end gap-1 ml-2">
                                  {item.cost > 0 && (
                                    <p className="text-sm font-bold text-teal-600">₹{item.cost.toLocaleString()}</p>
                                  )}
                                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => setEditingItem(item.id)} className="p-1.5 text-slate-400 hover:text-teal-600 hover:bg-teal-50 rounded-lg transition-all">
                                      <Edit3 size={12} />
                                    </button>
                                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                      <Trash2 size={12} />
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* Add day */}
          <button
            onClick={() => {
              const newDay = maxDay + 1;
              // Add a temporary placeholder item so the new day renders
              const placeholder = { id: `tmp-${Date.now()}`, day_number: newDay, cost: 0, title: '', item_type: 'custom', start_time: '', location: '', description: '', duration_hours: 0 };
              setTrip((prev) => ({ ...prev, items: [...(prev.items || []), placeholder] }));
              setAddingToDay(newDay);
            }}
            className="w-full py-4 border-2 border-dashed border-slate-300 rounded-2xl text-slate-500 hover:border-teal-400 hover:text-teal-600 hover:bg-teal-50 transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={18} /> Add Day {maxDay + 1}
          </button>
        </div>

        {trip.notes && (
          <div className="mt-6 bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-2">Trip Notes</h3>
            <p className="text-slate-600 text-sm">{trip.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
