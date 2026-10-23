import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Calendar, Users, CreditCard, CheckCircle, AlertTriangle } from 'lucide-react';
import { createBooking } from '../lib/api';
import { useAuth } from '../context/AuthContext';

export default function BookingModal({ type, item, onClose }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1); // 1=details, 2=confirm, 3=done
  const [form, setForm] = useState({ check_in: '', check_out: '', guests: 1, trip_id: '' });
  const [loading, setLoading] = useState(false);
  const [booking, setBooking] = useState(null);
  const [error, setError] = useState('');

  const pricePerNight = item.price_per_night || item.price || 0;
  const nights = form.check_in && form.check_out
    ? Math.max(1, Math.ceil((new Date(form.check_out) - new Date(form.check_in)) / 86400000))
    : (item.duration_days || 1);
  const totalPrice = type === 'hotel'
    ? pricePerNight * nights * form.guests
    : pricePerNight * form.guests;

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await createBooking({
        booking_type: type,
        ref_id: item.id,
        title: item.name || item.title,
        check_in: form.check_in || null,
        check_out: form.check_out || null,
        guests: form.guests,
        total_price: totalPrice,
      });
      setBooking(res.data);
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0a1628] to-[#0d9488] px-6 py-4 flex justify-between items-center">
          <div>
            <p className="text-teal-300 text-xs font-medium uppercase tracking-wider">
              {step === 3 ? 'Booking Confirmed' : 'Simulated Demo Booking'}
            </p>
            <h2 className="text-white font-bold text-lg">
              {step === 3 ? '🎉 All Set!' : `Book ${type === 'hotel' ? 'Hotel' : type === 'package' ? 'Package' : 'Experience'}`}
            </h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* Demo notice */}
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-xs mb-5">
            <AlertTriangle size={14} className="flex-shrink-0 mt-0.5" />
            <span>This is a <strong>simulated demo booking</strong>. No real reservation or payment occurs.</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              {/* Item summary */}
              <div className="flex gap-3 p-3 bg-slate-50 rounded-xl">
                <img src={item.image_url} alt="" className="w-16 h-12 rounded-lg object-cover"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=200&h=150&fit=crop'; }} />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">{item.name || item.title}</p>
                  <p className="text-slate-500 text-xs">₹{pricePerNight.toLocaleString()} {type === 'hotel' ? '/night' : '/person'}</p>
                </div>
              </div>

              {type === 'hotel' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Check-in</label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" value={form.check_in} onChange={(e) => setForm({ ...form, check_in: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-600 mb-1 block">Check-out</label>
                    <div className="relative">
                      <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="date" value={form.check_out} onChange={(e) => setForm({ ...form, check_out: e.target.value })}
                        className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm" />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="text-xs font-medium text-slate-600 mb-1 block">Guests</label>
                <div className="relative">
                  <Users size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select value={form.guests} onChange={(e) => setForm({ ...form, guests: +e.target.value })}
                    className="w-full pl-8 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm appearance-none">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n}>{n} Guest{n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>

              <div className="bg-teal-50 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-600">Price</span>
                  <span>₹{pricePerNight.toLocaleString()} {type === 'hotel' ? `× ${nights} night${nights > 1 ? 's' : ''} × ${form.guests}` : `× ${form.guests} guest${form.guests > 1 ? 's' : ''}`}</span>
                </div>
                <div className="flex justify-between font-bold text-base mt-2 pt-2 border-t border-teal-200">
                  <span>Total</span>
                  <span className="text-teal-700">₹{totalPrice.toLocaleString()}</span>
                </div>
              </div>

              <button onClick={() => setStep(2)} className="btn-primary w-full justify-center py-3">
                Continue to Confirm
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900">Review Your Booking</h3>
              <div className="space-y-2 text-sm">
                {[
                  ['Item', item.name || item.title],
                  type === 'hotel' && form.check_in ? ['Check-in', form.check_in] : null,
                  type === 'hotel' && form.check_out ? ['Check-out', form.check_out] : null,
                  ['Guests', `${form.guests}`],
                  ['Total', `₹${totalPrice.toLocaleString()}`],
                  ['Status', '✅ Simulated Confirmed'],
                ].filter(Boolean).map(([k, v]) => (
                  <div key={k} className="flex justify-between py-2 border-b border-slate-100">
                    <span className="text-slate-500">{k}</span>
                    <span className="font-medium text-slate-800">{v}</span>
                  </div>
                ))}
              </div>
              {error && <p className="text-red-500 text-sm">{error}</p>}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 py-2.5 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm transition-all">
                  Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                  className="flex-1 btn-primary justify-center py-2.5">
                  {loading ? <span className="spinner !w-4 !h-4 border-2" /> : <><CreditCard size={15} /> Confirm Booking</>}
                </button>
              </div>
            </div>
          )}

          {step === 3 && booking && (
            <div className="text-center space-y-4">
              <CheckCircle size={48} className="text-teal-500 mx-auto" />
              <div>
                <h3 className="text-xl font-bold text-slate-900">Booking Confirmed!</h3>
                <p className="text-slate-500 text-sm mt-1">Your demo booking has been saved.</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-4 text-left text-sm space-y-1">
                <p><span className="text-slate-500">Booking ID:</span> <strong>#{booking.id}</strong></p>
                <p><span className="text-slate-500">Total Paid (Demo):</span> <strong>₹{booking.total_price?.toLocaleString()}</strong></p>
                <p><span className="text-slate-500">Status:</span> <strong className="text-teal-600">Confirmed ✓</strong></p>
              </div>
              <p className="text-xs text-amber-600 bg-amber-50 p-2 rounded-lg">This is a demo booking. No real hotel room has been reserved.</p>
              <div className="flex gap-3">
                <button onClick={() => navigate('/dashboard')} className="flex-1 btn-primary justify-center py-3">
                  View Dashboard
                </button>
                <button onClick={onClose} className="flex-1 py-3 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 text-sm transition-all">
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
