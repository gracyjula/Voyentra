import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, Compass, ArrowRight, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BG = 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=1600&h=900&fit=crop';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) {
      setError('Passwords do not match.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const perks = [
    'Create and save unlimited trip itineraries',
    'Save favorite destinations, hotels & experiences',
    'Simulate hotel and package bookings',
    'Track your travel budget in real time',
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-cover bg-center"
        style={{ backgroundImage: `url(${BG})` }}>
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1628]/90 to-teal-900/70" />
        <div className="relative z-10 flex flex-col justify-center px-12">
          <Link to="/" className="flex items-center gap-2 mb-12">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Compass size={22} className="text-white" />
            </div>
            <span className="text-2xl font-bold text-white">Voyen<span className="text-teal-400">tra</span></span>
          </Link>
          <h2 className="text-4xl font-bold text-white leading-tight mb-4">
            Start Your<br />
            <span className="gradient-text">Journey Today.</span>
          </h2>
          <p className="text-slate-300 mb-8">Create your free account and unlock the full travel planning experience.</p>
          <div className="flex flex-col gap-3">
            {perks.map((p) => (
              <div key={p} className="flex items-center gap-3 text-slate-200 text-sm">
                <div className="w-6 h-6 rounded-full bg-teal-500/30 flex items-center justify-center flex-shrink-0">
                  <Check size={13} className="text-teal-400" />
                </div>
                {p}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-md">
          <Link to="/" className="flex items-center gap-2 justify-center lg:hidden mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
              <Compass size={19} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Voyen<span className="text-teal-500">tra</span></span>
          </Link>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 text-sm mb-6">
              Already have one? <Link to="/login" className="text-teal-600 font-medium hover:underline">Sign in</Link>
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text" required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    placeholder="Your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email" required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'} required
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    placeholder="Min. 6 characters"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPw ? 'text' : 'password'} required
                    value={form.confirm}
                    onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:border-teal-400 focus:ring-2 focus:ring-teal-100 transition-all"
                    placeholder="Repeat password"
                  />
                </div>
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3 text-base">
                {loading ? <span className="spinner !w-5 !h-5 border-2" /> : <>Create Account <ArrowRight size={18} /></>}
              </button>
            </form>
          </div>
          <p className="text-center text-xs text-slate-400 mt-6">
            This is a demo application. No real bookings or payments occur.
          </p>
        </div>
      </div>
    </div>
  );
}
